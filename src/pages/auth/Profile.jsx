import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  PhotoCamera as PhotoCameraIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import { getAuthData, setAuthData } from '../../utils/storage';
import { employeeService } from '../../services/employeeService';
import api from '../../services/api';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: { name: '' },
    designation: { name: '' },
    position: '',
    jobTitle: '',
    joiningDate: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    emergencyContact: '',
    emergencyPhone: '',
    bio: '',
    skills: [],
    profileImage: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (id) {
          response = await employeeService.getById(id);
        } else {
          response = await employeeService.getCurrentUser();
        }
        
        if (response?.data) {
          const data = response.data;
          const jobTitle = data.jobTitle || data.designation?.name || '';
          setProfileData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            department: data.department || { name: '' },
            designation: data.designation || { name: '' },
            position: jobTitle,
            jobTitle: jobTitle,
            joiningDate: data.dateOfJoining || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            country: data.country || '',
            zipCode: data.zipCode || '',
            emergencyContact: data.emergencyContact || '',
            emergencyPhone: data.emergencyPhone || '',
            bio: data.bio || '',
            skills: data.skills || [],
            profileImage: data.profileImage || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.message || 'Failed to load profile data');
        showToast(error.message || 'Failed to load profile data', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [id, showToast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'position') {
      // When position changes, update position and jobTitle
      setProfileData(prev => ({
        ...prev,
        position: value,
        jobTitle: value
      }));
    } else if (name === 'department') {
      setProfileData(prev => ({
        ...prev,
        department: { _id: value }
      }));
    } else if (name === 'designation') {
      setProfileData(prev => ({
        ...prev,
        designation: { _id: value }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Get the current position value
      const currentPosition = profileData.position || '';
      
      // Prepare data for saving - ensure proper object formatting
      const dataToSave = {
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        // Ensure department and designation are proper objects
        department: {
          _id: profileData.department?._id || profileData.department?.id
        },
        designation: {
          _id: profileData.designation?._id || profileData.designation?.id
        },
        jobTitle: currentPosition,
        dateOfJoining: profileData.joiningDate || profileData.dateOfJoining || '',
        address: profileData.address || '',
        city: profileData.city || '',
        state: profileData.state || '',
        country: profileData.country || '',
        zipCode: profileData.zipCode || '',
        emergencyContact: profileData.emergencyContact || '',
        emergencyPhone: profileData.emergencyPhone || '',
        bio: profileData.bio || '',
        skills: Array.isArray(profileData.skills) ? profileData.skills : [],
        profileImage: profileData.profileImage || ''
      };
      
      console.log('Saving profile data:', JSON.stringify(dataToSave, null, 2));
      
      let response;
      try {
        if (id) {
          response = await employeeService.update(id, dataToSave);
        } else {
          response = await employeeService.updateCurrentUser(dataToSave);
        }
        
        console.log('API Response:', JSON.stringify(response, null, 2));
        
        if (!response?.data) {
          throw new Error('No data received from server');
        }

        const responseData = response.data;
        
        // Update local state with response data
        const updatedProfile = {
          ...responseData,
          position: responseData.jobTitle || currentPosition,
          joiningDate: responseData.dateOfJoining || responseData.joiningDate,
          department: responseData.department || profileData.department,
          designation: responseData.designation || profileData.designation
        };
        
        console.log('Updated profile:', JSON.stringify(updatedProfile, null, 2));
        
        setProfileData(updatedProfile);
        
        // Update auth data
        const authData = getAuthData();
        if (authData) {
          const updatedAuthData = {
            ...authData,
            user: {
              ...authData.user,
              ...updatedProfile
            }
          };
          setAuthData(updatedAuthData, true);
        }
        
        showToast('Profile updated successfully', 'success');
        setIsEditing(false);
      } catch (error) {
        throw new Error(`API Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.message || 'Failed to update profile';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const response = await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      if (response?.data) {
        showToast('Password changed successfully', 'success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowPasswordModal(false);
      } else {
        throw new Error('Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.message || 'Failed to change password');
      showToast(error.message || 'Failed to change password', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      showToast('No file selected', 'error');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Create FormData and append file
      const formData = new FormData();
      formData.append('profileImage', file);
      
      // Debug log for file and FormData
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });
      
      // Debug log for FormData
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }
      
      // Get auth token
      const token = getAuthData()?.token;
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Create request options
      const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      };
      
      console.log('Sending request with options:', {
        method: requestOptions.method,
        headers: requestOptions.headers,
        formDataKeys: [...formData.keys()]
      });
      
      // Make the request
      const response = await fetch('http://localhost:5000/api/employees/me/profile-image', requestOptions);
      const data = await response.json();
      
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || `Upload failed with status ${response.status}`);
      }
      
      if (!data?.data?.profileImage && !data?.profileImage) {
        throw new Error('No image URL in response');
      }
      
      const imageUrl = data.data?.profileImage || data.profileImage;
      console.log('Received image URL:', imageUrl);
      
      // Update local state
      setProfileData(prev => ({
        ...prev,
        profileImage: imageUrl
      }));

      // Update auth data
      const authData = getAuthData();
      if (authData) {
        const updatedAuthData = {
          ...authData,
          user: {
            ...authData.user,
            profileImage: imageUrl
          }
        };
        setAuthData(updatedAuthData, true);
      }

      showToast('Profile image updated successfully', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error.message || 'Failed to upload profile image';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const isOwnProfile = !id || id === user?.id;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
        py: 4,
        px: 2
      }}
    >
      <Container maxWidth="lg">
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Box sx={{ position: 'relative', mr: 3 }}>
              <Avatar
                src={profileData.profileImage}
                sx={{
                  width: 120,
                  height: 120,
                  border: '4px solid white',
                  boxShadow: 3
                }}
              />
              {isOwnProfile && (
                <IconButton
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                  disabled={saving}
                >
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleImageUpload(e);
                      }
                    }}
                  />
                  <PhotoCameraIcon sx={{ color: 'white' }} />
                </IconButton>
              )}
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {profileData.firstName} {profileData.lastName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {profileData.position || 'N/A'} at {profileData.department?.name || 'N/A'}
              </Typography>
              {isOwnProfile && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<LockIcon />}
                    onClick={() => setShowPasswordModal(true)}
                    sx={{ mr: 2 }}
                    disabled={saving}
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    disabled={saving}
                  >
                    {saving ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : isEditing ? (
                      'Save Changes'
                    ) : (
                      'Edit Profile'
                    )}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Personal Information
              </Typography>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Work Information
              </Typography>
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={profileData.department?.name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Position"
                name="position"
                value={profileData.position}
                onChange={handleInputChange}
                disabled={!isEditing}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Joining Date"
                name="joiningDate"
                type="date"
                value={profileData.joiningDate}
                onChange={handleInputChange}
                disabled={!isEditing}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                multiline
                rows={4}
                value={profileData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Address Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={profileData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={profileData.state}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    value={profileData.country}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    name="zipCode"
                    value={profileData.zipCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Dialog
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleUpdatePassword} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdatePassword}
            variant="contained"
            disabled={saving}
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
              }
            }}
          >
            {saving ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Update Password'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;