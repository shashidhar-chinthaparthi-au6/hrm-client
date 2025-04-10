import { createAsyncThunk } from '@reduxjs/toolkit';
import leaveService from '../../services/leaveService';

// Apply for leave
export const applyLeave = createAsyncThunk(
  'leave/apply',
  async (leaveData, { rejectWithValue }) => {
    try {
      const response = await leaveService.applyLeave(leaveData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to apply for leave');
    }
  }
);

// Get employee leaves
export const getEmployeeLeaves = createAsyncThunk(
  'leave/getEmployeeLeaves',
  async ({ employeeId, status, year }, { rejectWithValue }) => {
    try {
      const response = await leaveService.getEmployeeLeaves(employeeId, status, year);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch employee leaves');
    }
  }
);

// Get leave balance
export const getLeaveBalance = createAsyncThunk(
  'leave/getBalance',
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await leaveService.getLeaveBalance(employeeId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch leave balance');
    }
  }
);

// Get all leave requests for approval
export const getPendingLeaveRequests = createAsyncThunk(
  'leave/getPendingRequests',
  async (managerId, { rejectWithValue }) => {
    try {
      const response = await leaveService.getPendingLeaveRequests(managerId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch pending leave requests');
    }
  }
);

// Approve or reject leave
export const updateLeaveStatus = createAsyncThunk(
  'leave/updateStatus',
  async ({ leaveId, status, comments }, { rejectWithValue }) => {
    try {
      const response = await leaveService.updateLeaveStatus(leaveId, status, comments);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update leave status');
    }
  }
);

// Cancel leave request
export const cancelLeave = createAsyncThunk(
  'leave/cancel',
  async (leaveId, { rejectWithValue }) => {
    try {
      const response = await leaveService.cancelLeave(leaveId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to cancel leave');
    }
  }
);

// Get leave types
export const getLeaveTypes = createAsyncThunk(
  'leave/getTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaveService.getLeaveTypes();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch leave types');
    }
  }
);

// Get department leaves for calendar view
export const getDepartmentLeaveCalendar = createAsyncThunk(
  'leave/getDepartmentCalendar',
  async ({ departmentId, month, year }, { rejectWithValue }) => {
    try {
      const response = await leaveService.getDepartmentLeaveCalendar(departmentId, month, year);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch department leave calendar');
    }
  }
);

// Update leave policy
export const updateLeavePolicy = createAsyncThunk(
  'leave/updatePolicy',
  async ({ leaveTypeId, data }, { rejectWithValue }) => {
    try {
      const response = await leaveService.updateLeavePolicy(leaveTypeId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update leave policy');
    }
  }
);