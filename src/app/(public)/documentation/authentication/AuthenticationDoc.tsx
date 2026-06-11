import Typography from '@mui/material/Typography';
import ObjectAGIHighlight from '@objectagi/core/ObjectAGIHighlight';
import Link from '@mui/material/Link';

/**
 * Authentication Documentation
 * This guide details the authentication setup in ObjectAGI React using Next.js App Router.
 */
function AuthenticationDoc() {
    return (
        <>
            <Typography
                variant="h4"
                className="mb-10 font-bold"
            >
                Authentication in ObjectAGI React with Next.js App Router
            </Typography>
            <Typography
                className="mb-4"
                component="p"
            >
                ObjectAGI React leverages Auth.js (previously NextAuth.js) for managing authentication, seamlessly integrated with Next.js 13's App Router. Auth.js offers a comprehensive, open-source solution for authentication, designed to work effortlessly with Next.js applications.
            </Typography>
            <Typography
                variant="h5"
                className="mt-8 mb-2 font-bold"
            >
                Key Features of Auth.js with App Router
            </Typography>
            <ul className="list-disc list-inside mb-4">
                <li>Seamless integration with Next.js 13 App Router</li>
                <li>Support for OAuth providers and custom credentials</li>
                <li>Server-side session management</li>
                <li>Built-in CSRF protection</li>
                <li>TypeScript support</li>
            </ul>
            <Typography
                variant="h5"
                className="mt-8 mb-2 font-bold"
            >
                Configuration
            </Typography>
            <Typography
                className="mb-4"
                component="p"
            >
                The Auth.js configuration file is located at <code>@auth/authjs.ts</code>.
            </Typography>
            <Typography
                className="mb-4"
                component="p"
            >
                You can incorporate providers such as Facebook, GitHub, Twitter, and others. Refer to the Auth.js documentation for further details.
            </Typography>
            <Typography
                className="mb-4"
                component="p"
            >
                Below is a sample configuration for integrating a Google login provider:
            </Typography>
            <ObjectAGIHighlight
                component="pre"
                className="language-typescript mb-6"
            >
                {`
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // Include additional providers here
  ],
  // Insert custom configuration options here
})

export { handler as GET, handler as POST }
                `}
            </ObjectAGIHighlight>
            <Typography
                variant="h5"
                className="mt-8 mb-2 font-bold"
            >
                Custom Session Handling
            </Typography>
            <Typography
                className="mb-4"
                component="p"
            >
                In ObjectAGI React, we’ve enhanced Auth.js’s default session handling to include additional user data. Upon login, we retrieve extra user information from an API and incorporate it into the session, enabling easy access to detailed user data across the application.
            </Typography>
            <Typography
                className="mb-4"
                component="p"
            >
                This is how it’s implemented in the <code>authJs.ts</code> file:
            </Typography>
            <ObjectAGIHighlight
                component="pre"
                className="language-typescript mb-6"
            >
                {`
// src/@auth/authJs.ts
// ... other imports and configurations ...

const config = {
  // ... other config options ...
  callbacks: {
    async session({ session, token }) {
      if (token.accessToken && typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken;
      }

      if (session && token.sub && typeof token.sub === 'string') {
        const userId = token.sub;
        const userDbData = await fetchUserData(userId, session);
        session.db = userDbData || null;
      }

      return session;
    }
  },
  // ... other config options ...
};

async function fetchUserData(userId: string, session: Session): Promise<User | null> {
  // Retrieve user data from the API or create a new user if not found
  // ... implementation details ...
}

// Expand the Session type to include custom properties
declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    db: User;
  }
}
                `}
            </ObjectAGIHighlight>
            <Typography
                className="mb-4"
                component="p"
            >
                This customized session handling enables storage of additional user details, such as roles, settings, or other custom attributes, making them readily accessible throughout the application.
            </Typography>
            <Typography
                variant="h5"
                className="mt-8 mb-2 font-bold"
            >
                useUser Hook
            </Typography>
            <Typography
                className="mb-4"
                component="p"
            >
                ObjectAGI React includes a custom <code>useUser</code> hook to streamline access to user data and provide utility functions for user management. Built on top of Auth.js’s <code>useSession</code> hook, it offers enhanced functionality.
            </Typography>
            <Typography
                className="mb-4"
                component="p"
            >
                Here’s an overview of the <code>useUser</code> hook:
            </Typography>
            <ObjectAGIHighlight
                component="pre"
                className="language-typescript mb-6"
            >
                {`
// src/@auth/useUser.tsx
import { useSession, signOut } from 'next-auth/react';
// ... furtherimports ...

function useUser(): useUser {
  const { data, update } = useSession();

  const user = useMemo(() => data?.db, [data]);
  const isGuest = useMemo(() => !user?.role || user?.role?.length === 0, [user]);

  async function handleUpdateUser(updates: Partial<User>) {
    // Modify user data
  }

  async function handleUpdateUserSettings(newSettings: User['settings']) {
    // Adjust user settings
  }

  // ... other utility functions ...

  return {
    data: user,
    isGuest,
    signOut: handleSignOut,
    updateUser: handleUpdateUser,
    updateUserSettings: handleUpdateUserSettings
  } as useUser;
}

export default useUser;
                `}
            </ObjectAGIHighlight>
            <Typography
                className="mb-4"
                component="p"
            >
                The <code>useUser</code> hook offers the following features:
            </Typography>
            <ul className="list-disc list-inside mb-4">
                <li>Access to the current user’s data</li>
                <li>An indicator for whether the user is a guest</li>
                <li>Functions to modify user data and settings</li>
                <li>A wrapper for the sign-out functionality</li>
            </ul>
            <Typography
                className="mb-4"
                component="p"
            >
                You can utilize this hook in your components to easily manage and access user data:
            </Typography>
            <ObjectAGIHighlight
                component="pre"
                className="language-tsx mb-6"
            >
                {`
import useUser from '@auth/useUser';

function UserProfile() {
  const { data: user, updateUser, isGuest } = useUser();

  if (isGuest) {
    return <p>Please sign in to view your profile.</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      {/* Add more user profile information and management here */}
    </div>
  );
}
                `}
            </ObjectAGIHighlight>
            <Typography
                className="mt-8 mb-4"
                component="p"
            >
                By utilizing the custom session handling and the <code>useUser</code> hook, ObjectAGI React delivers a robust and adaptable approach to managing user authentication and data across your application.
            </Typography>
            <Typography
                variant="h5"
                className="mt-8 mb-2 font-bold"
            >
                Further Resources
            </Typography>
            <Typography
                className="mb-4"
                component="p"
            >
                For additional details and advanced usage, consult the following resources:
            </Typography>
            <ul className="list-disc list-inside mb-4">
                <li>
                    <Link
                        href="https://authjs.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Auth.js Official Documentation
                    </Link>
                </li>
            </ul>
            <Typography
                className="mt-8 mb-4"
                component="p"
            >
                By integrating Auth.js with Next.js App Router, ObjectAGI React offers a secure, customizable, and efficient authentication system that works seamlessly with server components and can be tailored to meet your project’s unique needs.
            </Typography>
        </>
    );
}

export default AuthenticationDoc;