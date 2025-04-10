import { createAsyncThunk } from '@reduxjs/toolkit';
import employeeService from '../../services/employeeService';

// Fetch all employees
export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await employeeService.getAllEmployees(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch employees');
    }
  }
);

// Fetch single employee
export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await employeeService.getEmployeeById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch employee');
    }
  }
);

// Create employee
export const createEmployee = createAsyncThunk(
  'employees/create',
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await employeeService.createEmployee(employeeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create employee');
    }
  }
);

// Update employee
export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await employeeService.updateEmployee(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update employee');
    }
  }
);

// Delete employee
export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id, { rejectWithValue }) => {
    try {
      await employeeService.deleteEmployee(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete employee');
    }
  }
);

// Upload employee documents
export const uploadEmployeeDocuments = createAsyncThunk(
  'employees/uploadDocuments',
  async ({ id, files }, { rejectWithValue }) => {
    try {
      const response = await employeeService.uploadDocuments(id, files);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to upload documents');
    }
  }
);

// Fetch departments
export const fetchDepartments = createAsyncThunk(
  'employees/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await employeeService.getDepartments();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch departments');
    }
  }
);

// Fetch roles
export const fetchRoles = createAsyncThunk(
  'employees/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await employeeService.getRoles();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch roles');
    }
  }
);

// Search employees
export const searchEmployees = createAsyncThunk(
  'employees/search',
  async (query, { rejectWithValue }) => {
    try {
      const response = await employeeService.searchEmployees(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to search employees');
    }
  }
);