import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Grid,
  Divider,
  Chip,
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BadgeIcon from '@mui/icons-material/Badge';
import { useNavigate } from 'react-router-dom';

const EmployeeDetailsModal = ({ open, onClose, employee }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  if (!employee) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'on-leave': return 'warning';
      default: return 'default';
    }
  };

  const handleViewFullProfile = () => {
    onClose(); // Close the modal first
    navigate(`/employees/${employee._id}`); // Updated path to match router configuration
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        p: 3, 
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h5" fontWeight="bold">
          Employee Details
        </Typography>
        <IconButton 
          onClick={onClose} 
          sx={{ 
            color: 'white',
            '&:hover': {
              backgroundColor: alpha('#fff', 0.1)
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              bgcolor: theme.palette.primary.main,
              fontSize: '2.5rem',
              fontWeight: 'bold',
              mr: 3,
              boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`
            }}
          >
            {employee.firstName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {`${employee.firstName} ${employee.lastName}`}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {employee.designation?.name || 'No Designation'}
            </Typography>
            <Chip 
              label={employee.status?.charAt(0).toUpperCase() + employee.status?.slice(1) || 'Unknown'} 
              color={getStatusColor(employee.status)}
              sx={{ 
                fontWeight: 500,
                borderRadius: 1.5,
                px: 1
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                <BadgeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Employee ID
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {employee.employeeId || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                <EmailIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Email
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {employee.email || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                <PhoneIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Phone
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {employee.phone || 'N/A'}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Department
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {employee.department?.name || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Designation
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {employee.designation?.name || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                <CalendarTodayIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Join Date
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {employee.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString() : 'N/A'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
          sx={{ 
            borderRadius: 2,
            px: 3
          }}
        >
          Close
        </Button>
        <Button 
          variant="contained" 
          onClick={handleViewFullProfile}
          sx={{ 
            borderRadius: 2,
            px: 3,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            '&:hover': {
              background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            }
          }}
        >
          View Full Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeDetailsModal; 