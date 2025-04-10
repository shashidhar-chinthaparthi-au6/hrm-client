import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Box, Typography, Paper, Grid, Card, CardContent, Button as MuiButton, Tabs, Tab, TextField } from '@mui/material';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';

// Components
// import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import DatePicker from '../../components/common/DatePicker';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge'; 
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import CheckInOut from '../../components/attendance/CheckInOut';
import AttendanceSummary from '../../components/dashboard/AttendanceSummary';

const AttendanceManagement = () => {
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: startOfWeek(new Date()),
    endDate: endOfWeek(new Date())
  });
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    searchTerm: ''
  });
  const [currentTab, setCurrentTab] = useState('daily');
  const [value, setValue] = React.useState(0);
  const [date, setDate] = React.useState(new Date());
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch departments
        const deptRes = await axios.get('/api/departments');
        setDepartments([{ id: '', name: 'All Departments' }, ...deptRes.data]);
        
        // Format dates for API
        const formattedStartDate = format(dateRange.startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(dateRange.endDate, 'yyyy-MM-dd');
        
        // Fetch attendance data
        const res = await axios.get('/api/attendance', {
          params: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            department: filters.department,
            status: filters.status,
            searchTerm: filters.searchTerm
          }
        });
        
        setAttendanceData(res.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load attendance data');
        setLoading(false);
        console.error('Error fetching attendance data:', error);
      }
    };
    
    fetchData();
  }, [dateRange, filters]);
  
  const handleDateRangeChange = (dateType) => {
    const today = new Date();
    
    switch (dateType) {
      case 'today':
        setDateRange({ startDate: today, endDate: today });
        break;
      case 'yesterday':
        const yesterday = subDays(today, 1);
        setDateRange({ startDate: yesterday, endDate: yesterday });
        break; 
      case 'week':
        setDateRange({
          startDate: startOfWeek(today, { weekStartsOn: 1 }),
          endDate: endOfWeek(today, { weekStartsOn: 1 })
        });
        break;
      case 'month':
        setDateRange({
          startDate: startOfMonth(today),
          endDate: endOfMonth(today)
        });
        break;
      default:
        break;
    }
  };
  
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  
  const handleCustomDateChange = (field, date) => {
    setDateRange(prev => ({ ...prev, [field]: date }));
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return <Badge color="green" text="Present" />;
      case 'absent':
        return <Badge color="red" text="Absent" />;
      case 'late':
        return <Badge color="yellow" text="Late" />;
      case 'half-day':
        return <Badge color="orange" text="Half Day" />;
      case 'on-leave':
        return <Badge color="blue" text="On Leave" />;
      default:
        return <Badge color="gray" text={status} />;
    }
  };
  
  const columns = [
    {
      header: 'Employee',
      accessor: 'employee',
      cell: ({ value }) => (
        <div className="flex items-center gap-3">
          <img
            src={value.avatar || '/assets/images/avatar-placeholder.png'}
            alt={value.name}
            className="h-8 w-8 rounded-full"
          />
          <div>
            <p className="font-medium">{value.name}</p>
            <p className="text-xs text-gray-500">{value.employeeId}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Department',
      accessor: 'department'
    },
    {
      header: 'Date',
      accessor: 'date',
      cell: ({ value }) => format(new Date(value), 'MMM dd, yyyy')
    },
    {
      header: 'Clock In',
      accessor: 'clockIn',
      cell: ({ value }) => (value ? format(new Date(value), 'hh:mm a') : '-')
    },
    {
      header: 'Clock Out',
      accessor: 'clockOut',
      cell: ({ value }) => (value ? format(new Date(value), 'hh:mm a') : '-')
    },
    {
      header: 'Hours',
      accessor: 'hoursWorked',
      cell: ({ value }) => (value ? `${value}h` : '-')
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: ({ value }) => getStatusBadge(value)
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: ({ value }) => (
        <div className="flex items-center space-x-2">
          <Button variant="icon" size="sm" onClick={() => handleView(value)}>
            <i className="fas fa-eye" />
          </Button>
          <Button variant="icon" size="sm" onClick={() => handleEdit(value)}>
            <i className="fas fa-edit" />
          </Button>
        </div>
      )
    }
  ];
  
  const handleView = (id) => {
    // Implement view logic
    console.log('View attendance', id);
  };
  
  const handleEdit = (id) => {
    // Implement edit logic
    console.log('Edit attendance', id);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Attendance Management</Typography>
        <Button variant="contained" color="primary" startIcon={<EventNoteIcon />}>
          Generate Report
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon sx={{ fontSize: 80, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h6">Today's Status</Typography>
                <Typography variant="h3" color="primary.main">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="success" size="large" sx={{ mr: 2 }}>
              Check In
            </Button>
            <Button variant="contained" color="error" size="large">
              Check Out
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Daily" />
          <Tab label="Weekly" />
          <Tab label="Monthly" />
        </Tabs>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Attendance Log</Typography>
          <DatePicker 
            label="Select Date" 
            value={date}
            onChange={(newValue) => setDate(newValue)}
            slotProps={{
              textField: { 
                size: 'small',
                sx: { width: 200 } 
              }
            }}
          />
        </Box>

        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5].map((day) => (
            <Grid item xs={12} key={day}>
              <Card variant="outlined">
                <CardContent>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1">
                        {new Date(2023, 0, day).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2" color="text.secondary">Check In</Typography>
                      <Typography variant="body1">09:0{day} AM</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2" color="text.secondary">Check Out</Typography>
                      <Typography variant="body1">06:1{day} PM</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2" color="text.secondary">Total Hours</Typography>
                      <Typography variant="body1">9h 1{day}m</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default AttendanceManagement;