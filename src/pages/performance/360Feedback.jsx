import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Button,
  Rating
} from '@mui/material';

const Feedback360 = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>360° Feedback</Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>My Feedback Tasks</Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardHeader title="Pending Feedback Requests" />
              <Divider />
              <CardContent>
                <List>
                  <ListItem divider>
                    <ListItemText 
                      primary="John Smith - Q2 Performance Review" 
                      secondary="Due in 5 days"
                    />
                    <Button variant="contained" color="primary" size="small">
                      Provide Feedback
                    </Button>
                  </ListItem>
                  <ListItem divider>
                    <ListItemText 
                      primary="Sarah Johnson - Project Collaboration" 
                      secondary="Due in 3 days"
                    />
                    <Button variant="contained" color="primary" size="small">
                      Provide Feedback
                    </Button>
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Team Lead Assessment - David Wilson" 
                      secondary="Due in 7 days"
                    />
                    <Button variant="contained" color="primary" size="small">
                      Provide Feedback
                    </Button>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardHeader title="Feedback Requests for Me" />
              <Divider />
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Your manager has initiated a 360° feedback review for your Q2 performance.
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['Manager', 'Peer 1', 'Peer 2', 'Self'].map((reviewer, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        p: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        width: '80px'
                      }}
                    >
                      <Typography variant="caption">{reviewer}</Typography>
                      <Box sx={{ 
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%', 
                        bgcolor: index === 3 ? 'success.main' : 'warning.main',
                        mt: 1
                      }} />
                      <Typography variant="caption">
                        {index === 3 ? 'Complete' : 'Pending'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>My Recent Feedback</Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2 }}>M</Avatar>
                  <Box>
                    <Typography variant="subtitle1">Manager Feedback</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Q1 Performance Review - Apr 15, 2023
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Communication Skills</Typography>
                  <Rating value={4} readOnly size="small" />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Technical Skills</Typography>
                  <Rating value={5} readOnly size="small" />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Teamwork</Typography>
                  <Rating value={4} readOnly size="small" />
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  "Excellent performer who consistently delivers high-quality work. Shows strong technical capabilities and collaborates well with others. Could improve on communication with stakeholders."
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Feedback360;