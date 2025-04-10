// /client/src/routes/AppRoutes.jsx

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';

// Layouts
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';

// Route guards
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import AdminRoute from './AdminRoute';

// Eager loaded components
import Dashboard from '../pages/auth/Dashboard';
import Login from '../pages/auth/Login';
import NotFound from '../pages/NotFound';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Lazy loaded components for better performance
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const Profile = lazy(() => import('../pages/auth/Profile'));

// Employee pages
const EmployeeDirectory = lazy(() => import('../pages/employee/EmployeeDirectory'));
const EmployeeDetails = lazy(() => import('../pages/employee/EmployeeDetails'));
const AddEmployee = lazy(() => import('../pages/employees/AddEmployee'));
const EditEmployee = lazy(() => import('../pages/employee/EditEmployee'));
const OrganizationChart = lazy(() => import('../pages/employee/OrganizationChart'));

// Attendance pages
const AttendanceManagement = lazy(() => import('../pages/attendance/AttendanceManagement'));
const AttendanceReport = lazy(() => import('../pages/attendance/AttendanceReport'));
const TimeTracking = lazy(() => import('../pages/attendance/TimeTracking'));

// Leave pages
const LeaveManagement = lazy(() => import('../pages/leave/LeaveManagement'));
const ApplyLeave = lazy(() => import('../pages/leave/ApplyLeave'));
const LeaveApproval = lazy(() => import('../pages/leave/LeaveApproval'));
const LeaveSettings = lazy(() => import('../pages/leave/LeaveSettings'));

// Payroll pages
const PayrollDashboard = lazy(() => import('../pages/payroll/PayrollDashboard'));
const SalaryProcessing = lazy(() => import('../pages/payroll/SalaryProcessing'));
const PayslipView = lazy(() => import('../pages/payroll/PayslipView'));
const TaxManagement = lazy(() => import('../pages/payroll/TaxManagement'));

// Performance pages
const PerformanceReview = lazy(() => import('../pages/performance/PerformanceReview'));
const GoalTracking = lazy(() => import('../pages/performance/GoalTracking'));
const AppraisalCycles = lazy(() => import('../pages/performance/AppraisalCycles'));
const Feedback360 = lazy(() => import('../pages/performance/360Feedback'));

// Settings pages
const CompanySettings = lazy(() => import('../pages/settings/CompanySettings'));
const UserSettings = lazy(() => import('../pages/settings/UserSettings'));
const SystemSettings = lazy(() => import('../pages/settings/SystemSettings'));
const RolePermissions = lazy(() => import('../pages/settings/RolePermissions'));

// Loading fallback for lazy components
const LoadingFallback = () => <LoadingSpinner fullScreen />;

// MainLayout wrapper to provide auth context
const MainLayoutWrapper = () => {
  const { user, logout } = useAuth();
  
  return (
    <MainLayout
      user={user}
      onLogout={logout}
    />
  );
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>
        </Route>

        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayoutWrapper />}>
            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />

            {/* Employee routes */}
            <Route path="/employees">
              <Route index element={<EmployeeDirectory />} />
              <Route path=":id" element={<EmployeeDetails />} />
              <Route path="add" element={<AddEmployee />} />
              <Route path="edit/:id" element={<EditEmployee />} />
              <Route path="org-chart" element={<OrganizationChart />} />
            </Route>

            {/* Attendance routes */}
            <Route path="/attendance">
              <Route index element={<AttendanceManagement />} />
              <Route path="reports" element={<AttendanceReport />} />
              <Route path="time-tracking" element={<TimeTracking />} />
            </Route>

            {/* Leave routes */}
            <Route path="/leave">
              <Route index element={<LeaveManagement />} />
              <Route path="apply" element={<ApplyLeave />} />
              <Route path="approval" element={<LeaveApproval />} />
            </Route>

            {/* Payroll routes */}
            <Route path="/payroll">
              <Route index element={<PayrollDashboard />} />
              <Route path="process" element={<SalaryProcessing />} />
              <Route path="payslip/:id" element={<PayslipView />} />
            </Route>

            {/* Performance routes */}
            <Route path="/performance">
              <Route index element={<PerformanceReview />} />
              <Route path="goals" element={<GoalTracking />} />
              <Route path="appraisals" element={<AppraisalCycles />} />
              <Route path="feedback" element={<Feedback360 />} />
            </Route>

            {/* User settings */}
            <Route path="/settings">
              <Route index element={<UserSettings />} />
            </Route>
          </Route>
        </Route>

        {/* Admin-only routes */}
        <Route element={<AdminRoute />}>
          <Route element={<MainLayoutWrapper />}>
            {/* Admin settings routes */}
            <Route path="/admin/settings">
              <Route path="company" element={<CompanySettings />} />
              <Route path="system" element={<SystemSettings />} />
              <Route path="roles" element={<RolePermissions />} />
            </Route>

            {/* Admin-only leave settings */}
            <Route path="/admin/leave/settings" element={<LeaveSettings />} />

            {/* Admin-only tax management */}
            <Route path="/admin/payroll/tax" element={<TaxManagement />} />
          </Route>
        </Route>

        {/* Redirect root to dashboard or login based on auth status */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } />

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;