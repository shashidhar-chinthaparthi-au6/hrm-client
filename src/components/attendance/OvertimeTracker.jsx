import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import Card from '../common/Card';
import Table from '../common/Table';
import DatePicker from '../common/DatePicker';
import Select from '../common/Select';
import Button from '../common/Button';
import Pagination from '../common/Pagination';

const OvertimeTracker = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [overtimeData, setOvertimeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Column definitions
  const columns = [
    { id: 'employeeName', label: 'Employee', sortable: true },
    { id: 'department', label: 'Department', sortable: true },
    { id: 'date', label: 'Date', sortable: true },
    { id: 'regularHours', label: 'Regular Hours', sortable: true },
    { id: 'overtimeHours', label: 'Overtime Hours', sortable: true },
    { id: 'rate', label: 'OT Rate', sortable: true },
    { id: 'amount', label: 'Amount', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false }
  ];

  // Mock departments
  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'dev', name: 'Development' },
    { id: 'hr', name: 'Human Resources' },
    { id: 'fin', name: 'Finance' },
    { id: 'sales', name: 'Sales' },
  ];

  // Statuses
  const statuses = [
    { id: 'all', name: 'All Statuses' },
    { id: 'pending', name: 'Pending' },
    { id: 'approved', name: 'Approved' },
    { id: 'rejected', name: 'Rejected' },
  ];

  useEffect(() => {
    const fetchOvertimeData = async () => {
      setLoading(true);
      try {
        // Calculate date range for the selected month
        const start = startOfMonth(selectedMonth);
        const end = endOfMonth(selectedMonth);
        
        // Simulate API call
        setTimeout(() => {
          // Generate mock data
          const mockData = Array.from({ length: 45 }).map((_, index) => {
            const employeeId = index % 15 + 1;
            const deptId = ['dev', 'hr', 'fin', 'sales'][index % 4];
            const date = new Date(selectedMonth);
            date.setDate((index % 28) + 1);
            
            const regularHours = 8;
            const overtimeHours = 1 + (index % 4);
            const rate = 1.5;
            const amount = overtimeHours * rate * 25; // Assuming $25/hour base pay
            
            const statusOptions = ['pending', 'approved', 'rejected'];
            const status = statusOptions[index % 3];
            
            return {
              id: `ot-${index}`,
              employeeId: `emp${employeeId}`,
              employeeName: `Employee ${employeeId}`,
              departmentId: deptId,
              department: departments.find(dept => dept.id === deptId)?.name || 'Unknown',
              date: format(date, 'yyyy-MM-dd'),
              regularHours: `${regularHours}h`,
              overtimeHours: `${overtimeHours}h`,
              rate: `${rate}x`,
              amount: `$${amount.toFixed(2)}`,
              status,
              reason: `Working on urgent project ${index % 5 + 1}`
            };
          });

          // Apply filters
          let filteredData = mockData.filter(item => {
            return (
              (departmentFilter === 'all' || item.departmentId === departmentFilter) &&
              (statusFilter === 'all' || item.status === statusFilter)
            );
          });

          setTotalItems(filteredData.length);
          
          // Apply pagination
          const start = (currentPage - 1) * itemsPerPage;
          const paginatedData = filteredData.slice(start, start + itemsPerPage);
          
          setOvertimeData(paginatedData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching overtime data:", error);
        setLoading(false);
      }
    };

    fetchOvertimeData();
  }, [selectedMonth, departmentFilter, statusFilter, currentPage]);

  const handleApprove = (id) => {
    setOvertimeData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, status: 'approved' } : item
      )
    );
  };

  const handleReject = (id) => {
    setOvertimeData(prevData => 
      prevData.map(item => 
        item.id === id ? { ...item, status: 'rejected' } : item
      )
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getActionButtons = (item) => {
    if (item.status === 'pending') {
      return (
        <div className="flex space-x-2">
          <Button
            variant="success"
            size="sm"
            onClick={() => handleApprove(item.id)}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleReject(item.id)}
          >
            Reject
          </Button>
        </div>
      );
    }
    return <span className="text-sm text-gray-500">-</span>;
  };

  // Format data for table
  const formattedData = overtimeData.map(item => ({
    ...item,
    status: getStatusBadge(item.status),
    actions: getActionButtons(item)
  }));

  // Calculate summary statistics
  const totalOvertimeHours = overtimeData.reduce((sum, item) => {
    const hours = parseFloat(item.overtimeHours.replace('h', ''));
    return sum + hours;
  }, 0);
  
  const totalOvertimeAmount = overtimeData.reduce((sum, item) => {
    const amount = parseFloat(item.amount.replace('$', ''));
    return sum + amount;
  }, 0);

  const pendingCount = overtimeData.filter(item => item.status === 'pending').length;
  const approvedCount = overtimeData.filter(item => item.status === 'approved').length;
  const rejectedCount = overtimeData.filter(item => item.status === 'rejected').length;

  return (
    <div className="overtime-tracker-container">
      <h1 className="text-2xl font-bold mb-6">Overtime Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">Total Hours</h3>
            <p className="text-3xl font-bold mt-2">{totalOvertimeHours.toFixed(1)}h</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">Total Amount</h3>
            <p className="text-3xl font-bold mt-2">${totalOvertimeAmount.toFixed(2)}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
            <p className="text-3xl font-bold mt-2 text-yellow-600">{pendingCount}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">Approved</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">{approvedCount}</p>
          </div>
        </Card>
      </div>
      
      <Card>
        <div className="filters grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Month</label>
            <DatePicker
              selected={selectedMonth}
              onChange={setSelectedMonth}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <Select
              options={departments}
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              labelKey="name"
              valueKey="id"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              options={statuses}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              labelKey="name"
              valueKey="id"
            />
          </div>
        </div>
        
        <Table
          columns={columns}
          data={formattedData}
          loading={loading}
          sortable={true}
          initialSort={{ column: 'date', direction: 'desc' }}
        />
        
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </Card>
    </div>
  );
};

export default OvertimeTracker;