import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUserProfile, logout } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
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
        // If id is provided, we're viewing someone else's profile
        const endpoint = id ? `/api/employees/${id}` : '/api/employees/me';
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        showToast('Failed to load profile data', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [id, showToast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const response = await fetch('/api/employees/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedProfile = await response.json();
      setProfileData(updatedProfile);
      updateUserProfile(updatedProfile);
      
      showToast('Profile updated successfully', 'success');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile', 'error');
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
      
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }
      
      showToast('Password changed successfully', 'success');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordModal(false);
    } catch (error) {
      console.error('Error changing password:', error);
      showToast(error.message || 'Failed to change password', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      
      const response = await fetch('/api/employees/me/profile-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      setProfileData(prev => ({
        ...prev,
        profileImage: data.profileImage
      }));
      
      showToast('Profile image updated', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Failed to upload profile image', 'error');
    }
  };

  const isOwnProfile = !id || id === user?.id;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading profile...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isOwnProfile ? 'My Profile' : `${profileData.firstName} ${profileData.lastName}'s Profile`}
          </h1>
          
          {isOwnProfile && (
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleSaveProfile}
                    loading={saving}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change Password
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Profile picture and basic info */}
          <div className="col-span-1">
            <Card>
              <div className="flex flex-col items-center p-4">
                <div className="mb-4 relative">
                  <Avatar 
                    src={profileData.profileImage} 
                    name={`${profileData.firstName} ${profileData.lastName}`} 
                    size="xl" 
                  />
                  
                  {isEditing && isOwnProfile && (
                    <div className="absolute bottom-0 right-0">
                      <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                        />
                      </label>
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-semibold">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-gray-600">{profileData.position}</p>
                <p className="text-gray-500 text-sm">{profileData.department}</p>
                
                <div className="w-full border-t border-gray-200 my-4"></div>
                
                <div className="w-full">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{profileData.email}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{profileData.phone || 'Not provided'}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Joined</p>
                    <p>{new Date(profileData.joiningDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="mt-6">
              <div className="p-4">
                <h3 className="font-semibold mb-3">Skills & Expertise</h3>
                
                {profileData.skills && profileData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No skills listed</p>
                )}
              </div>
            </Card>
          </div>
          
          {/* Right column - Detailed information */}
          <div className="col-span-1 md:col-span-2">
            <Card>
              <div className="p-4">
                <h3 className="font-semibold mb-4">Personal Information</h3>
                
                <form onSubmit={handleSaveProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                    
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                    
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                    
                    <Input
                      label="Phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    
                    <Input
                      label="Department"
                      name="department"
                      value={profileData.department}
                      onChange={handleInputChange}
                      disabled={true} // Department usually changed by HR
                    />
                    
                    <Input
                      label="Position"
                      name="position"
                      value={profileData.position}
                      onChange={handleInputChange}
                      disabled={true} // Position usually changed by HR
                    />
                    
                    <Input
                      label="Joining Date"
                      name="joiningDate"
                      type="date"
                      value={profileData.joiningDate ? profileData.joiningDate.split('T')[0] : ''}
                      onChange={handleInputChange}
                      disabled={true} // Joining date usually set by HR
                    />
                  </div>
                  
                  <h3 className="font-semibold mb-4 mt-6">Address Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Address"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <Input
                      label="City"
                      name="city"
                      value={profileData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    
                    <Input
                      label="State/Province"
                      name="state"
                      value={profileData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    
                    <Input
                      label="Country"
                      name="country"
                      value={profileData.country}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    
                    <Input
                      label="Zip/Postal Code"
                      name="zipCode"
                      value={profileData.zipCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <h3 className="font-semibold mb-4 mt-6">Emergency Contact</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Contact Name"
                      name="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    
                    <Input
                      label="Contact Phone"
                      name="emergencyPhone"
                      value={profileData.emergencyPhone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <h3 className="font-semibold mb-4 mt-6">Additional Information</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <Input
                      label="Bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <form onSubmit={handleUpdatePassword}>
          <div className="space-y-4">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
            
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
            
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
            
            <div className="flex justify-end space-x-3 mt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                loading={saving}
              >
                Update Password
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};

export default Profile;