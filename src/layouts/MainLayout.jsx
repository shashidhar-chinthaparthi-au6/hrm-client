import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, useDisclosure } from '@chakra-ui/react';
import SimpleSidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { hasRouteAccess } from '../config/navigation';

const MainLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Check if user has access to current route
    const currentRoute = location.pathname.substring(1); // Remove leading slash
    if (!hasRouteAccess(user?.role, currentRoute)) {
      navigate('/dashboard');
    }
  }, [location.pathname, user?.role, navigate]);

  const getFilteredSubItems = (subItems) => {
    if (!subItems) return [];
    return subItems.filter(item => hasRouteAccess(user?.role, item.path));
  };

  return (
    <Box minH="100vh">
      <SimpleSidebar
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        getFilteredSubItems={getFilteredSubItems}
      />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout; 