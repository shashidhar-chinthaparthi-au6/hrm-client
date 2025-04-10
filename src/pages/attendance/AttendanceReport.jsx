import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
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
  Avatar,
  Pagination,
  Stack,
  ButtonGroup
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Description as CsvIcon,
  Assessment as AssessmentIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import Breadcrumbs from '../components/layout/Breadcrumbs';

const AttendanceReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  });
  const [filters, setFilters] = useState({
    department: 'all',
    employeeType: 'all',
    status: 'all',
    searchTerm: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Mock data - replace with API call
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = Array.from({ length: 35 }, (_, index) => ({
        id: index + 1,
        employeeId: `EMP${1000 + index}`,
        name: `Employee ${index + 1}`,
        department: ['HR', 'Engineering', 'Finance', 'Marketing'][index % 4],
        date: new Date(new Date().setDate(new Date().getDate() - index)),
        checkIn: `0${8 + (index % 2)}:${15 + (index % 30)}`,
        checkOut: `1${7 - (index % 2)}:${30 + (index % 30)}`,
        hoursWorked: `${7 + (index % 3)}.${index % 60}`,
        status: ['Present', 'Late', 'Early Departure', 'Absent', 'Leave'][index % 5],
        avatar: `/assets/images/avatar-${(index % 5) + 1}.png`
      }));
      
      setReports(mockData);
      setPagination(prev => ({ ...prev, total: mockData.length }));
      setLoading(false);
    }, 800);
  }, [dateRange, filters]);

  const handleDateChange = (field, date) => {
    setDateRange(prev => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (event, page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const handleExport = (format) => {
    // Implement export functionality
    console.log(`Exporting in ${format} format`);
    // In a real implementation, you would call an API endpoint or use a library to generate and download the file
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'late':
        return 'warning';
      case 'early departure':
        return 'info';
      case 'leave':
        return 'primary';
      default:
        return 'default';
    }
  };

  // Calculate current page items
  const startIndex = (pagination.current - 1) * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const currentPageData = reports.slice(startIndex, endIndex);

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumbs
          items={[
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Attendance', link: '/attendance' },
            { label: 'Reports', link: '/attendance/reports' },
          ]}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Attendance Reports
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
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon sx={{ fontSize: 40, color: 'white', mr: 2 }} />
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white' }}>Present</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                        85%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CancelIcon sx={{ fontSize: 40, color: 'white', mr: 2 }} />
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white' }}>Absent</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                        10%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ fontSize: 40, color: 'white', mr: 2 }} />
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white' }}>Late</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                        5%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>

        <Fade in timeout={500}>
          <Card elevation={3} sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Report Filters
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={dateRange.startDate}
                      onChange={(date) => handleDateChange('startDate', date)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      value={dateRange.endDate}
                      onChange={(date) => handleDateChange('endDate', date)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={filters.department}
                      label="Department"
                      onChange={(e) => handleFilterChange('department', e.target.value)}
                    >
                      <MenuItem value="all">All Departments</MenuItem>
                      <MenuItem value="hr">HR</MenuItem>
                      <MenuItem value="engineering">Engineering</MenuItem>
                      <MenuItem value="finance">Finance</MenuItem>
                      <MenuItem value="marketing">Marketing</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      label="Status"
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="present">Present</MenuItem>
                      <MenuItem value="absent">Absent</MenuItem>
                      <MenuItem value="late">Late</MenuItem>
                      <MenuItem value="leave">On Leave</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search employees..."
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <ButtonGroup variant="outlined" aria-label="export options">
                  <Button 
                    startIcon={<PdfIcon />} 
                    onClick={() => handleExport('pdf')}
                  >
                    PDF
                  </Button>
                  <Button 
                    startIcon={<ExcelIcon />} 
                    onClick={() => handleExport('excel')}
                  >
                    Excel
                  </Button>
                  <Button 
                    startIcon={<CsvIcon />} 
                    onClick={() => handleExport('csv')}
                  >
                    CSV
                  </Button>
                </ButtonGroup>
              </Box>
            </CardContent>
          </Card>
        </Fade>

        <Fade in timeout={500}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Attendance Records
              </Typography>

              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Check In</TableCell>
                      <TableCell>Check Out</TableCell>
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
                    ) : currentPageData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          No attendance records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentPageData.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                src={record.avatar || '/assets/images/avatar-placeholder.png'} 
                                alt={record.name}
                                sx={{ width: 32, height: 32, mr: 2 }}
                              />
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {record.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {record.employeeId}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>{record.department}</TableCell>
                          <TableCell>
                            {format(new Date(record.date), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>{record.checkIn}</TableCell>
                          <TableCell>{record.checkOut}</TableCell>
                          <TableCell>{record.hoursWorked}h</TableCell>
                          <TableCell>
                            <Chip
                              label={record.status}
                              color={getStatusColor(record.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  sx={{ color: 'primary.main' }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton 
                                  size="small" 
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

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination 
                  count={Math.ceil(pagination.total / pagination.pageSize)} 
                  page={pagination.current} 
                  onChange={handlePageChange} 
                  color="primary" 
                  showFirstButton 
                  showLastButton
                />
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Box>
    </MainLayout>
  );
};

export default AttendanceReport;