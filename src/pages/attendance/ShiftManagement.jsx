import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  CircularProgress,
  Fade,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Divider
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import MainLayout from '../components/layout/MainLayout';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import { fetchShifts, createShift, updateShift, deleteShift } from '../redux/actions/shiftActions';
import { getAllEmployees } from '../redux/actions/employeeActions';

const ShiftManagement = () => {
  const dispatch = useDispatch();
  const { shifts, loading, error } = useSelector((state) => state.shifts);
  const { employees } = useSelector((state) => state.employees);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentShift, setCurrentShift] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterMonth, setFilterMonth] = useState(new Date());
  
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    description: '',
    employees: [],
    daysOfWeek: [], // 0-6, Sunday to Saturday
    color: '#3B82F6', // Default blue color
  });

  useEffect(() => {
    dispatch(fetchShifts());
    dispatch(getAllEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (currentShift) {
      setFormData({
        name: currentShift.name,
        startTime: currentShift.startTime,
        endTime: currentShift.endTime,
        description: currentShift.description,
        employees: currentShift.employees || [],
        daysOfWeek: currentShift.daysOfWeek || [],
        color: currentShift.color || '#3B82F6',
      });
    }
  }, [currentShift]);

  const handleOpenModal = (mode, shift = null) => {
    setModalMode(mode);
    setCurrentShift(shift);
    if (mode === 'create') {
      setFormData({
        name: '',
        startTime: '',
        endTime: '',
        description: '',
        employees: [],
        daysOfWeek: [],
        color: '#3B82F6',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentShift(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmployeeChange = (selectedEmployees) => {
    setFormData({
      ...formData,
      employees: selectedEmployees,
    });
  };

  const handleDayToggle = (day) => {
    const newDays = [...formData.daysOfWeek];
    if (newDays.includes(day)) {
      setFormData({
        ...formData,
        daysOfWeek: newDays.filter(d => d !== day),
      });
    } else {
      setFormData({
        ...formData,
        daysOfWeek: [...newDays, day],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.startTime || !formData.endTime) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (modalMode === 'create') {
      dispatch(createShift(formData))
        .then(() => {
          toast.success('Shift created successfully');
          handleCloseModal();
        })
        .catch((err) => {
          toast.error('Failed to create shift');
        });
    } else {
      dispatch(updateShift(currentShift.id, formData))
        .then(() => {
          toast.success('Shift updated successfully');
          handleCloseModal();
        })
        .catch((err) => {
          toast.error('Failed to update shift');
        });
    }
  };

  const handleDeleteShift = (shiftId) => {
    if (window.confirm('Are you sure you want to delete this shift?')) {
      dispatch(deleteShift(shiftId))
        .then(() => {
          toast.success('Shift deleted successfully');
        })
        .catch((err) => {
          toast.error('Failed to delete shift');
        });
    }
  };

  const dayOptions = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'default';
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Box sx={{ p: 3, color: 'error.main' }}>
      <Typography variant="h6">{error}</Typography>
    </Box>
  );

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumbs
          items={[
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Attendance', link: '/attendance' },
            { label: 'Shift Management', link: '/attendance/shift-management' },
          ]}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Shift Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal('create')}
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
              }
            }}
          >
            Create Shift
          </Button>
        </Box>

        <Fade in timeout={500}>
          <Card elevation={3} sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={filterDepartment}
                    label="Department"
                    onChange={(e) => setFilterDepartment(e.target.value)}
                  >
                    <MenuItem value="all">All Departments</MenuItem>
                    <MenuItem value="engineering">Engineering</MenuItem>
                    <MenuItem value="hr">Human Resources</MenuItem>
                    <MenuItem value="marketing">Marketing</MenuItem>
                    <MenuItem value="sales">Sales</MenuItem>
                  </Select>
                </FormControl>
                
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Filter by Month"
                    value={filterMonth}
                    onChange={(date) => setFilterMonth(date)}
                    views={['year', 'month']}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Box>

              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Shift Name</TableCell>
                      <TableCell>Timing</TableCell>
                      <TableCell>Days</TableCell>
                      <TableCell>Employees</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {shifts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No shifts found
                        </TableCell>
                      </TableRow>
                    ) : (
                      shifts.map((shift) => (
                        <TableRow key={shift.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box 
                                sx={{ 
                                  width: 16, 
                                  height: 16, 
                                  borderRadius: '50%', 
                                  mr: 1,
                                  backgroundColor: shift.color || '#3B82F6'
                                }} 
                              />
                              {shift.name}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                              {shift.startTime} - {shift.endTime}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {shift.daysOfWeek?.map((day, index) => (
                              <Chip 
                                key={day} 
                                label={dayOptions.find(d => d.value === day)?.label.substring(0, 3)} 
                                size="small" 
                                sx={{ mr: 0.5, mb: 0.5 }} 
                              />
                            ))}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PeopleIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
                              {shift.employees?.length || 0} assigned
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={shift.isActive ? 'Active' : 'Inactive'}
                              color={getStatusColor(shift.isActive)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                              <Tooltip title="Edit">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleOpenModal('edit', shift)}
                                  sx={{ color: 'primary.main' }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleDeleteShift(shift.id)}
                                  sx={{ color: 'error.main' }}
                                >
                                  <DeleteIcon fontSize="small" />
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

        {/* Shift Modal */}
        <Dialog 
          open={showModal} 
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ 
            pb: 1, 
            borderBottom: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            color: 'white'
          }}>
            {modalMode === 'create' ? 'Create New Shift' : 'Edit Shift'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Shift Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box 
                          sx={{ 
                            width: 20, 
                            height: 20, 
                            borderRadius: '50%', 
                            backgroundColor: formData.color 
                          }} 
                        />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                  Days of Week
                </Typography>
                <FormGroup row>
                  {dayOptions.map((day) => (
                    <FormControlLabel
                      key={day.value}
                      control={
                        <Checkbox
                          checked={formData.daysOfWeek.includes(day.value)}
                          onChange={() => handleDayToggle(day.value)}
                          name={`day-${day.value}`}
                        />
                      }
                      label={day.label}
                    />
                  ))}
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Assign Employees</InputLabel>
                  <Select
                    multiple
                    value={formData.employees}
                    onChange={(e) => handleEmployeeChange(e.target.value)}
                    label="Assign Employees"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip 
                            key={value} 
                            label={employees.find(emp => emp.id === value)?.name || value} 
                            size="small" 
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button onClick={handleCloseModal} color="inherit">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                }
              }}
            >
              {modalMode === 'create' ? 'Create Shift' : 'Update Shift'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default ShiftManagement;