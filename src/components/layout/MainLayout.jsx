import React, { useState, useEffect, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation, Link, Route, Routes } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton, Container, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, CircularProgress } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import './MainLayout.css';

// Lazy load page components for better performance
const Dashboard = lazy(() => import('../../pages/auth/Dashboard'));
const EmployeeDirectory = lazy(() => import('../../pages/employee/EmployeeDirectory'));
const AddEmployee = lazy(() => import('../../pages/employees/AddEmployee'));
const OrganizationChart = lazy(() => import('../../pages/employee/OrganizationChart'));
const EmployeeDetails = lazy(() => import('../../pages/employee/EmployeeDetails'));
const EditEmployee = lazy(() => import('../../pages/employee/EditEmployee'));
const Profile = lazy(() => import('../../pages/auth/Profile'));

const AttendanceManagement = lazy(() => import('../../pages/attendance/AttendanceManagement'));
const AttendanceReport = lazy(() => import('../../pages/attendance/AttendanceReport'));
const TimeTracking = lazy(() => import('../../pages/attendance/TimeTracking'));
const ShiftManagement = lazy(() => import('../../pages/attendance/ShiftManagement'));

const LeaveManagement = lazy(() => import('../../pages/leave/LeaveManagement'));
const ApplyLeave = lazy(() => import('../../pages/leave/ApplyLeave'));
const LeaveApproval = lazy(() => import('../../pages/leave/LeaveApproval'));
const LeaveSettings = lazy(() => import('../../pages/leave/LeaveSettings'));

const PayrollDashboard = lazy(() => import('../../pages/payroll/PayrollDashboard'));
const SalaryProcessing = lazy(() => import('../../pages/payroll/SalaryProcessing'));
const PayslipView = lazy(() => import('../../pages/payroll/PayslipView'));
const TaxManagement = lazy(() => import('../../pages/payroll/TaxManagement'));

const PerformanceReview = lazy(() => import('../../pages/performance/PerformanceReview'));
const GoalTracking = lazy(() => import('../../pages/performance/GoalTracking'));
const AppraisalCycles = lazy(() => import('../../pages/performance/AppraisalCycles'));
const Feedback360 = lazy(() => import('../../pages/performance/360Feedback'));

const UserSettings = lazy(() => import('../../pages/settings/UserSettings'));
const CompanySettings = lazy(() => import('../../pages/settings/CompanySettings'));
const SystemSettings = lazy(() => import('../../pages/settings/SystemSettings'));
const RolePermissions = lazy(() => import('../../pages/settings/RolePermissions'));

// Navigation items
const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { 
    name: 'Employees', 
    path: '/employees', 
    icon: <PeopleIcon />,
    subItems: [
      { name: 'Directory', path: '/employees' },
      { name: 'Add Employee', path: '/employees/add' },
      { name: 'Organization Chart', path: '/employees/org-chart' }
    ]
  },
  { 
    name: 'Attendance', 
    path: '/attendance', 
    icon: <EventNoteIcon />,
    subItems: [
      { name: 'Attendance Management', path: '/attendance' },
      { name: 'Reports', path: '/attendance/reports' },
      { name: 'Time Tracking', path: '/attendance/time-tracking' }
    ]
  },
  { 
    name: 'Leave', 
    path: '/leave', 
    icon: <EventBusyIcon />,
    subItems: [
      { name: 'Leave Management', path: '/leave' },
      { name: 'Apply Leave', path: '/leave/apply' },
      { name: 'Approval', path: '/leave/approval' },
      { name: 'Settings', path: '/admin/leave/settings' }
    ]
  },
  { 
    name: 'Payroll', 
    path: '/payroll', 
    icon: <AttachMoneyIcon />,
    subItems: [
      { name: 'Dashboard', path: '/payroll' },
      { name: 'Process Salary', path: '/payroll/process' },
      { name: 'Tax Management', path: '/admin/payroll/tax' }
    ]
  },
  { 
    name: 'Performance', 
    path: '/performance', 
    icon: <AssessmentIcon />,
    subItems: [
      { name: 'Performance Review', path: '/performance' },
      { name: 'Goals', path: '/performance/goals' },
      { name: 'Appraisals', path: '/performance/appraisals' },
      { name: '360° Feedback', path: '/performance/feedback' }
    ]
  },
  { 
    name: 'Settings', 
    path: '/settings', 
    icon: <SettingsIcon />,
    subItems: [
      { name: 'User Settings', path: '/settings' },
      { name: 'Company Settings', path: '/admin/settings/company' },
      { name: 'System Settings', path: '/admin/settings/system' },
      { name: 'Role Permissions', path: '/admin/settings/roles' }
    ]
  },
];

