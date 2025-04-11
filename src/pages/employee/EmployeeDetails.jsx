import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Avatar,
  Chip,
  Divider,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { useAuth } from '../../hooks/useAuth';
import { employeeService } from '../../services/employeeService';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await employeeService.getById(id);
        setEmployee(response.data);
      } catch (err) {
        console.error('Error fetching employee details:', err);
        setError('Failed to fetch employee details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  const handleEditEmployee = () => {
    navigate(`/employees/edit/${id}`);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await employeeService.updateStatus(id, newStatus);
      setEmployee(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error('Error updating employee status:', err);
      setError('Failed to update employee status. Please try again later.');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'on-leave': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/employees')}
        >
          Back to Directory
        </Button>
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Employee not found</Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/employees')}
        >
          Back to Directory
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/employees')}
          sx={{ mb: 2 }}
        >
          Back to Directory
        </Button>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditEmployee}
            sx={{ mr: 2 }}
          >
            Edit
          </Button>
          {employee.status === 'active' ? (
            <Button
              variant="outlined"
              color="error"
              startIcon={<BlockIcon />}
              onClick={() => handleStatusChange('inactive')}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleStatusChange('active')}
            >
              Activate
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Basic Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '3rem'
                }}
              >
                {employee.firstName.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {`${employee.firstName} ${employee.lastName}`}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {employee.designation?.name || 'No Designation'}
              </Typography>
              <Chip
                label={employee.status?.charAt(0).toUpperCase() + employee.status?.slice(1)}
                color={getStatusColor(employee.status)}
                sx={{ mt: 1 }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ '& > div': { mb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BadgeIcon sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Employee ID</Typography>
                  <Typography variant="body1">{employee.employeeId}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Department</Typography>
                  <Typography variant="body1">{employee.department?.name || 'N/A'}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarTodayIcon sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Join Date</Typography>
                  <Typography variant="body1">
                    {new Date(employee.dateOfJoining).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Contact Information */}
          <Paper sx={{ p: 3, borderRadius: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Contact Information</Typography>
            <Box sx={{ '& > div': { mb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{employee.email}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{employee.phone || 'N/A'}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ContactPhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Emergency Contact</Typography>
                  <Typography variant="body1">{employee.emergencyContact || 'N/A'}</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ mr: 2, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Address</Typography>
                  <Typography variant="body1">{employee.address || 'N/A'}</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column - Detailed Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Profile" />
              <Tab label="Documents" />
              <Tab label="Leave History" />
              <Tab label="Performance" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <Grid container spacing={3}>
                  {/* Add profile content here */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Personal Information</Typography>
                    {/* Add more personal information fields */}
                  </Grid>
                </Grid>
              )}
              {activeTab === 1 && (
                <Typography>Documents tab content</Typography>
              )}
              {activeTab === 2 && (
                <Typography>Leave History tab content</Typography>
              )}
              {activeTab === 3 && (
                <Typography>Performance tab content</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployeeDetails;