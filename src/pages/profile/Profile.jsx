import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button,
  Divider,
  TextField,
  IconButton,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import useAuth from '../../hooks/useAuth';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    department: '',
    joinDate: '',
    bio: '',
    skills: [],
    avatar: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get('/api/employees/me', config);
      const employeeData = res.data.data;
      
      setProfileData({
        name: `${employeeData.firstName} ${employeeData.lastName}`,
        email: employeeData.email,
        avatar: employeeData.profileImage || '',
        role: employeeData.designation?.name || '',
        phone: employeeData.phone || '',
        location: employeeData.address || '',
        department: employeeData.department?.name || '',
        joinDate: new Date(employeeData.joiningDate).toLocaleDateString(),
        bio: employeeData.bio || '',
        skills: employeeData.skills || []
      });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error fetching profile');
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      const [firstName, ...lastNameParts] = profileData.name.split(' ');
      const lastName = lastNameParts.join(' ');

      const profileUpdate = {
        firstName,
        lastName,
        phone: profileData.phone,
        address: profileData.location,
        bio: profileData.bio,
        skills: profileData.skills
      };

      await axios.put('/api/employees/me', profileUpdate, config);
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error updating profile');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      };

      const res = await axios.post('/api/employees/me/profile-image', formData, config);
      setProfileData(prev => ({ ...prev, avatar: res.data.profileImage }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error uploading avatar');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
              color: 'white',
              borderRadius: 2,
            }}
          >
            <Box sx={{ position: 'relative', mr: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  border: '4px solid white',
                  boxShadow: 3,
                }}
                src={profileData.avatar}
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar-upload"
                type="file"
                onChange={handleAvatarUpload}
              />
              <label htmlFor="avatar-upload">
                <IconButton
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: 'grey.100' },
                  }}
                  size="small"
                >
                  <PhotoCameraIcon />
                </IconButton>
              </label>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom>
                {profileData.name}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {profileData.role}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {profileData.department}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={isEditing ? handleSave : handleEdit}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': { backgroundColor: 'grey.100' },
              }}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              About Me
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                sx={{ mb: 3 }}
              />
            ) : (
              <Typography variant="body1" paragraph>
                {profileData.bio}
              </Typography>
            )}

            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {profileData.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={profileData.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={profileData.phone}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Location"
                    secondary={profileData.location}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <WorkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Department"
                    secondary={profileData.department}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Join Date"
                    secondary={profileData.joinDate}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card elevation={3} sx={{ mt: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <List>
                <ListItem button>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Security Settings" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <NotificationsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Notification Preferences" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon>
                    <LanguageIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Language Settings" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 