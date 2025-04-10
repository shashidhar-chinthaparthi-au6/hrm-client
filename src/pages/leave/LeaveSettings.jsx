import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, CardHeader, Divider, Switch, TextField, FormControlLabel } from '@mui/material';

const LeaveSettings = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Leave Settings</Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Leave Types</Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardHeader title="Annual Leave" />
              <Divider />
              <CardContent>
                <TextField
                  fullWidth
                  label="Default Days"
                  type="number"
                  defaultValue={20}
                  margin="normal"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Allow Carry Forward"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Requires Approval"
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardHeader title="Sick Leave" />
              <Divider />
              <CardContent>
                <TextField
                  fullWidth
                  label="Default Days"
                  type="number"
                  defaultValue={12}
                  margin="normal"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Requires Documentation"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Requires Approval"
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Approval Settings</Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Manager Approval Required"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch />}
              label="HR Approval Required"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Auto-approve if no response within"
            />
            <Box sx={{ ml: 4, mt: 1 }}>
              <TextField
                label="Days"
                type="number"
                defaultValue={3}
                size="small"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default LeaveSettings; 