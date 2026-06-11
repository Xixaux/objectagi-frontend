// src/app/(public)/sign-up/page.tsx (FIXED)
'use client';

// FIX 1: Must use NAMED IMPORT {} because authRoles.ts uses 'export const authRoles'
import { authRoles } from '@auth/authRoles'; 
import AuthGuardRedirect from '@auth/AuthGuardRedirect';
import SignUpPage from './SignUpPage';

function Page() {
    // FIX 2: Add a defensive null check. 
    // If authRoles is undefined during module initialization, 
    // we pass a safe empty array ([]) instead of crashing.
    return (
        <AuthGuardRedirect auth={authRoles ? authRoles.onlyGuest : []}>
            <SignUpPage />
        </AuthGuardRedirect>
    );
}

export default Page;

/*
'use client';

import authRoles from '@auth/authRoles';
import AuthGuardRedirect from '@auth/AuthGuardRedirect';
import SignUpPage from './SignUpPage';

function Page() {
    return (
        <AuthGuardRedirect auth={authRoles.onlyGuest}>
            <SignUpPage />
        </AuthGuardRedirect>
    );
}

export default Page;
*/