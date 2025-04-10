// attendanceSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchAttendance, 
  markAttendance, 
  fetchAttendanceReport, 
  updateAttendance,
  fetchUserAttendance
} from '../actions/attendanceActions';

const initialState = {
  attendanceRecords: [],
  userAttendance: {
    today: null,
    history: []
  },
  reports: {
    data: [],
    summary: {}
  },
  loading: false,
  error: null,
  filters: {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    employeeId: '',
    department: '',
    status: '',
    page: 1,
    limit: 30
  }
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setAttendanceFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetAttendanceFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearAttendanceError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch attendance records
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecords = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Mark attendance (check-in/check-out)
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.userId === state.filters.employeeId || !state.filters.employeeId) {
          // Add or update the record in the attendance list
          const index = state.attendanceRecords.findIndex(record => 
            record.id === action.payload.id
          );
          
          if (index !== -1) {
            state.attendanceRecords[index] = action.payload;
          } else {
            state.attendanceRecords.unshift(action.payload);
          }
        }
        
        // Update user's today attendance
        state.userAttendance.today = action.payload;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch attendance reports
      .addCase(fetchAttendanceReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.data = action.payload.data;
        state.reports.summary = action.payload.summary;
      })
      .addCase(fetchAttendanceReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update attendance record
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        // Update the record in the attendance list
        state.attendanceRecords = state.attendanceRecords.map(record => 
          record.id === action.payload.id ? action.payload : record
        );
        
        // Update user's today attendance if needed
        if (state.userAttendance.today && state.userAttendance.today.id === action.payload.id) {
          state.userAttendance.today = action.payload;
        }
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch user attendance
      .addCase(fetchUserAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.userAttendance.today = action.payload.today;
        state.userAttendance.history = action.payload.history;
      })
      .addCase(fetchUserAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setAttendanceFilters, resetAttendanceFilters, clearAttendanceError } = attendanceSlice.actions;
export default attendanceSlice.reducer;