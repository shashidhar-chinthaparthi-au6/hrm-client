import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiSettings,
  FiUserPlus,
  FiFileText,
  FiDollarSign,
  FiClock,
  FiAward,
} from 'react-icons/fi';

// Define roles and their access levels
export const ROLES = {
  ADMIN: 'admin',
  HR_MANAGER: 'hr_manager',
  EMPLOYEE: 'employee',
};

// Define route access permissions
export const routePermissions = {
  dashboard: [ROLES.ADMIN, ROLES.HR_MANAGER, ROLES.EMPLOYEE],
  employees: [ROLES.ADMIN, ROLES.HR_MANAGER],
  attendance: [ROLES.ADMIN, ROLES.HR_MANAGER, ROLES.EMPLOYEE],
  leave: [ROLES.ADMIN, ROLES.HR_MANAGER, ROLES.EMPLOYEE],
  payroll: [ROLES.ADMIN, ROLES.HR_MANAGER],
  performance: [ROLES.ADMIN, ROLES.HR_MANAGER, ROLES.EMPLOYEE],
  recruitment: [ROLES.ADMIN, ROLES.HR_MANAGER],
  settings: [ROLES.ADMIN],
};

// Navigation items configuration
export const navItems = [
  {
    name: 'Dashboard',
    path: 'dashboard',
    icon: FiHome,
  },
  {
    name: 'Employees',
    path: 'employees',
    icon: FiUsers,
    subItems: [
      {
        name: 'All Employees',
        path: 'employees/list',
        icon: FiUsers,
      },
      {
        name: 'Add Employee',
        path: 'employees/add',
        icon: FiUserPlus,
      },
    ],
  },
  {
    name: 'Attendance',
    path: 'attendance',
    icon: FiClock,
  },
  {
    name: 'Leave Management',
    path: 'leave',
    icon: FiCalendar,
  },
  {
    name: 'Payroll',
    path: 'payroll',
    icon: FiDollarSign,
  },
  {
    name: 'Performance',
    path: 'performance',
    icon: FiAward,
  },
  {
    name: 'Recruitment',
    path: 'recruitment',
    icon: FiFileText,
  },
  {
    name: 'Settings',
    path: 'settings',
    icon: FiSettings,
  },
];

// Helper function to check if a user has access to a route
export const hasRouteAccess = (userRole, routePath) => {
  if (!userRole || !routePath) return false;
  
  // Extract the base route from the path (e.g., 'employees/list' -> 'employees')
  const baseRoute = routePath.split('/')[0];
  
  // Check if the route exists in permissions and if the user's role has access
  return routePermissions[baseRoute]?.includes(userRole) || false;
};

// Helper function to get all accessible routes for a role
export const getAccessibleRoutes = (role) => {
  if (!role) return [];
  
  return Object.entries(routePermissions)
    .filter(([_, roles]) => roles.includes(role))
    .map(([route]) => route);
}; 