import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Tooltip,
  Divider,
  Avatar
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  AccessTime as AccessTimeIcon,
  EventNote as EventNoteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import MainLayout from '../../components/layout/MainLayout';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

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
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'late':
        return 'warning';
      case 'half-day':
        return 'info';
      case 'on-leave':
        return 'primary';
      default:
        return 'default';
    }
  };
  
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
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumbs
          items={[
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Attendance', link: '/attendance' },
            { label: 'Attendance Management', link: '/attendance/management' },
          ]}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Attendance Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AssessmentIcon />}
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
              }
            }}
          >
            Generate Report
          </Button>
        </Box>

        <Fade in timeout={500}>
          <Card 
            elevation={3}
            sx={{ 
              borderRadius: 2, 
              mb: 4,
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #1976d2, #2196f3)',
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ fontSize: 80, color: 'white', mr: 2 }} />
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white' }}>Today's Status</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    color="success" 
                    size="large" 
                    sx={{ mr: 2, bgcolor: 'white', color: 'success.main', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' } }}
                    startIcon={<CheckCircleIcon />}
                  >
                    Check In
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error" 
                    size="large"
                    sx={{ bgcolor: 'white', color: 'error.main', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' } }}
                    startIcon={<CancelIcon />}
                  >
                    Check Out
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>

        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            centered
            sx={{
              '& .MuiTab-root': {
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '1rem',
              },
              '& .Mui-selected': {
                fontWeight: 600,
              }
            }}
          >
            <Tab label="Daily" />
            <Tab label="Weekly" />
            <Tab label="Monthly" />
          </Tabs>
        </Box>

        <Fade in timeout={500}>
          <Card elevation={3} sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => handleDateRangeChange('today')}
                  startIcon={<CalendarIcon />}
                >
                  Today
                </Button>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => handleDateRangeChange('yesterday')}
                  startIcon={<CalendarIcon />}
                >
                  Yesterday
                </Button>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => handleDateRangeChange('week')}
                  startIcon={<CalendarIcon />}
                >
                  This Week
                </Button>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => handleDateRangeChange('month')}
                  startIcon={<CalendarIcon />}
                >
                  This Month
                </Button>
                
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={dateRange.startDate}
                    onChange={(date) => handleCustomDateChange('startDate', date)}
                    renderInput={(params) => <TextField {...params} size="small" />}
                  />
                  <DatePicker
                    label="End Date"
                    value={dateRange.endDate}
                    onChange={(date) => handleCustomDateChange('endDate', date)}
                    renderInput={(params) => <TextField {...params} size="small" />}
                  />
                </LocalizationProvider>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <TextField
                  placeholder="Search employees..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  size="small"
                  sx={{ flexGrow: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={filters.department}
                    label="Department"
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="present">Present</MenuItem>
                    <MenuItem value="absent">Absent</MenuItem>
                    <MenuItem value="late">Late</MenuItem>
                    <MenuItem value="half-day">Half Day</MenuItem>
                    <MenuItem value="on-leave">On Leave</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Clock In</TableCell>
                      <TableCell>Clock Out</TableCell>
                      <TableCell>Hours</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : attendanceData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          No attendance records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      attendanceData.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                src={record.employee?.avatar || '/assets/images/avatar-placeholder.png'} 
                                alt={record.employee?.name}
                                sx={{ width: 32, height: 32, mr: 2 }}
                              />
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {record.employee?.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {record.employee?.employeeId}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{record.department}</TableCell>
                          <TableCell>
                            {format(new Date(record.date), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            {record.clockIn ? format(new Date(record.clockIn), 'hh:mm a') : '-'}
                          </TableCell>
                          <TableCell>
                            {record.clockOut ? format(new Date(record.clockOut), 'hh:mm a') : '-'}
                          </TableCell>
                          <TableCell>
                            {record.hoursWorked ? `${record.hoursWorked}h` : '-'}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                              color={getStatusColor(record.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleView(record.id)}
                                  sx={{ color: 'primary.main' }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEdit(record.id)}
                                  sx={{ color: 'primary.main' }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Fade>
      </Box>
    </MainLayout>
  );
};

export default AttendanceManagement;