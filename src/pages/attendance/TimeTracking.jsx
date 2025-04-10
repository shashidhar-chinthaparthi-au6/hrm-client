import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
  Fade,
  Grid,
  InputAdornment
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  AccessTime as AccessTimeIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import Breadcrumbs from '../components/layout/Breadcrumbs';

const TimeTracking = () => {
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userStatus, setUserStatus] = useState('not-checked-in');
  const [clockTime, setClockTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('all');

  // Update clock time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setClockTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Mock data - replace with API call
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        employeeId: `EMP${1000 + index}`,
        name: `Employee ${index + 1}`,
        date: new Date(new Date().setDate(new Date().getDate() - Math.floor(index / 4))),
        checkIn: `0${8 + (index % 2)}:${15 + (index % 30)}`,
        checkOut: index % 5 === 0 ? null : `1${7 - (index % 2)}:${30 + (index % 30)}`,
        duration: index % 5 === 0 ? 'In progress' : `${7 + (index % 3)}h ${index % 60}m`,
        status: index % 5 === 0 ? 'Active' : 'Completed',
        notes: index % 3 === 0 ? 'Working on Project X' : '',
      }));
      
      setTimeLogs(mockData);
      setLoading(false);
      
      // Set mock user status
      const hour = new Date().getHours();
      if (hour < 9) {
        setUserStatus('not-checked-in');
      } else if (hour < 17) {
        setUserStatus('checked-in');
      } else {
        setUserStatus('checked-out');
      }
    }, 600);
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleCheckIn = () => {
    setUserStatus('checked-in');
    const newLog = {
      id: timeLogs.length + 1,
      employeeId: 'EMP1001',
      name: 'Current User',
      date: new Date(),
      checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      checkOut: null,
      duration: 'In progress',
      status: 'Active',
      notes: '',
    };
    
    setTimeLogs([newLog, ...timeLogs]);
  };

  const handleCheckOut = () => {
    setUserStatus('checked-out');
    const updatedLogs = [...timeLogs];
    if (updatedLogs.length > 0 && updatedLogs[0].status === 'Active') {
      const checkInTime = new Date();
      checkInTime.setHours(
        parseInt(updatedLogs[0].checkIn.split(':')[0]),
        parseInt(updatedLogs[0].checkIn.split(':')[1])
      );
      
      const checkOutTime = new Date();
      const durationMs = checkOutTime - checkInTime;
      const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
      const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      
      updatedLogs[0] = {
        ...updatedLogs[0],
        checkOut: checkOutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: `${durationHours}h ${durationMinutes}m`,
        status: 'Completed',
      };
      
      setTimeLogs(updatedLogs);
    }
  };

  const handleNoteChange = (id, note) => {
    const updatedLogs = timeLogs.map(log => 
      log.id === id ? { ...log, notes: note } : log
    );
    setTimeLogs(updatedLogs);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter the time logs based on search and employee filter
  const filteredLogs = timeLogs.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEmployee = filterEmployee === 'all' || log.employeeId === filterEmployee;
    
    return matchesSearch && matchesEmployee;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'completed':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumbs
          items={[
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Attendance', link: '/attendance' },
            { label: 'Time Tracking', link: '/attendance/time-tracking' },
          ]}
        />

        <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
          Time Tracking
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Fade in timeout={500}>
              <Card 
                elevation={3}
                sx={{
                  borderRadius: 2,
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {clockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                      <Typography variant="subtitle1">
                        {clockTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    {userStatus === 'not-checked-in' && (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleCheckIn}
                        startIcon={<CheckCircleIcon />}
                        sx={{
                          bgcolor: 'white',
                          color: 'primary.main',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                          }
                        }}
                      >
                        Check In
                      </Button>
                    )}
                    {userStatus === 'checked-in' && (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleCheckOut}
                        startIcon={<CancelIcon />}
                        sx={{
                          bgcolor: 'white',
                          color: 'error.main',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                          }
                        }}
                      >
                        Check Out
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          <Grid item xs={12} md={8}>
            <Fade in timeout={500}>
              <Card elevation={3} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Select Date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                    
                    <TextField
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      sx={{ flexGrow: 1 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <FormControl sx={{ minWidth: 200 }}>
                      <InputLabel>Filter Employee</InputLabel>
                      <Select
                        value={filterEmployee}
                        label="Filter Employee"
                        onChange={(e) => setFilterEmployee(e.target.value)}
                      >
                        <MenuItem value="all">All Employees</MenuItem>
                        {timeLogs.map((log) => (
                          <MenuItem key={log.employeeId} value={log.employeeId}>
                            {log.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <TableContainer component={Paper} elevation={0}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Employee</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Check In</TableCell>
                          <TableCell>Check Out</TableCell>
                          <TableCell>Duration</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Notes</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={7} align="center">
                              <CircularProgress />
                            </TableCell>
                          </TableRow>
                        ) : filteredLogs.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} align="center">
                              No time logs found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredLogs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell>{log.name}</TableCell>
                              <TableCell>
                                {log.date.toLocaleDateString()}
                              </TableCell>
                              <TableCell>{log.checkIn}</TableCell>
                              <TableCell>{log.checkOut || '—'}</TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <TimerIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                  {log.duration}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={log.status}
                                  color={getStatusColor(log.status)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  placeholder="Add a note..."
                                  value={log.notes}
                                  onChange={(e) => handleNoteChange(log.id, e.target.value)}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton size="small">
                                          <EditIcon fontSize="small" />
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
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
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default TimeTracking;