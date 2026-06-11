// @auth/useUser.tsx (FIXED: Added null check for authRoles to prevent TypeError)
import { useMemo } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User } from '@auth/user';
import { authUpdateDbUser } from '@auth/authApi';
import { authRoles } from './authRoles';
import _ from 'lodash';
import setIn from '@/utils/setIn';

type useUser = {
  data: User | null;
  isGuest: boolean;
  isLoading: boolean;
  updateUser: (updates: Partial<User>) => Promise<User | undefined>;
  updateUserSettings: (newSettings: User['settings']) => Promise<User['settings'] | undefined>;
  signOut: typeof signOut;
};

function useUser(): useUser {
  const { data, update, status } = useSession();

  const user = useMemo(() => {
    return data?.db || null;
  }, [data]);
  
  console.log('[useUser] useSession data:', data); 

  const isGuest = useMemo(() => {
    // FIX: Ensure user.role is treated as an array before checking roles
    const userRoles = Array.isArray(user?.role) ? user.role : [];
    
    // 🛑 CRITICAL FIX: Guard against authRoles being undefined during initialization
    const hasRequiredRole = (authRoles && authRoles.user) 
        ? userRoles.some(role => authRoles.user.includes(role))
        : false;

    // A guest is a user that is not loading and does not have a required role.
    const guest = !hasRequiredRole;
    
    console.log('[useUser] isGuest:', guest, 'User:', user, 'Roles:', userRoles);
    return guest;
  }, [user]);

  const isLoading = status === 'loading';
  
  const userRoles = Array.isArray(user?.role) ? user.role : [];
  console.log('[useUser] isLoading:', isLoading, 'Status:', status);

  async function handleUpdateUser(_data: Partial<User>) {
    const response = await authUpdateDbUser(_data);

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    const updatedUser = (await response.json()) as User;
    setTimeout(() => update(), 300);
    return updatedUser;
  }

  async function handleUpdateUserSettings(newSettings: User['settings']) {
    const newUser = setIn(user, 'settings', newSettings) as User;
    if (_.isEqual(user, newUser)) return undefined;
    const updatedUser = await handleUpdateUser(newUser);
    return updatedUser?.settings;
  }

  async function handleSignOut() {
    return signOut();
  }

  return {
    data: user,
    isGuest,
    isLoading,
    signOut: handleSignOut,
    updateUser: handleUpdateUser,
    updateUserSettings: handleUpdateUserSettings,
  };
}

export default useUser;