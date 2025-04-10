import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Select, Button, DatePicker, Spin } from 'antd';
import { 
  DollarOutlined, 
  TeamOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FileDoneOutlined
} from '@ant-design/icons';
import MainLayout from '../../components/layout/MainLayout';
import { Line, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import PageHeader from '../../components/common/PageHeader';
import { Box, Typography, Paper, Grid, CardContent, Divider, Chip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EventIcon from '@mui/icons-material/Event';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useNavigate } from 'react-router-dom';

// Register Chart.js components
Chart.register(...registerables);

const { Option } = Select;
const { RangePicker } = DatePicker;

const PayrollDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [payrollData, setPayrollData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('april');
  const [selectedYear, setSelectedYear] = useState('2025');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real application, this would be an API call
        // const response = await api.getPayrollDashboardData(selectedMonth, selectedYear);
        // setPayrollData(response.data);
        
        // Mock data
        setTimeout(() => {
          setPayrollData({
            totalSalary: 1250000,
            employeeCount: 125,
            processedCount: 115,
            pendingCount: 10,
            departmentBreakdown: [
              { department: 'Engineering', amount: 450000, count: 45 },
              { department: 'Sales', amount: 320000, count: 32 },
              { department: 'Marketing', amount: 180000, count: 18 },
              { department: 'HR', amount: 90000, count: 9 },
              { department: 'Finance', amount: 110000, count: 11 },
              { department: 'Operations', amount: 100000, count: 10 }
            ],
            salaryComponents: [
              { component: 'Basic', amount: 750000 },
              { component: 'HRA', amount: 300000 },
              { component: 'Bonus', amount: 50000 },
              { component: 'Allowances', amount: 100000 },
              { component: 'Overtime', amount: 50000 }
            ],
            deductionComponents: [
              { component: 'Income Tax', amount: 125000 },
              { component: 'Provident Fund', amount: 62500 },
              { component: 'Professional Tax', amount: 12500 },
              { component: 'Health Insurance', amount: 18750 },
              { component: 'Other Deductions', amount: 6250 }
            ],
            recentPayrolls: [
              { id: 'PR-2025-04', month: 'April', year: '2025', status: 'Draft', amount: 1250000, employees: 125 },
              { id: 'PR-2025-03', month: 'March', year: '2025', status: 'Completed', amount: 1245000, employees: 124 },
              { id: 'PR-2025-02', month: 'February', year: '2025', status: 'Completed', amount: 1220000, employees: 122 },
              { id: 'PR-2025-01', month: 'January', year: '2025', status: 'Completed', amount: 1200000, employees: 120 }
            ],
            monthlyTrend: {
              labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
              data: [1150000, 1180000, 1200000, 1220000, 1245000, 1250000]
            },
            paymentMethods: [
              { method: 'Bank Transfer', count: 110 },
              { method: 'Check', count: 12 },
              { method: 'Cash', count: 3 }
            ]
          });
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Failed to fetch payroll data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedMonth, selectedYear]);
  
  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };
  
  const handleYearChange = (value) => {
    setSelectedYear(value);
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Monthly Payroll Trend'
      }
    }
  };
  
  const lineChartData = {
    labels: payrollData?.monthlyTrend?.labels || [],
    datasets: [
      {
        label: 'Total Salary',
        data: payrollData?.monthlyTrend?.data || [],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      }
    ]
  };
  
  const pieChartData = {
    labels: payrollData?.salaryComponents?.map(item => item.component) || [],
    datasets: [
      {
        data: payrollData?.salaryComponents?.map(item => item.amount) || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }
    ]
  };
  
  const departmentColumns = [
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Employees',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount.toLocaleString()}`,
    },
    {
      title: 'Average',
      key: 'average',
      render: (_, record) => `$${Math.round(record.amount / record.count).toLocaleString()}`,
    },
  ];
  
  const recentPayrollColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Period',
      key: 'period',
      render: (_, record) => `${record.month} ${record.year}`,
    },
    {
      title: 'Employees',
      dataIndex: 'employees',
      key: 'employees',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'Completed') {
          return <span style={{ color: 'green' }}>{status}</span>;
        } else if (status === 'Draft') {
          return <span style={{ color: 'orange' }}>{status}</span>;
        }
        return status;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" size="small">View Details</Button>
      ),
    },
  ];

  if (loading) {
    return (
      <MainLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Payroll Dashboard"
        breadcrumb={[
          { path: '/dashboard', name: 'Dashboard' },
          { path: '/payroll', name: 'Payroll' }
        ]}
      />
      
      <div className="payroll-filter" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Select
              style={{ width: 120 }}
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              <Option value="january">January</Option>
              <Option value="february">February</Option>
              <Option value="march">March</Option>
              <Option value="april">April</Option>
              <Option value="may">May</Option>
              <Option value="june">June</Option>
              <Option value="july">July</Option>
              <Option value="august">August</Option>
              <Option value="september">September</Option>
              <Option value="october">October</Option>
              <Option value="november">November</Option>
              <Option value="december">December</Option>
            </Select>
          </Col>
          <Col>
            <Select
              style={{ width: 100 }}
              value={selectedYear}
              onChange={handleYearChange}
            >
              <Option value="2023">2023</Option>
              <Option value="2024">2024</Option>
              <Option value="2025">2025</Option>
            </Select>
          </Col>
          <Col>
            <Button type="primary">
              Process Payroll
            </Button>
          </Col>
        </Row>
      </div>
      
      {/* Summary Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Salary"
              value={payrollData.totalSalary}
              prefix={<DollarOutlined />}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <div style={{ marginTop: 10, fontSize: '12px', color: 'green' }}>
              <ArrowUpOutlined /> 0.4% from last month
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Employees"
              value={payrollData.employeeCount}
              prefix={<TeamOutlined />}
            />
            <div style={{ marginTop: 10, fontSize: '12px', color: 'green' }}>
              <ArrowUpOutlined /> 1 new employee
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Processed"
              value={payrollData.processedCount}
              prefix={<CheckCircleOutlined style={{ color: 'green' }} />}
              suffix={`/ ${payrollData.employeeCount}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending"
              value={payrollData.pendingCount}
              prefix={<ExclamationCircleOutlined style={{ color: 'orange' }} />}
              suffix={`/ ${payrollData.employeeCount}`}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} md={12}>
          <Card title="Monthly Trend">
            <div style={{ height: 300 }}>
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Salary Components Breakdown">
            <div style={{ height: 300 }}>
              <Pie data={pieChartData} />
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* Department Breakdown */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Department Breakdown">
            <Table 
              columns={departmentColumns} 
              dataSource={payrollData.departmentBreakdown}
              pagination={false}
              rowKey="department"
            />
          </Card>
        </Col>
      </Row>
      
      {/* Recent Payrolls */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card 
            title="Recent Payrolls" 
            extra={<Button icon={<FileDoneOutlined />}>View All Payrolls</Button>}
          >
            <Table 
              columns={recentPayrollColumns} 
              dataSource={payrollData.recentPayrolls}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Payroll Dashboard</Typography>
        <Button 
          variant="contained" 
          startIcon={<DownloadIcon />}
          onClick={() => alert('Download feature will be implemented')}
        >
          Download Latest Payslip
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Current Month</Typography>
                  <Typography variant="h5">$3,500.00</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>Net Salary</Typography>
                </Box>
                <AccountBalanceWalletIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Year to Date</Typography>
                  <Typography variant="h5">$14,200.00</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Total Earnings</Typography>
                </Box>
                <EventIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Tax Deductions</Typography>
                  <Typography variant="h5">$4,850.00</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Year to Date</Typography>
                </Box>
                <AssessmentIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Bonus</Typography>
                  <Typography variant="h5">$1,200.00</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Year to Date</Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Recent Payslips</Typography>
        <Divider sx={{ mb: 2 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pay Period</TableCell>
                <TableCell>Net Pay</TableCell>
                <TableCell>Gross Pay</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payrollData.recentPayrolls.map((payslip) => (
                <TableRow key={payslip.id}>
                  <TableCell>{payslip.month} {payslip.year}</TableCell>
                  <TableCell>{payslip.amount.toLocaleString()}</TableCell>
                  <TableCell>{payslip.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={payslip.status} 
                      color={payslip.status === 'Completed' ? 'success' : 'warning'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{payslip.month} {payslip.year}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => navigate(`/payroll/payslip/${payslip.id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Salary Breakdown</Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>Basic Salary</TableCell>
                    <TableCell align="right">$2,800.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Housing Allowance</TableCell>
                    <TableCell align="right">$700.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Transport Allowance</TableCell>
                    <TableCell align="right">$300.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Performance Bonus</TableCell>
                    <TableCell align="right">$400.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gross Pay</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>$4,200.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tax Deductions</TableCell>
                    <TableCell align="right">$600.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Other Deductions</TableCell>
                    <TableCell align="right">$100.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Net Pay</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>$3,500.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Tax Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>Tax ID</TableCell>
                    <TableCell>TIN-1234567890</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tax Class</TableCell>
                    <TableCell>Class 1</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>YTD Taxable Income</TableCell>
                    <TableCell>$16,800.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>YTD Tax Paid</TableCell>
                    <TableCell>$2,400.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Current Tax Rate</TableCell>
                    <TableCell>15%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default PayrollDashboard;