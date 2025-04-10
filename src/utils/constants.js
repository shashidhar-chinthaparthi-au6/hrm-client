/**
 * constants.js - Application-wide constants for the HR application
 */

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/api/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/api/auth/verify-email',
      PROFILE: '/auth/profile',
      CHANGE_PASSWORD: '/auth/change-password'
    },
    EMPLOYEE: {
      BASE: '/api/employees',
      DETAILS: (id) => `/api/employees/${id}`,
      DEPARTMENTS: '/api/departments',
      DESIGNATIONS: '/api/designations',
      PROFILE_PICTURE: '/api/employees/profile-picture',
      DOCUMENTS: (id) => `/api/employees/${id}/documents`,
      BULK_IMPORT: '/api/employees/import',
      EXPORT: '/api/employees/export',
    },
    ATTENDANCE: {
      BASE: '/api/attendance',
      CHECK_IN: '/api/attendance/check-in',
      CHECK_OUT: '/api/attendance/check-out',
      REPORTS: '/api/attendance/reports',
      MONTHLY: (year, month) => `/api/attendance/monthly/${year}/${month}`,
      OVERTIME: '/api/attendance/overtime',
      REGULARIZATION: '/api/attendance/regularize',
    },
    LEAVE: {
      BASE: '/api/leaves',
      APPLY: '/api/leaves/apply',
      APPROVE: (id) => `/api/leaves/${id}/approve`,
      REJECT: (id) => `/api/leaves/${id}/reject`,
      CANCEL: (id) => `/api/leaves/${id}/cancel`,
      BALANCE: '/api/leaves/balance',
      POLICIES: '/api/leaves/policies',
      TYPES: '/api/leaves/types',
      HOLIDAYS: '/api/leaves/holidays',
    },
    PAYROLL: {
      BASE: '/api/payroll',
      SALARY: '/api/payroll/salary',
      PROCESS: '/api/payroll/process',
      PAYSLIP: (id) => `/api/payroll/payslip/${id}`,
      TAX: '/api/payroll/tax',
      BANK_DETAILS: '/api/payroll/bank-details',
      COMPONENTS: '/api/payroll/components',
    },
    PERFORMANCE: {
      BASE: '/api/performance',
      REVIEWS: '/api/performance/reviews',
      GOALS: '/api/performance/goals',
      FEEDBACK: '/api/performance/feedback',
      APPRAISAL: '/api/performance/appraisal',
      SKILLS: '/api/performance/skills',
    },
    SETTINGS: {
      COMPANY: '/api/settings/company',
      USER: '/api/settings/user',
      SYSTEM: '/api/settings/system',
      ROLES: '/api/settings/roles',
      PERMISSIONS: '/api/settings/permissions',
    },
    DASHBOARD: '/api/dashboard',
    NOTIFICATIONS: '/api/notifications',
  };
  
  // Local storage keys
  export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
    THEME: 'theme',
    LANGUAGE: 'language',
    SIDEBAR_STATE: 'sidebar_state',
    RECENT_SEARCHES: 'recent_searches',
    NOTIFICATIONS: 'notifications',
    REMEMBER_ME: 'remember_me',
    ATTENDANCE_CACHE: 'attendance_cache',
    LAST_ACTIVITY: 'last_activity',
    FILTERS: 'filters'
  };
  
  // UI Constants
  export const UI = {
    SIDEBAR_WIDTH: 260,
    SIDEBAR_COLLAPSED_WIDTH: 70,
    HEADER_HEIGHT: 64,
    FOOTER_HEIGHT: 40,
    BREAKPOINTS: {
      xs: 480,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1600,
    },
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500,
    THEME: {
      LIGHT: 'light',
      DARK: 'dark',
      SYSTEM: 'system',
    },
  };
  
  // Time related constants
  export const TIME = {
    FORMAT: {
      DEFAULT: 'HH:mm:ss',
      SHORT: 'HH:mm',
      LONG: 'HH:mm:ss A',
    },
    CHECK_IN_DEFAULT: '09:00',
    CHECK_OUT_DEFAULT: '18:00',
    BREAK_DURATION: 60, // in minutes
  };
  
  // Date related constants
  export const DATE = {
    FORMAT: {
      DEFAULT: 'YYYY-MM-DD',
      DISPLAY: 'DD MMM, YYYY',
      FULL: 'dddd, MMMM D, YYYY',
      API: 'YYYY-MM-DD',
      MONTH_YEAR: 'MMMM YYYY',
    },
    DAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    SHORT_DAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    MONTHS: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    SHORT_MONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  };
  
  // Status codes and messages
  export const STATUS = {
    EMPLOYEE: {
      ACTIVE: 'active',
      INACTIVE: 'inactive',
      ONBOARDING: 'onboarding',
      TERMINATED: 'terminated',
      PROBATION: 'probation',
      NOTICE_PERIOD: 'notice_period',
    },
    ATTENDANCE: {
      PRESENT: 'present',
      ABSENT: 'absent',
      HALF_DAY: 'half_day',
      WORK_FROM_HOME: 'wfh',
      ON_LEAVE: 'on_leave',
      WEEKEND: 'weekend',
      HOLIDAY: 'holiday',
    },
    LEAVE: {
      PENDING: 'pending',
      APPROVED: 'approved',
      REJECTED: 'rejected',
      CANCELLED: 'cancelled',
    },
    PAYROLL: {
      DRAFT: 'draft',
      PROCESSING: 'processing',
      COMPLETED: 'completed',
      PAID: 'paid',
      FAILED: 'failed',
    },
    PERFORMANCE: {
      OUTSTANDING: 'outstanding',
      EXCEEDS_EXPECTATIONS: 'exceeds_expectations',
      MEETS_EXPECTATIONS: 'meets_expectations',
      NEEDS_IMPROVEMENT: 'needs_improvement',
      UNSATISFACTORY: 'unsatisfactory',
    },
  };
  
  // Form related constants
  export const FORM = {
    VALIDATION_MESSAGES: {
      REQUIRED: 'This field is required',
      EMAIL: 'Please enter a valid email address',
      PHONE: 'Please enter a valid phone number',
      PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase and number',
      PASSWORD_MATCH: 'Passwords do not match',
      MIN_LENGTH: (min) => `Must be at least ${min} characters`,
      MAX_LENGTH: (max) => `Must not exceed ${max} characters`,
      NUMBER: 'Please enter a valid number',
      DATE: 'Please enter a valid date',
    },
  };
  
  // Employee related constants
  export const EMPLOYEE = {
    DEPARTMENTS: [
      'Engineering', 'Human Resources', 'Marketing', 'Sales', 
      'Finance', 'Operations', 'Customer Support', 'Product', 
      'Design', 'Research and Development', 'Legal', 'Administration'
    ],
    DESIGNATIONS: [
      'Software Engineer', 'HR Manager', 'Marketing Specialist', 'Sales Representative',
      'Financial Analyst', 'Operations Manager', 'Customer Support Executive', 'Product Manager',
      'UI/UX Designer', 'R&D Engineer', 'Legal Counsel', 'Administrative Assistant',
      'CEO', 'CTO', 'CFO', 'COO', 'Team Lead', 'Senior Manager', 'Director', 'VP'
    ],
    EMPLOYMENT_TYPES: [
      'Full-time', 'Part-time', 'Contract', 'Intern', 'Probation', 'Consultant'
    ],
    DOCUMENT_TYPES: [
      'Resume', 'ID Proof', 'Address Proof', 'Education Certificate', 
      'Experience Certificate', 'Offer Letter', 'Joining Letter', 'Resignation Letter'
    ],
  };
  
  // Leave related constants
  export const LEAVE = {
    TYPES: [
      'Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave', 
      'Paternity Leave', 'Loss of Pay', 'Compensatory Off', 'Work From Home'
    ],
    DEFAULT_QUOTAS: {
      'Casual Leave': 12,
      'Sick Leave': 12,
      'Earned Leave': 15,
      'Maternity Leave': 180,
      'Paternity Leave': 15,
      'Compensatory Off': 0,
      'Work From Home': 4
    },
  };
  
  // Payroll related constants
  export const PAYROLL = {
    COMPONENTS: {
      EARNINGS: [
        'Basic', 'HRA', 'Conveyance Allowance', 'Medical Allowance', 'Special Allowance', 
        'Performance Bonus', 'Overtime'
      ],
      DEDUCTIONS: [
        'PF', 'Income Tax', 'Professional Tax', 'Health Insurance', 'Loan Deduction'
      ]
    },
    CALCULATION_TYPES: [
      'Percentage of Basic', 'Percentage of Gross', 'Fixed Amount'
    ],
    TAX_SLABS: [
      { up_to: 250000, rate: 0, },
      { from: 250001, up_to: 500000, rate: 5, },
      { from: 500001, up_to: 750000, rate: 10, },
      { from: 750001, up_to: 1000000, rate: 15, },
      { from: 1000001, up_to: 1250000, rate: 20, },
      { from: 1250001, up_to: 1500000, rate: 25, },
      { from: 1500001, rate: 30, }
    ],
  };
  
  // Performance related constants
  export const PERFORMANCE = {
    RATING_SCALE: [
      { value: 1, label: 'Unsatisfactory' },
      { value: 2, label: 'Needs Improvement' },
      { value: 3, label: 'Meets Expectations' },
      { value: 4, label: 'Exceeds Expectations' },
      { value: 5, label: 'Outstanding' }
    ],
    REVIEW_FREQUENCY: [
      'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'
    ],
    SKILL_LEVELS: [
      'Beginner', 'Intermediate', 'Advanced', 'Expert'
    ],
  };
  
  // Permissions and roles
  export const PERMISSIONS = {
    DASHBOARD: {
      VIEW: 'dashboard:view',
    },
    EMPLOYEE: {
      VIEW: 'employee:view',
      CREATE: 'employee:create',
      EDIT: 'employee:edit',
      DELETE: 'employee:delete',
      EXPORT: 'employee:export',
      IMPORT: 'employee:import',
    },
    ATTENDANCE: {
      VIEW: 'attendance:view',
      MARK: 'attendance:mark',
      REPORT: 'attendance:report',
      REGULARIZE: 'attendance:regularize',
      APPROVE_REGULARIZATION: 'attendance:approve_regularization',
    },
    LEAVE: {
      VIEW: 'leave:view',
      APPLY: 'leave:apply',
      APPROVE: 'leave:approve',
      MANAGE_POLICY: 'leave:manage_policy',
    },
    PAYROLL: {
      VIEW: 'payroll:view',
      CREATE: 'payroll:create',
      PROCESS: 'payroll:process',
      STRUCTURE: 'payroll:structure',
    },
    PERFORMANCE: {
      VIEW: 'performance:view',
      CREATE_REVIEW: 'performance:create_review',
      SET_GOALS: 'performance:set_goals',
      MANAGE_CYCLES: 'performance:manage_cycles',
    },
    SETTINGS: {
      COMPANY: 'settings:company',
      USER: 'settings:user',
      SYSTEM: 'settings:system',
      ROLES: 'settings:roles',
    },
  };
  
  export const ROLES = {
    ADMIN: 'admin',
    HR: 'hr',
    MANAGER: 'manager',
    EMPLOYEE: 'employee',
    FINANCE: 'finance',
  };
  
  // Role permissions mapping
  export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: Object.values(PERMISSIONS).flatMap(group => Object.values(group)),
    [ROLES.HR]: [
      PERMISSIONS.DASHBOARD.VIEW,
      PERMISSIONS.EMPLOYEE.VIEW,
      PERMISSIONS.EMPLOYEE.CREATE,
      PERMISSIONS.EMPLOYEE.EDIT,
      PERMISSIONS.EMPLOYEE.EXPORT,
      PERMISSIONS.EMPLOYEE.IMPORT,
      PERMISSIONS.ATTENDANCE.VIEW,
      PERMISSIONS.ATTENDANCE.REPORT,
      PERMISSIONS.ATTENDANCE.APPROVE_REGULARIZATION,
      PERMISSIONS.LEAVE.VIEW,
      PERMISSIONS.LEAVE.APPROVE,
      PERMISSIONS.LEAVE.MANAGE_POLICY,
      PERMISSIONS.PERFORMANCE.VIEW,
      PERMISSIONS.PERFORMANCE.CREATE_REVIEW,
      PERMISSIONS.PERFORMANCE.MANAGE_CYCLES,
      PERMISSIONS.SETTINGS.USER,
    ],
    [ROLES.MANAGER]: [
      PERMISSIONS.DASHBOARD.VIEW,
      PERMISSIONS.EMPLOYEE.VIEW,
      PERMISSIONS.ATTENDANCE.VIEW,
      PERMISSIONS.ATTENDANCE.REPORT,
      PERMISSIONS.ATTENDANCE.APPROVE_REGULARIZATION,
      PERMISSIONS.LEAVE.VIEW,
      PERMISSIONS.LEAVE.APPLY,
      PERMISSIONS.LEAVE.APPROVE,
      PERMISSIONS.PERFORMANCE.VIEW,
      PERMISSIONS.PERFORMANCE.CREATE_REVIEW,
      PERMISSIONS.PERFORMANCE.SET_GOALS,
    ],
    [ROLES.EMPLOYEE]: [
      PERMISSIONS.DASHBOARD.VIEW,
      PERMISSIONS.EMPLOYEE.VIEW,
      PERMISSIONS.ATTENDANCE.VIEW,
      PERMISSIONS.ATTENDANCE.MARK,
      PERMISSIONS.ATTENDANCE.REGULARIZE,
      PERMISSIONS.LEAVE.VIEW,
      PERMISSIONS.LEAVE.APPLY,
      PERMISSIONS.PERFORMANCE.VIEW,
      PERMISSIONS.SETTINGS.USER,
    ],
    [ROLES.FINANCE]: [
      PERMISSIONS.DASHBOARD.VIEW,
      PERMISSIONS.EMPLOYEE.VIEW,
      PERMISSIONS.PAYROLL.VIEW,
      PERMISSIONS.PAYROLL.CREATE,
      PERMISSIONS.PAYROLL.PROCESS,
      PERMISSIONS.PAYROLL.STRUCTURE,
    ],
  };
  
  // Error codes
  export const ERROR_CODES = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    BAD_REQUEST: 400,
    VALIDATION_ERROR: 422,
    CONFLICT: 409,
  };
  
  // HTTP methods
  export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
  };
  
  // Export all constants
  export default {
    API_ENDPOINTS,
    STORAGE_KEYS,
    UI,
    TIME,
    DATE,
    STATUS,
    FORM,
    EMPLOYEE,
    LEAVE,
    PAYROLL,
    PERFORMANCE,
    PERMISSIONS,
    ROLES,
    ROLE_PERMISSIONS,
    ERROR_CODES,
    HTTP_METHODS,
  };