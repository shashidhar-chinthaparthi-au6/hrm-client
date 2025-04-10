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
  Divider,
  Container,
  IconButton,
  Tooltip,
  Avatar,
  Badge
} from '@mui/material';
import { 
  People as PeopleIcon,
  AssignmentTurnedIn as AttendanceIcon,
  EventBusy as LeaveIcon,
  AttachMoney as PayrollIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

// Dummy data for dashboard
const stats = [
  { 
    title: 'Total Employees', 
    value: 125, 
    icon: <PeopleIcon fontSize="large" />,
    trend: '+5%',
    trendUp: true,
    color: '#1976d2'
  },
  { 
    title: 'Present Today', 
    value: 115, 
    icon: <AttendanceIcon fontSize="large" />,
    trend: '+2%',
    trendUp: true,
    color: '#2e7d32'
  },
  { 
    title: 'On Leave', 
    value: 10, 
    icon: <LeaveIcon fontSize="large" />,
    trend: '-1%',
    trendUp: false,
    color: '#ed6c02'
  },
  { 
    title: 'Pending Payrolls', 
    value: 25, 
    icon: <PayrollIcon fontSize="large" />,
    trend: '+3%',
    trendUp: true,
    color: '#0288d1'
  },
];

const recentActivities = [
  { 
    id: 1, 
    type: 'attendance', 
    description: 'John Smith checked in at 09:05 AM', 
    time: '2 hours ago',
    icon: <AttendanceIcon />,
    color: '#2e7d32',
    avatar: 'JS'
  },
  { 
    id: 2, 
    type: 'leave', 
    description: 'Sarah Johnson applied for annual leave', 
    time: '3 hours ago',
    icon: <LeaveIcon />,
    color: '#ed6c02',
    avatar: 'SJ'
  },
  { 
    id: 3, 
    type: 'employee', 
    description: 'New employee David Wilson was added', 
    time: 'Yesterday',
    icon: <PeopleIcon />,
    color: '#1976d2',
    avatar: 'DW'
  },
  { 
    id: 4, 
    type: 'payroll', 
    description: 'Payroll generated for April 2025', 
    time: 'Yesterday', 
    icon: <PayrollIcon />,
    color: '#0288d1',
    avatar: 'HR'
  },
];

const announcements = [
  {
    id: 1,
    title: 'Company Picnic',
    content: 'Annual company picnic scheduled for June 15th at Riverside Park.',
    date: 'Apr 15, 2025',
    icon: <CalendarIcon />,
    color: '#1976d2'
  },
  {
    id: 2,
    title: 'New HR Policy',
    content: 'Updated work from home policy will be effective from May 1st.',
    date: 'Apr 10, 2025',
    icon: <BusinessIcon />,
    color: '#2e7d32'
  },
  {
    id: 3,
    title: 'System Maintenance',
    content: 'HR system will be down for maintenance on April 20th from 10 PM to 2 AM.',
    date: 'Apr 5, 2025',
    icon: <NotificationsIcon />,
    color: '#ed6c02'
  }
];

const Dashboard = () => {
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
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: 'white',
              mb: 1
            }}
          >
            Welcome back!
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)'
            }}
          >
            Here's what's happening with your HR system today
          </Typography>
        </Box>
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  borderRadius: 2,
                  background: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box 
                    sx={{ 
                      backgroundColor: `${stat.color}15`,
                      borderRadius: 2,
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {React.cloneElement(stat.icon, { sx: { color: stat.color } })}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {stat.trendUp ? (
                      <TrendingUpIcon sx={{ color: '#2e7d32', fontSize: 16, mr: 0.5 }} />
                    ) : (
                      <TrendingDownIcon sx={{ color: '#d32f2f', fontSize: 16, mr: 0.5 }} />
                    )}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: stat.trendUp ? '#2e7d32' : '#d32f2f',
                        fontWeight: 600
                      }}
                    >
                      {stat.trend}
                    </Typography>
                  </Box>
                </Box>
                <Typography 
                  variant="h3" 
                  component="div" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 1
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  {stat.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        
        <Grid container spacing={3}>
          {/* Recent Activities */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={3}
              sx={{ 
                borderRadius: 2,
                height: '100%'
              }}
            >
              <CardHeader 
                title="Recent Activities" 
                titleTypographyProps={{ 
                  variant: 'h6',
                  fontWeight: 600
                }}
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <NotificationsIcon />
                  </Avatar>
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                <List>
                  {recentActivities.map((activity) => (
                    <React.Fragment key={activity.id}>
                      <ListItem sx={{ py: 2 }}>
                        <ListItemIcon>
                          <Avatar sx={{ bgcolor: `${activity.color}15`, color: activity.color }}>
                            {activity.avatar}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {activity.description}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {activity.time}
                            </Typography>
                          }
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
            <Card 
              elevation={3}
              sx={{ 
                borderRadius: 2,
                height: '100%'
              }}
            >
              <CardHeader 
                title="Announcements" 
                titleTypographyProps={{ 
                  variant: 'h6',
                  fontWeight: 600
                }}
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <NotificationsIcon />
                  </Avatar>
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                {announcements.map((announcement) => (
                  <React.Fragment key={announcement.id}>
                    <Box sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: `${announcement.color}15`, 
                            color: announcement.color,
                            mr: 2
                          }}
                        >
                          {announcement.icon}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {announcement.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {announcement.date}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ pl: 7 }}>
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
      </Container>
    </Box>
  );
};

export default Dashboard;