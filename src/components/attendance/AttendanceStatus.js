import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Chip
} from '@mui/material';
import { format } from 'date-fns';

const AttendanceStatus = ({ status, onCheckIn, onCheckOut, loading }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'late':
        return 'warning';
      case 'absent':
        return 'error';
      case 'half-day':
        return 'info';
      default:
        return 'default';
    }
  };

  const renderCheckInOut = () => {
    if (loading) {
      return <CircularProgress size={24} />;
    }

    if (!status || status.status === 'absent') {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={onCheckIn}
          fullWidth
        >
          Check In
        </Button>
      );
    }

    if (status.checkIn && !status.checkOut) {
      return (
        <Button
          variant="contained"
          color="secondary"
          onClick={onCheckOut}
          fullWidth
        >
          Check Out
        </Button>
      );
    }

    return (
      <Typography variant="body2" color="textSecondary">
        Checked out for today
      </Typography>
    );
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Today's Status
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="textSecondary">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </Typography>
      </Box>

      {status && (
        <>
          <Box sx={{ mb: 2 }}>
            <Chip
              label={status.status.toUpperCase()}
              color={getStatusColor(status.status)}
              sx={{ mb: 1 }}
            />
          </Box>

          {status.checkIn && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Check In
              </Typography>
              <Typography variant="body1">
                {format(new Date(status.checkIn.time), 'hh:mm a')}
              </Typography>
            </Box>
          )}

          {status.checkOut && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Check Out
              </Typography>
              <Typography variant="body1">
                {format(new Date(status.checkOut.time), 'hh:mm a')}
              </Typography>
            </Box>
          )}

          {status.workHours && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Work Hours
              </Typography>
              <Typography variant="body1">
                {status.workHours.toFixed(1)} hours
              </Typography>
            </Box>
          )}
        </>
      )}

      {renderCheckInOut()}
    </Paper>
  );
};

export default AttendanceStatus; 