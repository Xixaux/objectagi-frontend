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

    // Skip guard completely for sign-in page
    if (pathname === '/sign-in') {
      setAccessGranted(true);
      return;
    }

    // If user is logged in, allow access
    if (!isGuest) {
      setAccessGranted(true);
      return;
    }

    // Guest on protected page → redirect to sign-in
    if (isGuest && pathname !== '/sign-in') {
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