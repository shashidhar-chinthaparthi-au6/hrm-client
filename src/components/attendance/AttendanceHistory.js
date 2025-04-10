import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Box
} from '@mui/material';
import { format } from 'date-fns';

const AttendanceHistory = ({ attendance, loading }) => {
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!attendance || attendance.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        No attendance records found
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Check In</TableCell>
            <TableCell>Check Out</TableCell>
            <TableCell>Work Hours</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendance.map((record) => (
            <TableRow key={record._id}>
              <TableCell>
                {format(new Date(record.date), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <Chip
                  label={record.status.toUpperCase()}
                  color={getStatusColor(record.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {record.checkIn
                  ? format(new Date(record.checkIn.time), 'hh:mm a')
                  : '-'}
              </TableCell>
              <TableCell>
                {record.checkOut
                  ? format(new Date(record.checkOut.time), 'hh:mm a')
                  : '-'}
              </TableCell>
              <TableCell>
                {record.workHours
                  ? `${record.workHours.toFixed(1)} hours`
                  : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceHistory; 