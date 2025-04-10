import { useAuth as useAuthContext } from '../contexts/AuthContext';

const useAuth = () => {
  const auth = useAuthContext();

  // Use actual auth state instead of mock values
  return {
    ...auth,
    hasPermission: (permission) => auth.user?.permissions?.includes(permission) || false
  };
};

export default useAuth;