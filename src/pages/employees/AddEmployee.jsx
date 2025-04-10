import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createEmployee } from '../../services/employeeService';
import employeeService from '../../services/employeeService';
import { 
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Container,
  Stack
} from '@mui/material';
import { 
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  AccountBalance as BankIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Cake as CakeIcon,
  Wc as GenderIcon,
  Business as BusinessIcon,
  Title as TitleIcon,
  Place as PlaceIcon,
  SupervisorAccount as ManagerIcon,
  Event as EventIcon,
  WorkOutline as WorkTypeIcon,
  AttachMoney as MoneyIcon,
  AccountBox as AccountIcon,
  AccountBalance as AccountBalanceIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CircularProgress } from '@mui/material';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [managers, setManagers] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employeeId: '',
    dateOfBirth: null,
    gender: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    department: '',
    designation: '',
    jobTitle: '',
    position: '',
    workLocation: '',
    managerId: '',
    dateOfJoining: null,
    employmentType: 'full-time',
    salary: '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: ''
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptsRes, desigRes, managersRes] = await Promise.all([
          employeeService.getDepartments(),
          employeeService.getDesignations(),
          employeeService.getManagers()
        ]);

        setDepartments(deptsRes.data);
        setDesignations(desigRes.data);
        setManagers(managersRes.data);
      } catch (error) {
        toast.error('Failed to fetch form data');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createEmployee(formData);
      toast.success('Employee created successfully');
      navigate('/employees');
    } catch (error) {
      toast.error(error.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 4, background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)', color: 'white' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Add New Employee
          </Typography>
          <Typography variant="subtitle1">
            Fill in the employee details below to create a new employee record.
          </Typography>
        </Paper>

        <Card elevation={3}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                {/* Personal Information */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Personal Information</Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Employee ID"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Date of Birth"
                        value={formData.dateOfBirth}
                        onChange={(date) => handleDateChange('dateOfBirth', date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            required
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CakeIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <GenderIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* Address Information */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Address Information</Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        multiline
                        rows={2}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Postal Code"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* Employment Information */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Employment Information</Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {departments.map((dept) => (
                          <MenuItem key={dept._id} value={dept._id}>
                            {dept.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Designation"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <TitleIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {designations.map((desig) => (
                          <MenuItem key={desig._id} value={desig._id}>
                            {desig.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <WorkIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Position"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <WorkIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Work Location"
                        name="workLocation"
                        value={formData.workLocation}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PlaceIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Manager"
                        name="managerId"
                        value={formData.managerId}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ManagerIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {managers.map((manager) => (
                          <MenuItem key={manager._id} value={manager._id}>
                            {`${manager.firstName} ${manager.lastName}`}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Date of Joining"
                        value={formData.dateOfJoining}
                        onChange={(date) => handleDateChange('dateOfJoining', date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            required
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EventIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Employment Type"
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <WorkTypeIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <MenuItem value="full-time">Full Time</MenuItem>
                        <MenuItem value="part-time">Part Time</MenuItem>
                        <MenuItem value="contract">Contract</MenuItem>
                        <MenuItem value="intern">Intern</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Salary"
                        name="salary"
                        type="number"
                        value={formData.salary}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MoneyIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* Bank Details */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <BankIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Bank Details</Typography>
                  </Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Account Name"
                        name="bankDetails.accountName"
                        value={formData.bankDetails.accountName}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Account Number"
                        name="bankDetails.accountNumber"
                        value={formData.bankDetails.accountNumber}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountBalanceIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Bank Name"
                        name="bankDetails.bankName"
                        value={formData.bankDetails.bankName}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BankIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="IFSC Code"
                        name="bankDetails.ifscCode"
                        value={formData.bankDetails.ifscCode}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CodeIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/employees')}
                    size="large"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    Create Employee
                  </Button>
                </Box>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Container>
    </LocalizationProvider>
  );
};

export default AddEmployee; 