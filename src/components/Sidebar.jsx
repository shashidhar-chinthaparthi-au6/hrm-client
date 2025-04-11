import React from 'react';
import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  IconButton,
  useDisclosure,
  VStack,
  HStack,
  Icon,
  Collapse,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react';
import {
  FiMenu,
  FiHome,
  FiUsers,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { navItems, hasRouteAccess } from '../config/navigation';

const NavItem = ({ icon, children, path, subItems, ...rest }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const isActive = location.pathname === `/${path}`;
  const { user } = useAuth();

  const handleClick = () => {
    if (subItems) {
      setIsOpen(!isOpen);
    } else {
      navigate(`/${path}`);
    }
  };

  if (!hasRouteAccess(user?.role, path)) {
    return null;
  }

  return (
    <Box>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        onClick={handleClick}
        bg={isActive ? 'blue.400' : 'transparent'}
        color={isActive ? 'white' : 'inherit'}
        _hover={{
          bg: 'blue.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && <Icon mr="4" fontSize="16" as={icon} />}
        <Text flex="1">{children}</Text>
        {subItems && (
          <Icon
            as={isOpen ? FiChevronDown : FiChevronRight}
            ml="auto"
          />
        )}
      </Flex>
      {subItems && (
        <Collapse in={isOpen}>
          <VStack spacing={1} pl={4}>
            {subItems.map((item) => (
              <NavItem
                key={item.path}
                icon={item.icon}
                path={item.path}
              >
                {item.name}
              </NavItem>
            ))}
          </VStack>
        </Collapse>
      )}
    </Box>
  );
};

const SidebarContent = ({ onClose, ...rest }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          HRM System
        </Text>
      </Flex>
      <VStack spacing={1} align="stretch">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            path={item.path}
            subItems={item.subItems}
          >
            {item.name}
          </NavItem>
        ))}
        <NavItem
          icon={FiMenu}
          onClick={handleLogout}
          cursor="pointer"
        >
          Logout
        </NavItem>
      </VStack>
    </Box>
  );
};

const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} p="4">
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />
      </Box>
    </Box>
  );
};

export default Sidebar; 