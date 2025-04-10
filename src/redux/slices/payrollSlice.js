// payrollSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchPayrolls, 
  generatePayroll, 
  fetchPayslips, 
  fetchPayslipById,
  updateSalaryStructure
} from '../actions/payrollActions';

const initialState = {
  payrolls: [],
  currentPayroll: null,
  payslips: [],
  selectedPayslip: null,
  salaryStructure: {},
  loading: false,
  error: null,
  filters: {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    status: '',
    department: '',
    employeeId: '',
    page: 1,
    limit: 10
  }
};

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    setPayrollFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetPayrollFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearPayrollError: (state) => {
      state.error = null;
    },
    clearSelectedPayslip: (state) => {
      state.selectedPayslip = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch payrolls
      .addCase(fetchPayrolls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayrolls.fulfilled, (state, action) => {
        state.loading = false;
        state.payrolls = action.payload;
      })
      .addCase(fetchPayrolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Generate payroll
      .addCase(generatePayroll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generatePayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayroll = action.payload;
        
        // Update or add to payrolls list
        const index = state.payrolls.findIndex(p => 
          p.id === action.payload.id
        );
        
        if (index !== -1) {
          state.payrolls[index] = action.payload;
        } else {
          state.payrolls.unshift(action.payload);
        }
      })
      .addCase(generatePayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch payslips
      .addCase(fetchPayslips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayslips.fulfilled, (state, action) => {
        state.loading = false;
        state.payslips = action.payload;
      })
      .addCase(fetchPayslips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch payslip by ID
      .addCase(fetchPayslipById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayslipById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPayslip = action.payload;
      })
      .addCase(fetchPayslipById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update salary structure
      .addCase(updateSalaryStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSalaryStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.salaryStructure = action.payload;
      })
      .addCase(updateSalaryStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  setPayrollFilters, 
  resetPayrollFilters, 
  clearPayrollError, 
  clearSelectedPayslip 
} = payrollSlice.actions;

export default payrollSlice.reducer;