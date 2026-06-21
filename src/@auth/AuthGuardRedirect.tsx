'use client';

import React, { useEffect, useState } from 'react';
import useUser from './useUser';
import useNavigate from '@objectagi/hooks/useNavigate';
import usePathname from '@objectagi/hooks/usePathname';
import ObjectAGILoading from '@objectagi/core/ObjectAGILoading';

type AuthGuardProps = {
  auth?: any;
  children: React.ReactNode;
};

function AuthGuardRedirect({ children }: AuthGuardProps) {
  const { isGuest, isLoading } = useUser();
  const navigate = useNavigate();
  const pathname = usePathname();

  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setAccessGranted(false);
      return;
    }

    // Define all routes that unauthenticated guests are allowed to visit
    const publicRoutes = ['/sign-in', '/sign-up', '/register', '/forgot-password'];

    // Skip guard completely if the current path is a whitelisted public page
    if (publicRoutes.includes(pathname)) {
      setAccessGranted(true);
      return;
    }

    // If user is logged in, allow access
    if (!isGuest) {
      setAccessGranted(true);
      return;
    }

    // Guest on a protected page → redirect securely back to sign-in
    if (isGuest && !publicRoutes.includes(pathname)) {
      navigate('/sign-in');
    }

    setAccessGranted(false);
  }, [isGuest, isLoading, pathname, navigate]);

  if (accessGranted) {
    return <>{children}</>;
  }

  return <ObjectAGILoading />;
}

export default AuthGuardRedirect;