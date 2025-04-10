// permissions.js - Permission checks

/**
 * Permission constants
 */
export const PERMISSIONS = {
    // Employee permissions
    EMPLOYEE_VIEW: 'employee:view',
    EMPLOYEE_CREATE: 'employee:create',
    EMPLOYEE_EDIT: 'employee:edit',
    EMPLOYEE_DELETE: 'employee:delete',
    
    // Attendance permissions
    ATTENDANCE_VIEW: 'attendance:view',
    ATTENDANCE_VIEW_ALL: 'attendance:view:all',
    ATTENDANCE_MARK: 'attendance:mark',
    ATTENDANCE_EDIT: 'attendance:edit',
    
    // Leave permissions
    LEAVE_VIEW: 'leave:view',
    LEAVE_VIEW_ALL: 'leave:view:all',
    LEAVE_REQUEST: 'leave:request',
    LEAVE_APPROVE: 'leave:approve',
    LEAVE_SETTINGS: 'leave:settings',
    
    // Payroll permissions
    PAYROLL_VIEW: 'payroll:view',
    PAYROLL_VIEW_ALL: 'payroll:view:all',
    PAYROLL_PROCESS: 'payroll:process',
    PAYROLL_SETTINGS: 'payroll:settings',
    
    // Performance permissions
    PERFORMANCE_VIEW: 'performance:view',
    PERFORMANCE_VIEW_ALL: 'performance:view:all',
    PERFORMANCE_CREATE: 'performance:create',
    PERFORMANCE_APPROVE: 'performance:approve',
    
    // Admin permissions
    ADMIN_SETTINGS: 'admin:settings',
    ADMIN_USERS: 'admin:users',
    ADMIN_ROLES: 'admin:roles'
  };
  
  /**
   * Role constants
   */
  export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    HR_MANAGER: 'hr_manager',
    HR_EXECUTIVE: 'hr_executive',
    MANAGER: 'manager',
    EMPLOYEE: 'employee'
  };
  
  /**
   * Default role permissions
   */
  export const ROLE_PERMISSIONS = {
    [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
    [ROLES.ADMIN]: [
      PERMISSIONS.EMPLOYEE_VIEW,
      PERMISSIONS.EMPLOYEE_CREATE,
      PERMISSIONS.EMPLOYEE_EDIT,
      PERMISSIONS.EMPLOYEE_DELETE,
      PERMISSIONS.ATTENDANCE_VIEW_ALL,
      PERMISSIONS.ATTENDANCE_EDIT,
      PERMISSIONS.LEAVE_VIEW_ALL,
      PERMISSIONS.LEAVE_APPROVE,
      PERMISSIONS.LEAVE_SETTINGS,
      PERMISSIONS.PAYROLL_VIEW_ALL,
      PERMISSIONS.PAYROLL_PROCESS,
      PERMISSIONS.PAYROLL_SETTINGS,
      PERMISSIONS.PERFORMANCE_VIEW_ALL,
      PERMISSIONS.PERFORMANCE_APPROVE,
      PERMISSIONS.ADMIN_SETTINGS,
      PERMISSIONS.ADMIN_USERS,
      PERMISSIONS.ADMIN_ROLES
    ],
    [ROLES.HR_MANAGER]: [
      PERMISSIONS.EMPLOYEE_VIEW,
      PERMISSIONS.EMPLOYEE_CREATE,
      PERMISSIONS.EMPLOYEE_EDIT,
      PERMISSIONS.ATTENDANCE_VIEW_ALL,
      PERMISSIONS.ATTENDANCE_EDIT,
      PERMISSIONS.LEAVE_VIEW_ALL,
      PERMISSIONS.LEAVE_APPROVE,
      PERMISSIONS.PAYROLL_VIEW_ALL,
      PERMISSIONS.PAYROLL_PROCESS,
      PERMISSIONS.PERFORMANCE_VIEW_ALL,
      PERMISSIONS.PERFORMANCE_APPROVE
    ],
    [ROLES.HR_EXECUTIVE]: [
      PERMISSIONS.EMPLOYEE_VIEW,
      PERMISSIONS.EMPLOYEE_CREATE,
      PERMISSIONS.ATTENDANCE_VIEW_ALL,
      PERMISSIONS.LEAVE_VIEW_ALL,
      PERMISSIONS.PAYROLL_VIEW_ALL,
      PERMISSIONS.PERFORMANCE_VIEW_ALL
    ],
    [ROLES.MANAGER]: [
      PERMISSIONS.EMPLOYEE_VIEW,
      PERMISSIONS.ATTENDANCE_VIEW_ALL,
      PERMISSIONS.ATTENDANCE_MARK,
      PERMISSIONS.LEAVE_VIEW_ALL,
      PERMISSIONS.LEAVE_APPROVE,
      PERMISSIONS.PAYROLL_VIEW,
      PERMISSIONS.PERFORMANCE_VIEW_ALL,
      PERMISSIONS.PERFORMANCE_CREATE,
      PERMISSIONS.PERFORMANCE_APPROVE
    ],
    [ROLES.EMPLOYEE]: [
      PERMISSIONS.EMPLOYEE_VIEW,
      PERMISSIONS.ATTENDANCE_VIEW,
      PERMISSIONS.ATTENDANCE_MARK,
      PERMISSIONS.LEAVE_VIEW,
      PERMISSIONS.LEAVE_REQUEST,
      PERMISSIONS.PAYROLL_VIEW,
      PERMISSIONS.PERFORMANCE_VIEW
    ]
  };
  
  /**
   * Check if user has specific permission
   * @param {string} permission - Permission to check
   * @param {Object} user - User object
   * @returns {boolean} True if user has permission
   */
  export const hasPermission = (permission, user) => {
    if (!user || !user.permissions) return false;
    
    // Super admin has all permissions
    if (user.role === ROLES.SUPER_ADMIN) return true;
    
    // Check user permissions array
    return user.permissions.includes(permission);
  };
  
  /**
   * Check if user has any of the given permissions
   * @param {string[]} permissions - Array of permissions to check
   * @param {Object} user - User object
   * @returns {boolean} True if user has any of the permissions
   */
  export const hasAnyPermission = (permissions, user) => {
    if (!user || !user.permissions || !permissions || !permissions.length) return false;
    
    // Super admin has all permissions
    if (user.role === ROLES.SUPER_ADMIN) return true;
    
    // Check if user has any of the specified permissions
    return permissions.some(permission => user.permissions.includes(permission));
  };
  
  /**
   * Check if user has all of the given permissions
   * @param {string[]} permissions - Array of permissions to check
   * @param {Object} user - User object
   * @returns {boolean} True if user has all the permissions
   */
  export const hasAllPermissions = (permissions, user) => {
    if (!user || !user.permissions || !permissions || !permissions.length) return false;
    
    // Super admin has all permissions
    if (user.role === ROLES.SUPER_ADMIN) return true;
    
    // Check if user has all the specified permissions
    return permissions.every(permission => user.permissions.includes(permission));
  };
  
  /**
   * Check if user is at least of the specified role level
   * @param {string} role - Minimum role required
   * @param {Object} user - User object
   * @returns {boolean} True if user has at least the specified role level
   */
  export const hasMinimumRole = (role, user) => {
    if (!user || !user.role) return false;
    
    const roleHierarchy = [
      ROLES.EMPLOYEE,
      ROLES.MANAGER,
      ROLES.HR_EXECUTIVE,
      ROLES.HR_MANAGER,
      ROLES.ADMIN,
      ROLES.SUPER_ADMIN
    ];
    
    const userRoleIndex = roleHierarchy.indexOf(user.role);
    const requiredRoleIndex = roleHierarchy.indexOf(role);
    
    // Invalid role
    if (userRoleIndex === -1 || requiredRoleIndex === -1) return false;
    
    // Check if user's role is at or above the required level
    return userRoleIndex >= requiredRoleIndex;
  };
  
  /**
   * Get permissions for a specific role
   * @param {string} role - Role to get permissions for
   * @returns {string[]} Array of permissions for the role
   */
  export const getRolePermissions = (role) => {
    return ROLE_PERMISSIONS[role] || [];
  };
  
  /**
   * Check if user is owner of a resource
   * @param {string} resourceUserId - User ID of resource owner
   * @param {Object} user - Current user
   * @returns {boolean} True if user is owner
   */
  export const isResourceOwner = (resourceUserId, user) => {
    if (!user || !user.id || !resourceUserId) return false;
    return user.id === resourceUserId;
  };
  
  export default {
    PERMISSIONS,
    ROLES,
    ROLE_PERMISSIONS,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasMinimumRole,
    getRolePermissions,
    isResourceOwner
  };