import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateLeaveStatus } from '../../redux/actions/leaveActions';
// import { LeaveCalendar } from '../components/leave/LeaveCalendar';
// import { LeaveRequest } from '../../components/leave/LeaveRequest';
// import { LeavePolicy } from '../components/leave/LeavePolicy';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Link, useNavigate } from 'react-router-dom';
import { FaListAlt, FaUserClock, FaCalendarAlt } from 'react-icons/fa';
import { Box, Typography, Paper, Grid, Card, CardContent, Tabs, Tab, LinearProgress, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import './LeaveManagement.scss';

const LeaveManagement = () => {
  const dispatch = useDispatch();
  const { leaves, loading, error } = useSelector((state) => state.leaves);
  const { user } = useSelector((state) => state.auth);
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // useEffect(() => {
  //   dispatch(fetchLeaveRequests());
  // }, [dispatch]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleApproveLeave = (leaveId) => {
    dispatch(updateLeaveStatus(leaveId, 'approved'));
  };

  const handleRejectLeave = (leaveId) => {
    dispatch(updateLeaveStatus(leaveId, 'rejected'));
  };

  const getFilteredLeaves = () => {
    let filtered = [...leaves];
    
    // Filter by tab
    if (activeTab === 'pending') {
      filtered = filtered.filter(leave => leave.status === 'pending');
    } else if (activeTab === 'approved') {
      filtered = filtered.filter(leave => leave.status === 'approved');
    } else if (activeTab === 'rejected') {
      filtered = filtered.filter(leave => leave.status === 'rejected');
    } else if (activeTab === 'my') {
      filtered = filtered.filter(leave => leave.employeeId === user.id);
    }
    
    // Apply additional filters
    if (filterStatus !== 'all') {
      filtered = filtered.filter(leave => leave.status === filterStatus);
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(leave => leave.type === filterType);
    }
    
    return filtered;
  };

  const getBadgeType = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
      render: (_, record) => (
        <div className="flex items-center">
          <img 
            src={record.employee?.profileImage || '/assets/images/placeholder-avatar.png'} 
            alt={`${record.employee?.firstName} ${record.employee?.lastName}`}
            className="avatar-sm mr-2" 
          />
          <Link to={`/employee/details/${record.employeeId}`}>
            {record.employee?.firstName} {record.employee?.lastName}
          </Link>
        </div>
      ),
      sorter: (a, b) => a.employee?.firstName.localeCompare(b.employee?.firstName),
    },
    {
      title: 'Leave Type',
      dataIndex: 'type',
      key: 'type',
      render: (text) => (
        <span className="capitalize">{text.replace(/_/g, ' ')}</span>
      ),
      filters: [
        { text: 'Annual Leave', value: 'annual_leave' },
        { text: 'Sick Leave', value: 'sick_leave' },
        { text: 'Personal Leave', value: 'personal_leave' },
        { text: 'Maternity Leave', value: 'maternity_leave' },
        { text: 'Paternity Leave', value: 'paternity_leave' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'From',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: 'To',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Days',
      dataIndex: 'days',
      key: 'days',
      render: (_, record) => {
        const start = new Date(record.startDate);
        const end = new Date(record.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Badge type={getBadgeType(text)} text={text} />
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          {record.status === 'pending' && user.role !== 'employee' && (
            <>
              <Button 
                type="success" 
                size="small"
                onClick={() => handleApproveLeave(record.id)}
              >
                Approve
              </Button>
              <Button 
                type="danger" 
                size="small"
                onClick={() => handleRejectLeave(record.id)}
              >
                Reject
              </Button>
            </>
          )}
          <Link to={`/leave/details/${record.id}`}>
            <Button type="default" size="small">
              View
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  const tabItems = [
    { key: 'all', label: 'All Leaves', icon: <FaListAlt /> },
    { key: 'pending', label: 'Pending', icon: <FaUserClock /> },
    { key: 'approved', label: 'Approved', icon: <FaCalendarAlt /> },
    { key: 'rejected', label: 'Rejected', icon: <FaCalendarAlt /> },
    { key: 'my', label: 'My Leaves', icon: <FaCalendarAlt /> },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Placeholder leave balances
  const leaveBalances = [
    { type: 'Annual Leave', total: 20, used: 8, remaining: 12 },
    { type: 'Sick Leave', total: 12, used: 3, remaining: 9 },
    { type: 'Personal Leave', total: 5, used: 1, remaining: 4 },
    { type: 'Unpaid Leave', total: 'Unlimited', used: 0, remaining: 'Unlimited' },
  ];

  // Placeholder leave requests
  const leaveRequests = [
    { id: 1, type: 'Annual Leave', from: '2023-12-20', to: '2023-12-25', days: 5, status: 'Approved' },
    { id: 2, type: 'Sick Leave', from: '2023-11-05', to: '2023-11-07', days: 2, status: 'Approved' },
    { id: 3, type: 'Personal Leave', from: '2024-01-15', to: '2024-01-15', days: 1, status: 'Pending' },
  ];

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Leave Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/leave/apply')}
        >
          Apply for Leave
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>My Leave Balances</Typography>
        <Grid container spacing={3}>
          {leaveBalances.map((leave, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {leave.type}
                  </Typography>
                  
                  {leave.total === 'Unlimited' ? (
                    <Typography variant="body2" color="text.secondary">
                      Unlimited
                    </Typography>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Used: {leave.used} days
                        </Typography>
                        <Typography variant="body2" color="primary">
                          {leave.remaining} remaining
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(leave.used / leave.total) * 100} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Upcoming" />
          <Tab label="History" />
          <Tab label="Team Leaves" />
        </Tabs>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>My Leave Requests</Typography>
        <Grid container spacing={2}>
          {leaveRequests.map((leave) => (
            <Grid item xs={12} key={leave.id}>
              <Card variant="outlined">
                <CardContent>
                  <Grid container alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Typography variant="subtitle1">{leave.type}</Typography>
                      <Chip 
                        label={leave.status} 
                        color={
                          leave.status === 'Approved' ? 'success' : 
                          leave.status === 'Pending' ? 'warning' : 'error'
                        }
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2" color="text.secondary">From</Typography>
                      <Typography variant="body1">
                        {new Date(leave.from).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2" color="text.secondary">To</Typography>
                      <Typography variant="body1">
                        {new Date(leave.to).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2" color="text.secondary">Duration</Typography>
                      <Typography variant="body1">{leave.days} days</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <div className="leave-management">
        <div className="page-header">
          <h1>Leave Management</h1>
          <div className="action-buttons">
            <Link to="/leave/apply">
              <Button type="primary">Apply Leave</Button>
            </Link>
            {user.role !== 'employee' && (
              <Link to="/leave/settings">
                <Button type="default">Leave Settings</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="leave-overview">
          <div className="leave-stats">
            <Card className="stat-card pending-leaves">
              <h3>Pending Leaves</h3>
              <div className="stat-value">
                {leaves.filter(leave => leave.status === 'pending').length}
              </div>
            </Card>
            <Card className="stat-card approved-leaves">
              <h3>Approved Leaves</h3>
              <div className="stat-value">
                {leaves.filter(leave => leave.status === 'approved').length}
              </div>
            </Card>
            <Card className="stat-card rejected-leaves">
              <h3>Rejected Leaves</h3>
              <div className="stat-value">
                {leaves.filter(leave => leave.status === 'rejected').length}
              </div>
            </Card>
            <Card className="stat-card today-on-leave">
              <h3>Today On Leave</h3>
              <div className="stat-value">
                {leaves.filter(leave => {
                  const today = new Date();
                  const startDate = new Date(leave.startDate);
                  const endDate = new Date(leave.endDate);
                  return leave.status === 'approved' && 
                         today >= startDate && 
                         today <= endDate;
                }).length}
              </div>
            </Card>
          </div>
        </div>

        <div className="leave-content">
          <Card className="calendar-wrapper">
            <Tabs 
              activeKey={activeTab} 
              onChange={handleTabChange}
              items={tabItems}
            />
            
            <div className="leave-table-container">
              <Table
                columns={columns}
                dataSource={getFilteredLeaves()}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </div>
          </Card>
        </div>

        <LeaveRequest
          visible={showLeaveModal}
          onClose={() => setShowLeaveModal(false)}
        />
      </div>
    </Box>
  );
};

export default LeaveManagement;