// SimpleSidebar with navigation
const SimpleSidebar = ({ isOpen, onToggle, userRole = 'user' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState({});
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavClick = async (path, hasSubItems, name) => {
    if (hasSubItems) {
      setExpandedItems(prev => ({ ...prev, [name]: !prev[name] }));
    } else {
      setIsNavigating(true);
      try {
        await navigate(path);
      } finally {
        setIsNavigating(false);
      }
    }
  };
  
  // Filter subItems based on user role
  const getFilteredSubItems = (subItems) => {
    if (!subItems) return [];
    return subItems.filter(item => {
      // Admin routes start with /admin/
      if (item.path.startsWith('/admin/')) {
        return userRole === 'admin';
      }
      return true;
    });
  };
  
  return (
    <Box 
      sx={{ 
        width: isOpen ? 250 : 60,
        transition: 'width 0.3s',
        bgcolor: 'primary.main',
        color: 'white',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1200,
        overflow: 'hidden',
        overflowY: 'auto',
        opacity: isNavigating ? 0.7 : 1,
        pointerEvents: isNavigating ? 'none' : 'auto'
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h6">HR System</Typography>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      
      <List sx={{ p: 1 }}>
        {navigationItems.map((item) => {
          const filteredSubItems = getFilteredSubItems(item.subItems);
          // Skip rendering items with no accessible subitems for non-admin users
          if (item.subItems && filteredSubItems.length === 0) {
            return null;
          }
          
          return (
            <React.Fragment key={item.path}>
              <ListItem
                button
                onClick={() => handleNavClick(item.path, filteredSubItems.length > 0, item.name)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  bgcolor: location.pathname === item.path || location.pathname.startsWith(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)'
                  },
                  px: 2,
                  py: 1
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
                  {item.icon}
                </ListItemIcon>
                {isOpen && (
                  <>
                    <ListItemText 
                      primary={item.name}
                      sx={{ opacity: isOpen ? 1 : 0 }}
                    />
                    {filteredSubItems.length > 0 && (
                      <IconButton 
                        size="small" 
                        sx={{ color: 'white' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedItems(prev => ({ ...prev, [item.name]: !prev[item.name] }));
                        }}
                      >
                        {expandedItems[item.name] ? 
                          <span style={{ fontSize: '1.2rem' }}>&#9650;</span> : 
                          <span style={{ fontSize: '1.2rem' }}>&#9660;</span>}
                      </IconButton>
                    )}
                  </>
                )}
              </ListItem>
              
              {isOpen && filteredSubItems.length > 0 && expandedItems[item.name] && (
                <List component="div" disablePadding>
                  {filteredSubItems.map(subItem => (
                    <ListItem
                      key={subItem.path}
                      button
                      onClick={() => navigate(subItem.path)}
                      sx={{
                        pl: 4,
                        py: 0.5,
                        borderRadius: 1,
                        ml: 2,
                        bgcolor: location.pathname === subItem.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.1)'
                        },
                      }}
                    >
                      <ListItemText 
                        primary={subItem.name} 
                        primaryTypographyProps={{ 
                          fontSize: '0.875rem',
                          fontWeight: location.pathname === subItem.path ? 'bold' : 'normal'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

const SimpleHeader = ({ onToggleSidebar, userName = 'User', onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine current page name from path
  const getCurrentPageName = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/profile') return 'Profile';
    
    // For nested routes like /employees/add
    const mainPath = path.split('/')[1];
    const subPath = path.split('/')[2];
    
    const currentNav = navigationItems.find(item => 
      item.path === `/${mainPath}`
    );
    
    if (currentNav) {
      if (subPath) {
        // Capitalize first letter of subpath
        return `${currentNav.name} / ${subPath.charAt(0).toUpperCase() + subPath.slice(1)}`;
      }
      return currentNav.name;
    }
    
    return 'HR Management System';
  };
  
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };
  
  return (
    <AppBar position="fixed" sx={{ zIndex: 1100 }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
          onClick={onToggleSidebar}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {getCurrentPageName()}
        </Typography>
        <Typography variant="body2" sx={{ mr: 2 }}>
          Hello, {userName}
        </Typography>
        <IconButton 
          color="inherit"
          sx={{ mr: 1 }}
          onClick={() => navigate('/profile')}
          title="Profile"
        >
          <AccountCircleIcon />
        </IconButton>
        <IconButton 
          color="inherit" 
          onClick={handleLogout}
          title="Logout"
        >
          <LogoutIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

const SimpleFooter = () => (
  <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
    <Typography variant="body2" align="center">
      &copy; {new Date().getFullYear()} HR Management System
    </Typography>
  </Box>
);

// Main content area to display the loaded pages
const MainContent = ({ path }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Add a small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [path]);

  const getComponentForPath = (path) => {
    if (isLoading) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <CircularProgress />
        </Box>
      );
    }

    switch (path) {
      case '/dashboard':
        return <Dashboard />;
      case '/profile':
        return <Profile />;
      
      // Employee paths
      case '/employees':
        return <EmployeeDirectory />;
      case '/employees/add':
        return <AddEmployee />;
      case '/employees/org-chart':
        return <OrganizationChart />;
      
      // Attendance paths
      case '/attendance':
        return <AttendanceManagement />;
      case '/attendance/reports':
        return <AttendanceReport />;
      case '/attendance/time-tracking':
        return <TimeTracking />;
      
      // Leave paths
      case '/leave':
        return <LeaveManagement />;
      case '/leave/apply':
        return <ApplyLeave />;
      case '/leave/approval':
        return <LeaveApproval />;
      case '/admin/leave/settings':
        return <LeaveSettings />;
      
      // Payroll paths
      case '/payroll':
        return <PayrollDashboard />;
      case '/payroll/process':
        return <SalaryProcessing />;
      case '/admin/payroll/tax':
        return <TaxManagement />;
      
      // Performance paths
      case '/performance':
        return <PerformanceReview />;
      case '/performance/goals':
        return <GoalTracking />;
      case '/performance/appraisals':
        return <AppraisalCycles />;
      case '/performance/feedback':
        return <Feedback360 />;
      
      // Settings paths
      case '/settings':
        return <UserSettings />;
      case '/admin/settings/company':
        return <CompanySettings />;
      case '/admin/settings/system':
        return <SystemSettings />;
      case '/admin/settings/roles':
        return <RolePermissions />;
      
      default:
        // If no match is found, show the dashboard or a not found component
        return <Dashboard />;
    }
  };

  return (
    <Box sx={{ 
      position: 'relative',
      minHeight: '60vh',
      transition: 'opacity 0.3s ease-in-out',
      opacity: isLoading ? 0.7 : 1
    }}>
      <Suspense fallback={
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '60vh'
        }}>
          <CircularProgress />
        </Box>
      }>
        {getComponentForPath(path)}
      </Suspense>
    </Box>
  );
};

const MainLayout = ({
  children,
  user = { name: 'Guest User', role: 'guest' },
  logo,
  appName = 'HR Management',
  menuItems = [],
  notifications = [],
  sidebarDefaultOpen = true,
  showBreadcrumbs = true,
  footerProps = {},
  onLogout = () => console.log('Logout clicked'),
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(sidebarDefaultOpen);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Generate breadcrumbs based on current location
  const generateBreadcrumbs = () => {
    const path = location.pathname;
    const pathSegments = path.split('/').filter(segment => segment !== '');
    
    if (pathSegments.length === 0) {
      return [{ name: 'Dashboard', path: '/dashboard' }];
    }
    
    return pathSegments.map((segment, index) => {
      // First segment (main section)
      if (index === 0) {
        const mainNav = navigationItems.find(item => 
          item.path === `/${segment}`
        );
        return {
          name: mainNav ? mainNav.name : segment.charAt(0).toUpperCase() + segment.slice(1),
          path: `/${segment}`
        };
      }
      
      // Handle subpages
      const currentPath = `/${pathSegments.slice(0, index + 1).join('/')}`;
      return {
        name: segment.charAt(0).toUpperCase() + segment.slice(1),
        path: currentPath
      };
    });
  };

  // Mobile screen detection
  useEffect(() => {
    const checkScreenSize = () => {
      const mobileBreakpoint = 768;
      const isMobileScreen = window.innerWidth < mobileBreakpoint;
      setIsMobile(isMobileScreen);
      
      // Auto close sidebar on mobile
      if (isMobileScreen && isSidebarOpen) {
        setSidebarOpen(false);
      } else if (!isMobileScreen && !isSidebarOpen && sidebarDefaultOpen) {
        setSidebarOpen(true);
      }
    };

    // Initial check
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [sidebarDefaultOpen, isSidebarOpen]);

  useEffect(() => {
    // Update currentPath when location changes
    setCurrentPath(location.pathname);
  }, [location]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Box sx={{ display: 'flex' }}>
      <SimpleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} userRole={user.role} />
      
      <Box sx={{ 
        flexGrow: 1, 
        ml: isSidebarOpen ? { xs: 0, sm: '250px' } : { xs: 0, sm: '60px' },
        transition: 'margin-left 0.3s',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <SimpleHeader 
          onToggleSidebar={toggleSidebar} 
          userName={user.name} 
          onLogout={onLogout}
        />
        
        <Box component="main" sx={{ 
          flexGrow: 1, 
          p: 3, 
          mt: 8, // Add margin for the AppBar
          bgcolor: 'background.default'
        }}>
          {showBreadcrumbs && (
            <Paper sx={{ p: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.path}>
                    {index > 0 && (
                      <Typography variant="body2" sx={{ mx: 1 }} color="text.secondary">
                        /
                      </Typography>
                    )}
                    <Link 
                      to={crumb.path}
                      style={{ 
                        textDecoration: 'none', 
                        color: index === breadcrumbs.length - 1 ? 'inherit' : 'primary' 
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        color={index === breadcrumbs.length - 1 ? 'text.primary' : 'primary'}
                        sx={{ 
                          fontWeight: index === breadcrumbs.length - 1 ? 'bold' : 'normal',
                        }}
                      >
                        {crumb.name}
                      </Typography>
                    </Link>
                  </React.Fragment>
                ))}
              </Box>
            </Paper>
          )}
          
          <Container maxWidth="lg">
            <MainContent path={currentPath} />
          </Container>
        </Box>
        
        <SimpleFooter />
      </Box>
    </Box>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.string,
    role: PropTypes.string,
  }),
  logo: PropTypes.string,
  appName: PropTypes.string,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.node,
      subItems: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
        })
      ),
    })
  ),
  notifications: PropTypes.array,
  sidebarDefaultOpen: PropTypes.bool,
  showBreadcrumbs: PropTypes.bool,
  footerProps: PropTypes.object,
  onLogout: PropTypes.func,
};

export default MainLayout;