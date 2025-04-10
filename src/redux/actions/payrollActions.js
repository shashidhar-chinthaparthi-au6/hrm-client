import { createAsyncThunk } from '@reduxjs/toolkit';
import payrollService from '../..//services/payrollService';

// Get payroll for an employee
export const getEmployeePayroll = createAsyncThunk(
  'payroll/getEmployeePayroll',
  async ({ employeeId, year, month }, { rejectWithValue }) => {
    try {
      const response = await payrollService.getEmployeePayroll(employeeId, year, month);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch employee payroll');
    }
  }
);

// Generate payroll for employees
export const generatePayroll = createAsyncThunk(
  'payroll/generate',
  async ({ month, year, departmentId }, { rejectWithValue }) => {
    try {
      const response = await payrollService.generatePayroll(month, year, departmentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to generate payroll');
    }
  }
);

// Get payroll list
export const getPayrollList = createAsyncThunk(
  'payroll/getList',
  async ({ month, year, status }, { rejectWithValue }) => {
    try {
      const response = await payrollService.getPayrollList(month, year, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch payroll list');
    }
  }
);

// Update salary structure
export const updateSalaryStructure = createAsyncThunk(
  'payroll/updateSalaryStructure',
  async ({ employeeId, salaryData }, { rejectWithValue }) => {
    try {
      const response = await payrollService.updateSalaryStructure(employeeId, salaryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update salary structure');
    }
  }
);

// Get payslip
export const getPayslip = createAsyncThunk(
  'payroll/getPayslip',
  async (payrollId, { rejectWithValue }) => {
    try {
      const response = await payrollService.getPayslip(payrollId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch payslip');
    }
  }
);

// Download payslip
export const downloadPayslip = createAsyncThunk(
  'payroll/downloadPayslip',
  async (payrollId, { rejectWithValue }) => {
    try {
      const response = await payrollService.downloadPayslip(payrollId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to download payslip');
    }
  }
);

// Get tax deductions
export const getTaxDeductions = createAsyncThunk(
  'payroll/getTaxDeductions',
  async ({ employeeId, year }, { rejectWithValue }) => {
    try {
      const response = await payrollService.getTaxDeductions(employeeId, year);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch tax deductions');
    }
  }
);

// Update employee bank details
export const updateBankDetails = createAsyncThunk(
  'payroll/updateBankDetails',
  async ({ employeeId, bankDetails }, { rejectWithValue }) => {
    try {
      const response = await payrollService.updateBankDetails(employeeId, bankDetails);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update bank details');
    }
  }
);

// Process payroll
export const processPayroll = createAsyncThunk(
  'payroll/process',
  async (payrollIds, { rejectWithValue }) => {
    try {
      const response = await payrollService.processPayroll(payrollIds);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to process payroll');
    }
  }
);