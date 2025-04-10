import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Fade,
  Tooltip,
  Chip,
  Stack,
  Divider,
  Alert,
  Zoom
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Backup as BackupIcon,
  Save as SaveIcon,
  Send as SendIcon,
  Language as LanguageIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as CurrencyIcon,
  Lock as LockIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import Breadcrumbs from '../components/layout/Breadcrumbs';

const SystemSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('general');
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [settings, setSettings] = useState({
    general: {
      companyName: '',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12',
      timezone: 'UTC',
      defaultLanguage: 'en',
      fiscalYearStart: '01-01',
      currency: 'USD',
      weekStartDay: 'Monday'
    },
    email: {
      smtpServer: '',
      smtpPort: '',
      smtpUser: '',
      smtpPassword: '',
      senderEmail: '',
      senderName: '',
      enableSSL: true
    },
    notifications: {
      enableEmailNotifications: true,
      enableAppNotifications: true,
      enableAttendanceReminders: true,
      enableLeaveApprovalNotifications: true,
      enablePayrollProcessingNotifications: true,
      enableBirthdayNotifications: true,
      enablePerformanceReviewNotifications: true
    },
    security: {
      passwordPolicy: 'medium',
      sessionTimeout: '30',
      maxLoginAttempts: '5',
      twoFactorAuthentication: false,
      passwordExpiryDays: '90',
      ipRestriction: false,
      allowedIPs: ''
    },
    backup: {
      automaticBackup: true,
      backupFrequency: 'daily',
      backupTime: '02:00',
      storageLocation: 'cloud',
      retentionPeriod: '30'
    }
  });

  // Fetch system settings on component mount
  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      // const response = await api.get('/settings/system');
      // setSettings(response.data);
      
      // Simulating API response delay
      setTimeout(() => {
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error fetching system settings:', error);
      toast.error('Failed to load system settings');
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [field]: value
      }
    }));
  };

  const handleCheckboxChange = (section, field) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [field]: !prevSettings[section][field]
      }
    }));
  };

  const handleSaveSettings = async () => {
    setSaveLoading(true);
    try {
      // Mock API call - replace with actual API
      // await api.post('/settings/system', settings);
      
      // Simulating API response delay
      setTimeout(() => {
        toast.success('System settings saved successfully');
        setSaveLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error saving system settings:', error);
      toast.error('Failed to save system settings');
      setSaveLoading(false);
    }
  };

  const handleTestEmailConnection = () => {
    setIsModalOpen(true);
  };

  const sendTestEmail = async () => {
    if (!testEmailAddress) {
      toast.error('Please enter a test email address');
      return;
    }
    
    try {
      // Mock API call - replace with actual API
      // await api.post('/settings/test-email', { ...settings.email, testEmail: testEmailAddress });
      toast.success('Test email sent successfully');
      setIsModalOpen(false);
      setTestEmailAddress('');
    } catch (error) {
      toast.error('Failed to send test email');
    }
  };

  const renderGeneralSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <InfoIcon sx={{ mr: 1 }} />
          General settings affect how your system displays information and handles basic operations.
        </Alert>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Company Name"
          value={settings.general.companyName}
          onChange={(e) => handleInputChange('general', 'companyName', e.target.value)}
          placeholder="Enter company name"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SettingsIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Date Format</InputLabel>
          <Select
            value={settings.general.dateFormat}
            onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
            label="Date Format"
          >
            <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
            <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
            <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Time Format</InputLabel>
          <Select
            value={settings.general.timeFormat}
            onChange={(e) => handleInputChange('general', 'timeFormat', e.target.value)}
            label="Time Format"
          >
            <MenuItem value="12">12-hour (AM/PM)</MenuItem>
            <MenuItem value="24">24-hour</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Timezone</InputLabel>
          <Select
            value={settings.general.timezone}
            onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
            label="Timezone"
          >
            <MenuItem value="UTC">UTC (Coordinated Universal Time)</MenuItem>
            <MenuItem value="EST">EST (Eastern Standard Time)</MenuItem>
            <MenuItem value="PST">PST (Pacific Standard Time)</MenuItem>
            <MenuItem value="IST">IST (Indian Standard Time)</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Default Language</InputLabel>
          <Select
            value={settings.general.defaultLanguage}
            onChange={(e) => handleInputChange('general', 'defaultLanguage', e.target.value)}
            label="Default Language"
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
            <MenuItem value="fr">French</MenuItem>
            <MenuItem value="de">German</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Fiscal Year Start (MM-DD)"
          value={settings.general.fiscalYearStart}
          onChange={(e) => handleInputChange('general', 'fiscalYearStart', e.target.value)}
          placeholder="MM-DD"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Currency</InputLabel>
          <Select
            value={settings.general.currency}
            onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
            label="Currency"
          >
            <MenuItem value="USD">USD - US Dollar</MenuItem>
            <MenuItem value="EUR">EUR - Euro</MenuItem>
            <MenuItem value="GBP">GBP - British Pound</MenuItem>
            <MenuItem value="INR">INR - Indian Rupee</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Week Start Day</InputLabel>
          <Select
            value={settings.general.weekStartDay}
            onChange={(e) => handleInputChange('general', 'weekStartDay', e.target.value)}
            label="Week Start Day"
          >
            <MenuItem value="Monday">Monday</MenuItem>
            <MenuItem value="Sunday">Sunday</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderEmailSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <InfoIcon sx={{ mr: 1 }} />
          Configure your email server settings for system notifications and communications.
        </Alert>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="SMTP Server"
          value={settings.email.smtpServer}
          onChange={(e) => handleInputChange('email', 'smtpServer', e.target.value)}
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
          label="SMTP Port"
          value={settings.email.smtpPort}
          onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
          type="number"
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="SMTP Username"
          value={settings.email.smtpUser}
          onChange={(e) => handleInputChange('email', 'smtpUser', e.target.value)}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="SMTP Password"
          value={settings.email.smtpPassword}
          onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
          type="password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  edge="end"
                >
                  <LockIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Sender Email"
          value={settings.email.senderEmail}
          onChange={(e) => handleInputChange('email', 'senderEmail', e.target.value)}
          type="email"
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Sender Name"
          value={settings.email.senderName}
          onChange={(e) => handleInputChange('email', 'senderName', e.target.value)}
        />
      </Grid>
      
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.email.enableSSL}
              onChange={() => handleCheckboxChange('email', 'enableSSL')}
              color="primary"
            />
          }
          label="Enable SSL/TLS"
        />
      </Grid>
      
      <Grid item xs={12}>
        <Button
          variant="outlined"
          startIcon={<SendIcon />}
          onClick={handleTestEmailConnection}
          sx={{ mt: 1 }}
        >
          Test Email Connection
        </Button>
      </Grid>
    </Grid>
  );

  const renderNotificationSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <InfoIcon sx={{ mr: 1 }} />
          Configure which notifications should be sent to users and through which channels.
        </Alert>
      </Grid>
      
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications.enableEmailNotifications}
              onChange={() => handleCheckboxChange('notifications', 'enableEmailNotifications')}
              color="primary"
            />
          }
          label="Enable Email Notifications"
        />
      </Grid>
      
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications.enableAppNotifications}
              onChange={() => handleCheckboxChange('notifications', 'enableAppNotifications')}
              color="primary"
            />
          }
          label="Enable In-App Notifications"
        />
      </Grid>
      
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications.enableAttendanceReminders}
              onChange={() => handleCheckboxChange('notifications', 'enableAttendanceReminders')}
              color="primary"
            />
          }
          label="Enable Attendance Reminders"
        />
      </Grid>
      
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications.enableLeaveApprovalNotifications}
              onChange={() => handleCheckboxChange('notifications', 'enableLeaveApprovalNotifications')}
              color="primary"
            />
          }
          label="Enable Leave Approval Notifications"
        />
      </Grid>
      
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications.enablePayrollProcessingNotifications}
              onChange={() => handleCheckboxChange('notifications', 'enablePayrollProcessingNotifications')}
              color="primary"
            />
          }
          label="Enable Payroll Processing Notifications"
        />
      </Grid>
      
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications.enableBirthdayNotifications}
              onChange={() => handleCheckboxChange('notifications', 'enableBirthdayNotifications')}
              color="primary"
            />
          }
          label="Enable Birthday Notifications"
        />
      </Grid>
      
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications.enablePerformanceReviewNotifications}
              onChange={() => handleCheckboxChange('notifications', 'enablePerformanceReviewNotifications')}
              color="primary"
            />
          }
          label="Enable Performance Review Notifications"
        />
      </Grid>
    </Grid>
  );

  const renderSecuritySettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <InfoIcon sx={{ mr: 1 }} />
          Configure security settings to protect your system and user data.
        </Alert>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Password Policy</InputLabel>
          <Select
            value={settings.security.passwordPolicy}
            onChange={(e) => handleInputChange('security', 'passwordPolicy', e.target.value)}
            label="Password Policy"
          >
            <MenuItem value="low">Low (Minimum 6 characters)</MenuItem>
            <MenuItem value="medium">Medium (Minimum 8 characters, numbers)</MenuItem>
            <MenuItem value="high">High (Minimum 12 characters, numbers, special chars)</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Session Timeout (minutes)"
          value={settings.security.sessionTimeout}
          onChange={(e) => handleInputChange('security', 'sessionTimeout', e.target.value)}
          type="number"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TimeIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Max Login Attempts"
          value={settings.security.maxLoginAttempts}
          onChange={(e) => handleInputChange('security', 'maxLoginAttempts', e.target.value)}
          type="number"
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Password Expiry (days)"
          value={settings.security.passwordExpiryDays}
          onChange={(e) => handleInputChange('security', 'passwordExpiryDays', e.target.value)}
          type="number"
        />
      </Grid>
      
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.security.twoFactorAuthentication}
              onChange={() => handleCheckboxChange('security', 'twoFactorAuthentication')}
              color="primary"
            />
          }
          label="Enable Two-Factor Authentication"
        />
      </Grid>
      
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.security.ipRestriction}
              onChange={() => handleCheckboxChange('security', 'ipRestriction')}
              color="primary"
            />
          }
          label="Enable IP Restriction"
        />
      </Grid>
      
      {settings.security.ipRestriction && (
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Allowed IP Addresses"
            value={settings.security.allowedIPs}
            onChange={(e) => handleInputChange('security', 'allowedIPs', e.target.value)}
            placeholder="Enter IP addresses separated by commas"
            multiline
            rows={3}
          />
        </Grid>
      )}
    </Grid>
  );

  const renderBackupSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <InfoIcon sx={{ mr: 1 }} />
          Configure automatic backup settings to protect your data.
        </Alert>
      </Grid>
      
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={settings.backup.automaticBackup}
              onChange={() => handleCheckboxChange('backup', 'automaticBackup')}
              color="primary"
            />
          }
          label="Enable Automatic Backup"
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Backup Frequency</InputLabel>
          <Select
            value={settings.backup.backupFrequency}
            onChange={(e) => handleInputChange('backup', 'backupFrequency', e.target.value)}
            label="Backup Frequency"
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Backup Time"
          value={settings.backup.backupTime}
          onChange={(e) => handleInputChange('backup', 'backupTime', e.target.value)}
          type="time"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Storage Location</InputLabel>
          <Select
            value={settings.backup.storageLocation}
            onChange={(e) => handleInputChange('backup', 'storageLocation', e.target.value)}
            label="Storage Location"
          >
            <MenuItem value="cloud">Cloud Storage</MenuItem>
            <MenuItem value="local">Local Storage</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Retention Period (days)"
          value={settings.backup.retentionPeriod}
          onChange={(e) => handleInputChange('backup', 'retentionPeriod', e.target.value)}
          type="number"
        />
      </Grid>
      
      <Grid item xs={12}>
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          sx={{ mt: 1 }}
        >
          Manual Backup Now
        </Button>
      </Grid>
    </Grid>
  );

  // Render the appropriate tab content
  const renderTabContent = () => {
    switch (currentTab) {
      case 'general':
        return renderGeneralSettings();
      case 'email':
        return renderEmailSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumbs
          items={[
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Settings', link: '/settings' },
            { label: 'System Settings', link: '/settings/system' },
          ]}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              System Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure system-wide settings and preferences
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={saveLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleSaveSettings}
            disabled={saveLoading}
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
              }
            }}
          >
            {saveLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>

        <Fade in timeout={500}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 0 }}>
              <Tabs
                value={currentTab}
                onChange={(e, newValue) => setCurrentTab(newValue)}
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
                  icon={<SettingsIcon />}
                  label="General"
                  value="general"
                  iconPosition="start"
                />
                <Tab
                  icon={<EmailIcon />}
                  label="Email"
                  value="email"
                  iconPosition="start"
                />
                <Tab
                  icon={<NotificationsIcon />}
                  label="Notifications"
                  value="notifications"
                  iconPosition="start"
                />
                <Tab
                  icon={<SecurityIcon />}
                  label="Security"
                  value="security"
                  iconPosition="start"
                />
                <Tab
                  icon={<BackupIcon />}
                  label="Backup"
                  value="backup"
                  iconPosition="start"
                />
              </Tabs>
              
              <Box sx={{ p: 3 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Zoom in timeout={300}>
                    <Box>
                      {renderTabContent()}
                    </Box>
                  </Zoom>
                )}
              </Box>
            </CardContent>
          </Card>
        </Fade>

        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Test Email Connection</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              This will send a test email to verify your email settings are configured correctly.
            </Typography>
            <TextField
              fullWidth
              label="Test Email Address"
              placeholder="Enter email address to send test email"
              value={testEmailAddress}
              onChange={(e) => setTestEmailAddress(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={sendTestEmail}
              startIcon={<SendIcon />}
              sx={{
                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                }
              }}
            >
              Send Test Email
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default SystemSettings;