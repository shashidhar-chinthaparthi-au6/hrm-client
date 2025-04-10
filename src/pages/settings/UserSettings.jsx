import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Avatar,
  Divider,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CircularProgress,
  Fade,
  InputAdornment,
  IconButton,
  Tooltip,
  Stack
} from '@mui/material';
import {
  Save as SaveIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PhotoCamera as PhotoCameraIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import MainLayout from '../../components/layout/MainLayout';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

const UserSettings = () => {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecurity = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Security settings updated successfully');
    } catch (error) {
      toast.error('Failed to update security settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notification preferences saved successfully');
    } catch (error) {
      toast.error('Failed to save notification preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumbs
          items={[
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Settings', link: '/settings' },
            { label: 'User Settings', link: '/settings/user' },
          ]}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Account Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your account preferences and settings
            </Typography>
          </Box>
        </Box>

        <Fade in timeout={500}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 0 }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  '& .MuiTab-root': {
                    minWidth: 120,
                    textTransform: 'none',
                    fontWeight: 500,
                  }
                }}
              >
                <Tab
                  icon={<PersonIcon />}
                  label="Profile"
                  value={0}
                  iconPosition="start"
                />
                <Tab
                  icon={<SecurityIcon />}
                  label="Security"
                  value={1}
                  iconPosition="start"
                />
                <Tab
                  icon={<NotificationsIcon />}
                  label="Notifications"
                  value={2}
                  iconPosition="start"
                />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {/* Profile Tab */}
                {value === 0 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box sx={{ position: 'relative', mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 120,
                            height: 120,
                            border: '4px solid #fff',
                            boxShadow: '0 0 20px rgba(0,0,0,0.1)',
                          }}
                          src="/assets/profile-placeholder.jpg"
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            backgroundColor: 'primary.main',
                            '&:hover': { backgroundColor: 'primary.dark' },
                          }}
                          color="primary"
                          component="label"
                        >
                          <input hidden accept="image/*" type="file" />
                          <PhotoCameraIcon sx={{ color: 'white' }} />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
                        Recommended: 200x200px, max 2MB
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom>Personal Information</Typography>
                      <Divider sx={{ mb: 3 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="First Name"
                            defaultValue="John"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Last Name"
                            defaultValue="Doe"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            defaultValue="john.doe@example.com"
                            type="email"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            defaultValue="+1 (555) 123-4567"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PhoneIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Job Title"
                            defaultValue="Software Developer"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <WorkIcon color="action" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            onClick={handleSaveProfile}
                            disabled={loading}
                            sx={{
                              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                              color: 'white',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                              }
                            }}
                          >
                            {loading ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {/* Security Tab */}
                {value === 1 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Password & Security</Typography>
                      <Divider sx={{ mb: 3 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Current Password"
                            type={showPassword ? 'text' : 'password'}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon color="action" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                  >
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="New Password"
                            type={showNewPassword ? 'text' : 'password'}
                            helperText="At least 8 characters with letters, numbers & symbols"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon color="action" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    edge="end"
                                  >
                                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Confirm New Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon color="action" />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    edge="end"
                                  >
                                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Two-Factor Authentication</Typography>
                          <FormControlLabel
                            control={<Switch color="primary" />}
                            label="Enable two-factor authentication for better security"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            onClick={handleSaveSecurity}
                            disabled={loading}
                            sx={{
                              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                              color: 'white',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                              }
                            }}
                          >
                            {loading ? 'Updating...' : 'Update Security Settings'}
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {/* Notifications Tab */}
                {value === 2 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
                      <Divider sx={{ mb: 3 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" gutterBottom>Email Notifications</Typography>
                          <Stack spacing={2}>
                            <FormControlLabel
                              control={<Switch defaultChecked color="primary" />}
                              label="Payroll notifications"
                            />
                            <FormControlLabel
                              control={<Switch defaultChecked color="primary" />}
                              label="Leave request updates"
                            />
                            <FormControlLabel
                              control={<Switch defaultChecked color="primary" />}
                              label="Performance reviews"
                            />
                            <FormControlLabel
                              control={<Switch color="primary" />}
                              label="System updates"
                            />
                          </Stack>
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Push Notifications</Typography>
                          <FormControlLabel
                            control={<Switch defaultChecked color="primary" />}
                            label="Enable push notifications"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            onClick={handleSaveNotifications}
                            disabled={loading}
                            sx={{
                              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                              color: 'white',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                              }
                            }}
                          >
                            {loading ? 'Saving...' : 'Save Preferences'}
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Box>
    </MainLayout>
  );
};

export default UserSettings;