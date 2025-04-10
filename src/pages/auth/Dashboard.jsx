import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { 
  People as PeopleIcon,
  AssignmentTurnedIn as AttendanceIcon,
  EventBusy as LeaveIcon,
  AttachMoney as PayrollIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

// Dummy data for dashboard
const stats = [
  { title: 'Total Employees', value: 125, icon: <PeopleIcon fontSize="large" color="primary" /> },
  { title: 'Present Today', value: 115, icon: <AttendanceIcon fontSize="large" color="success" /> },
  { title: 'On Leave', value: 10, icon: <LeaveIcon fontSize="large" color="warning" /> },
  { title: 'Pending Payrolls', value: 25, icon: <PayrollIcon fontSize="large" color="info" /> },
];

const recentActivities = [
  { 
    id: 1, 
    type: 'attendance', 
    description: 'John Smith checked in at 09:05 AM', 
    time: '2 hours ago',
    icon: <AttendanceIcon color="success" />
  },
  { 
    id: 2, 
    type: 'leave', 
    description: 'Sarah Johnson applied for annual leave', 
    time: '3 hours ago',
    icon: <LeaveIcon color="warning" />
  },
  { 
    id: 3, 
    type: 'employee', 
    description: 'New employee David Wilson was added', 
    time: 'Yesterday',
    icon: <PeopleIcon color="primary" />
  },
  { 
    id: 4, 
    type: 'payroll', 
    description: 'Payroll generated for April 2025', 
    time: 'Yesterday', 
    icon: <PayrollIcon color="info" />
  },
];

const announcements = [
  {
    id: 1,
    title: 'Company Picnic',
    content: 'Annual company picnic scheduled for June 15th at Riverside Park.',
    date: 'Apr 15, 2025'
  },
  {
    id: 2,
    title: 'New HR Policy',
    content: 'Updated work from home policy will be effective from May 1st.',
    date: 'Apr 10, 2025'
  },
  {
    id: 3,
    title: 'System Maintenance',
    content: 'HR system will be down for maintenance on April 20th from 10 PM to 2 AM.',
    date: 'Apr 5, 2025'
  }
];

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" component="div">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
                {stat.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader 
              title="Recent Activities" 
              titleTypographyProps={{ variant: 'h6' }}
              avatar={<NotificationsIcon color="primary" />}
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List>
                {recentActivities.map((activity) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon>
                        {activity.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={activity.description}
                        secondary={activity.time}
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Announcements */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader 
              title="Announcements" 
              titleTypographyProps={{ variant: 'h6' }}
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              {announcements.map((announcement) => (
                <React.Fragment key={announcement.id}>
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1">{announcement.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {announcement.date}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {announcement.content}
                    </Typography>
                  </Box>
                  {announcement.id !== announcements.length && <Divider />}
                </React.Fragment>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;