// src/app/(public)/sign-in/page.tsx (FIXED)
'use client';

// FIX 1: Import must use NAMED IMPORT {} because authRoles.ts should use 'export const'
import { authRoles } from '@auth/authRoles'; 
import AuthGuardRedirect from '@auth/AuthGuardRedirect';
import SignInPage from './SignInPage';

function Page() {
    // FIX 2: Add a defensive null check. If authRoles is undefined, pass a safe empty array.
    return (
        <AuthGuardRedirect auth={authRoles ? authRoles.onlyGuest : []}>
            <SignInPage />
        </AuthGuardRedirect>
    );
}

export default Page;

/*
'use client';

import authRoles from '@auth/authRoles';
import AuthGuardRedirect from '@auth/AuthGuardRedirect';
import SignInPage from './SignInPage';

function Page() {
    return (
        <AuthGuardRedirect auth={authRoles.onlyGuest}>
            <SignInPage />
        </AuthGuardRedirect>
    );
}

export default Page;
*/