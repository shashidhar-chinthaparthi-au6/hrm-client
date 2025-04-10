import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import AttendanceStatus from '../components/attendance/AttendanceStatus';
import AttendanceHistory from '../components/attendance/AttendanceHistory';
import AttendanceReport from '../components/attendance/AttendanceReport';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';

const Attendance = () => {
  const { user } = useAuth();
  const [todayStatus, setTodayStatus] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const [statusRes, historyRes] = await Promise.all([
          axios.get('/attendance/today-status'),
          axios.get('/attendance/my-attendance')
        ]);

        setTodayStatus(statusRes.data.data);
        setAttendanceHistory(historyRes.data.data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const handleCheckIn = async () => {
    try {
      const position = await getCurrentPosition();
      const response = await axios.post('/attendance/check-in', {
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      });
      setTodayStatus(response.data.data);
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const position = await getCurrentPosition();
      const response = await axios.post('/attendance/check-out', {
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      });
      setTodayStatus(response.data.data);
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Attendance Management
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <AttendanceStatus
              status={todayStatus}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              loading={loading}
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                My Attendance History
              </Typography>
              <AttendanceHistory
                attendance={attendanceHistory}
                loading={loading}
              />
            </Paper>
          </Grid>

          {user.role === 'hr' && (
            <Grid item xs={12}>
              <AttendanceReport />
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default Attendance; 