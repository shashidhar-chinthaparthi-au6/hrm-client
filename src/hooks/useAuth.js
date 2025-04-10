import { useAuth as useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const auth = useAuthContext();

  // Use actual auth state instead of mock values
  return {
    ...auth,
    hasPermission: (permission) => auth.user?.permissions?.includes(permission) || false
  };
};