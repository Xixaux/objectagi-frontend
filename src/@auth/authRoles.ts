/**
 * authRoles.ts
 * 
 * This file defines role-based authorization for the ObjectAGI application.
 * 
 * CHANGES MADE:
 * 1. Kept the structure simple and consistent.
 * 2. Ensured 'user' role is properly defined so any logged-in user with role 'user' gets access.
 * 3. Added 'authenticated' as a catch-all for any logged-in user (recommended for most protected routes).
 * 4. Added clear comments so it's easier to maintain in the future.
 * 5. Roles are kept in lowercase as per your original convention.
 */

export const authRoles = {
    /**
     * Admin role - only users with 'admin' role
     */
    admin: ['admin'],

    /**
     * Staff role - allows 'admin' or 'staff'
     */
    staff: ['admin', 'staff'],

    /**
     * User role - allows 'admin', 'staff', or 'user'
     * This is the most commonly used one for normal authenticated users.
     * IMPORTANT: Your JWT currently sends role as ['user'], so this must include 'user'.
     */
    user: ['admin', 'staff', 'user'],

    /**
     * OnlyGuest - used for pages that should ONLY be accessible when NOT logged in
     */
    onlyGuest: [],

    /**
     * Authenticated - Catch-all for ANY logged-in user (regardless of specific role)
     * Use this on most protected routes if you don't want strict role checking.
     */
    authenticated: ['admin', 'staff', 'user']
} as const;

// Optional: Keep default export for backward compatibility
export default authRoles;