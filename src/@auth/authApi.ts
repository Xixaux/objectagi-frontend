// @auth/authApi.ts (FIXED: Added URL encoding to email fetch)

import { User } from '@auth/user';
import UserModel from '@auth/user/models/UserModel';
import { PartialDeep } from 'type-fest';
import apiFetch from '@/utils/apiFetch';

/**
 * Get user by id
 */
export async function authGetDbUser(userId: string): Promise<Response> {
    return apiFetch(`/api/AuthUser/${userId}`); 
}

/**
 * Get user by email
 * CRITICAL FIX: Ensure email is URL-encoded for the path to prevent 404 errors with the '@' symbol.
 */
export async function authGetDbUserByEmail(email: string): Promise<Response> {
    // 🛑 CRITICAL FIX APPLIED HERE 🛑
    const encodedEmail = encodeURIComponent(email);
    console.log(`[authApi] Fetching user at endpoint: /api/AuthUser/email/${encodedEmail}`);
    return apiFetch(`/api/AuthUser/email/${encodedEmail}`);
}

/**
 * Update user
 */
export function authUpdateDbUser(user: PartialDeep<User>) {
    return apiFetch(`/api/AuthUser/${user.id}`, { 
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: user.firstName,
            lastName: user.lastName,
        })
    });
}

/**
 * Create user - Confirmed to be correct.
 */
export async function authCreateDbUser(user: PartialDeep<User>) {
    const registerRequest = {
        email: user.email,
        password: user.password,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
    };
    
    return apiFetch('/api/Auth/register', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerRequest)
    });
}