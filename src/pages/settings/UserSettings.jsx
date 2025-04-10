import React from 'react';
import { Box, Typography, Paper, Grid, Button, TextField, Avatar, Divider, Tab, Tabs, Switch, FormControlLabel } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';

const UserSettings = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Account Settings</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={value} onChange={handleChange} aria-label="settings tabs">
          <Tab icon={<PersonIcon />} label="Profile" />
          <Tab icon={<SecurityIcon />} label="Security" />
          <Tab icon={<NotificationsIcon />} label="Notifications" />
        </Tabs>
      </Box>
      
      {/* Profile Tab */}
      {value === 0 && (
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                sx={{ width: 120, height: 120, mb: 2 }}
                src="/assets/profile-placeholder.jpg"
              />
              <Button variant="outlined" sx={{ mb: 1 }}>
                Change Photo
              </Button>
              <Typography variant="body2" color="text.secondary">
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    defaultValue="Doe"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    defaultValue="john.doe@example.com"
                    type="email"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    defaultValue="+1 (555) 123-4567"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Job Title"
                    defaultValue="Software Developer"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    startIcon={<SaveIcon />}
                    sx={{ mt: 2 }}
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Security Tab */}
      {value === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Password & Security</Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                helperText="At least 8 characters with letters, numbers & symbols"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Two-Factor Authentication</Typography>
              <FormControlLabel
                control={<Switch />}
                label="Enable two-factor authentication for better security"
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />}
                sx={{ mt: 2 }}
              >
                Update Security Settings
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Notifications Tab */}
      {value === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Email Notifications</Typography>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Payroll notifications"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Leave request updates"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Performance reviews"
              />
              <FormControlLabel
                control={<Switch />}
                label="System updates"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Push Notifications</Typography>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable push notifications"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />}
                sx={{ mt: 2 }}
              >
                Save Preferences
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default UserSettings;