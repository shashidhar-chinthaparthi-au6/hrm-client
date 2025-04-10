// leaveSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchLeaveRequests, 
  createLeaveRequest, 
  updateLeaveRequest, 
  deleteLeaveRequest,
  fetchUserLeaveBalance,
  fetchLeaveTypes,
  updateLeavePolicy
} from '../actions/leaveActions';

const initialState = {
  leaveRequests: [],
  userLeaves: [],
  leaveBalance: {},
  leaveTypes: [],
  leavePolicy: {},
  loading: false,
  error: null,
  totalCount: 0,
  filters: {
    status: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    employeeId: '',
    page: 1,
    limit: 10
  }
};

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    setLeaveFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetLeaveFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearLeaveError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch leave requests
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = action.payload.leaveRequests;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create leave request
      .addCase(createLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = [action.payload, ...state.leaveRequests];
        state.userLeaves = [action.payload, ...state.userLeaves];
        state.totalCount += 1;
      })
      .addCase(createLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update leave request
      .addCase(updateLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Update in both leaveRequests and userLeaves arrays
        state.leaveRequests = state.leaveRequests.map(leave => 
          leave.id === action.payload.id ? action.payload : leave
        );
        
        state.userLeaves = state.userLeaves.map(leave => 
          leave.id === action.payload.id ? action.payload : leave
        );
      })
      .addCase(updateLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete leave request
      .addCase(deleteLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveRequests = state.leaveRequests.filter(leave => leave.id !== action.payload);
        state.userLeaves = state.userLeaves.filter(leave => leave.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch user leave balance
      .addCase(fetchUserLeaveBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserLeaveBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveBalance = action.payload.balance;
        state.userLeaves = action.payload.leaves;
      })
      .addCase(fetchUserLeaveBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch leave types
      .addCase(fetchLeaveTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.leaveTypes = action.payload;
      })
      .addCase(fetchLeaveTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update leave policy
      .addCase(updateLeavePolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeavePolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.leavePolicy = action.payload;
      })
      .addCase(updateLeavePolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setLeaveFilters, resetLeaveFilters, clearLeaveError } = leaveSlice.actions;
export default leaveSlice.reducer;