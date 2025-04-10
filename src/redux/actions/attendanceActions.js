import { createAsyncThunk } from '@reduxjs/toolkit';
import attendanceService from '../../services/attendanceService';

// Fetch attendance
export const fetchAttendance = createAsyncThunk(
  'attendance/fetch',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getAttendance(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch attendance');
    }
  }
);

// Mark attendance
export const markAttendance = createAsyncThunk(
  'attendance/mark',
  async (data, { rejectWithValue }) => {
    try {
      const response = await attendanceService.markAttendance(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to mark attendance');
    }
  }
);

// Fetch attendance report
export const fetchAttendanceReport = createAsyncThunk(
  'attendance/fetchReport',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getAttendanceReport(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch attendance report');
    }
  }
);

// Fetch user attendance
export const fetchUserAttendance = createAsyncThunk(
  'attendance/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getUserAttendance(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user attendance');
    }
  }
);

// Check in action
export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (data, { rejectWithValue }) => {
    try {
      const response = await attendanceService.checkIn(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to check in');
    }
  }
);

// Check out action
export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (data, { rejectWithValue }) => {
    try {
      const response = await attendanceService.checkOut(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to check out');
    }
  }
);

// Get today's attendance
export const getTodayAttendance = createAsyncThunk(
  'attendance/getToday',
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getTodayAttendance(employeeId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch today\'s attendance');
    }
  }
);

// Get attendance for employee
export const getEmployeeAttendance = createAsyncThunk(
  'attendance/getForEmployee',
  async ({ employeeId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getEmployeeAttendance(employeeId, startDate, endDate);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch employee attendance');
    }
  }
);

// Get attendance for department
export const getDepartmentAttendance = createAsyncThunk(
  'attendance/getForDepartment',
  async ({ departmentId, date }, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getDepartmentAttendance(departmentId, date);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch department attendance');
    }
  }
);

// Generate attendance report
export const generateAttendanceReport = createAsyncThunk(
  'attendance/generateReport',
  async ({ startDate, endDate, departmentId, employeeId }, { rejectWithValue }) => {
    try {
      const response = await attendanceService.generateReport(startDate, endDate, departmentId, employeeId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to generate attendance report');
    }
  }
);

// Update attendance record
export const updateAttendance = createAsyncThunk(
  'attendance/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await attendanceService.updateAttendance(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update attendance');
    }
  }
);

// Mark overtime
export const markOvertime = createAsyncThunk(
  'attendance/markOvertime',
  async (data, { rejectWithValue }) => {
    try {
      const response = await attendanceService.markOvertime(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to mark overtime');
    }
  }
);

// Get overtime records
export const getOvertimeRecords = createAsyncThunk(
  'attendance/getOvertime',
  async ({ employeeId, month, year }, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getOvertimeRecords(employeeId, month, year);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch overtime records');
    }
  }
);