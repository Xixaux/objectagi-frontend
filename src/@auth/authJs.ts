// @auth/authJs.ts (FINAL FIX: Implementing logic gate for Credentials vs Social)
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { User } from '@auth/user';
import { authGetDbUserByEmail, authCreateDbUser } from './authApi';
import { FetchApiError } from '@/utils/apiFetch';

const providers = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      console.log('[authJs] Authorize called:', credentials?.email);
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Email and password are required');
      }

      // Dynamically pull the live AWS backend URL, or fall back to localhost for local dev execution
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5275';
      console.log('[authJs] Connecting to backend auth endpoint at:', `${backendUrl}/api/Auth/login`);

      // CRITICAL: This must successfully call your backend login endpoint
      const response = await fetch(`${backendUrl}/api/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('[authJs] Authorize failed: Backend returned non-JSON content.', await response.text());
        throw new Error('Login failed: Server response was not valid JSON.');
      }

      if (!response.ok) {
        console.error('[authJs] Authorize failed (Response not OK):', data);
        throw new Error(data.message || 'Login failed: Invalid credentials.');
      }

      const roles = Array.isArray(data.role)
          ? data.role.map((r: string) => r.toLowerCase())
          : [String(data.role || 'user').toLowerCase()];

      if (!data.userId || !data.email || !data.token) {
        console.error('[authJs] Authorize failed: Missing critical user data from backend.', data);
        throw new Error('Login failed: Backend response missing user ID, email, or token.');
      }

      const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();

      console.log('[authJs] Authorize response (SUCCESS):', { userId: data.userId, email: data.email, role: roles });

      return {
        id: data.userId,
        email: data.email,
        name: fullName,
        firstName: data.firstName,
        lastName: data.lastName,
        token: data.token, // JWT/Access Token from your backend
        role: roles,
      };
    },
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  }),
  FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID || '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
  }),
];

const config: NextAuthOptions = {
  theme: { logo: '/assets/images/logo/logo.svg' },
  pages: { signIn: '/sign-in' },
  providers,
  basePath: '/auth',
  trustHost: true,
  callbacks: {
    // FIX 1: Add 'account' parameter and set isSocial flag based on login type
    async jwt({ token, user, account }) {
      if (user) {
        // user object is available only during sign-in/creation
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.accessToken = user.token;
        token.role = user.role;
        // CRITICAL: Identify social logins here. Credentials logins will have account === null or account.type === 'credentials'
        token.isSocial = !!account && account.type !== 'credentials';
      }
      console.log('[authJs] JWT callback:', { id: token.id, email: token.email, role: token.role, isSocial: token.isSocial });
      return token;
    },

    async session({ session, token }) {
      if (token && token.id) {
        // Get the flag set in the JWT callback
        const isSocialLogin = token.isSocial;

        // 1. Initialize session.db from token data (this is the ONLY needed step for Credentials)
        const sessionRoles = Array.isArray(token.role)
            ? token.role.map(r => String(r).toLowerCase())
            : [String(token.role || 'user').toLowerCase()];

        session.db = {
          id: String(token.id),
          email: token.email as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          role: sessionRoles,
          displayName: `${token.firstName || ''} ${token.lastName || ''}`.trim() || null,
          photoURL: '',
          shortcuts: [],
          settings: {},
          loginRedirectUrl: '/apps/messenger',
        };
        session.accessToken = token.accessToken;

        // FIX 2: Implement the logic gate to SKIP secondary API calls for Credentials
        if (isSocialLogin) {
            console.log('[authJs] Starting secondary API sync for social user.');

            try {
              // This logic is only for social logins to sync the user profile and potentially create the user if 404
              console.log('[authJs] Fetching user (Social Sync):', session.db.email);
              const response = await authGetDbUserByEmail(session.db.email);
              const userDbData = (await response.json()) as User;

              const dbRoles = Array.isArray(userDbData.role)
                  ? userDbData.role.map(r => String(r).toLowerCase())
                  : [String(userDbData.role || 'user').toLowerCase()];

              console.log('[authJs] Social User fetched from DB:', { id: userDbData.id, email: userDbData.email, role: dbRoles });

              session.db = { ...session.db, ...userDbData,
                  role: dbRoles
              };

            } catch (error) {
              const errorStatus = (error as FetchApiError).status;

              if (errorStatus === 404) {
                  // Handle user creation for first-time social login
                  console.log('[authJs] Creating social user (404 catch):', session.db.email);

                  // NOTE: 'password' is not needed here
                  const newUserResponse = await authCreateDbUser({
                    email: session.db.email,
                    role: ['user'],
                    displayName: session.db.displayName,
                    photoURL: session.db.photoURL,
                    firstName: session.db.firstName,
                    lastName: session.db.lastName,
                  });
                  const newUser = (await newUserResponse.json()) as User;
                  const newRoles = Array.isArray(newUser.role)
                      ? newUser.role.map(r => String(r).toLowerCase())
                      : [String(newUser.role || 'user').toLowerCase()];

                  console.log('[authJs] Social user created:', { id: newUser.id, email: newUser.email, role: newRoles });
                  session.db = { ...session.db, ...newUser, role: newRoles };

              } else {
                // Log the error but proceed with the basic session from JWT.
                console.error('[authJs] Secondary fetch/API error (Non-404) during social sync:', error);
                console.warn('[authJs] Proceeding with basic session data from JWT due to fetch error. This may cause missing profile data.');
              }
            }
        } else {
            // This is the successful path for Credentials login!
            // We rely only on the validated data from the JWT (initialized in step 1).
            console.log('[authJs] Credentials login. Skipping secondary API sync.');
        }
      }

      console.log('[authJs] Session callback finished. Status:', session.db ? 'populated' : 'basic', 'Roles:', session.db?.role || 'none');
      return session;
    },
  },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  debug: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);

export type AuthJsProvider = {
  id: string;
  name: string;
  style?: { text?: string; bg?: string };
};

export const authJsProviderMap: AuthJsProvider[] = providers
  .map((provider) => {
    const providerData = typeof provider === 'function' ? provider() : provider;
    return {
      id: providerData.id,
      name: providerData.name,
      style: {
        text: (providerData as { style?: { text: string } }).style?.text,
        bg: (providerData as { style?: { bg: string } }).style?.bg,
      },
    };
  })
  .filter((provider) => provider.id !== 'credentials');