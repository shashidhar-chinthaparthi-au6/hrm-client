import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Table from '../common/Table';
import Card from '../common/Card';
import DatePicker from '../common/DatePicker';
import Button from '../common/Button';
import Select from '../common/Select';
import Pagination from '../common/Pagination';

const AttendanceReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(),
  });
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [exportType, setExportType] = useState('pdf');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Mock departments
  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'dev', name: 'Development' },
    { id: 'hr', name: 'Human Resources' },
    { id: 'fin', name: 'Finance' },
    { id: 'sales', name: 'Sales' },
  ];

  // Mock employees
  const employees = [
    { id: 'all', name: 'All Employees' },
    { id: 'emp1', name: 'John Doe' },
    { id: 'emp2', name: 'Jane Smith' },
    { id: 'emp3', name: 'Mike Johnson' },
  ];

  // Column definitions
  const columns = [
    { id: 'employeeName', label: 'Employee', sortable: true },
    { id: 'department', label: 'Department', sortable: true },
    { id: 'date', label: 'Date', sortable: true },
    { id: 'checkIn', label: 'Check In', sortable: true },
    { id: 'checkOut', label: 'Check Out', sortable: true },
    { id: 'totalHours', label: 'Hours', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
  ];

  // Fetch attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          // Mock data
          const mockReports = Array.from({ length: 50 }).map((_, index) => {
            const employeeId = `emp${(index % 3) + 1}`;
            const deptId = ['dev', 'hr', 'fin', 'sales'][index % 4];
            const date = new Date();
            date.setDate(date.getDate() - (index % 30));
            
            const checkInHour = 8 + (index % 2);
            const checkOutHour = 17 + (index % 3);
            const totalHours = checkOutHour - checkInHour;
            
            return {
              id: `att-${index}`,
              employeeId,
              employeeName: employees.find(emp => emp.id === employeeId)?.name || 'Unknown',
              departmentId: deptId,
              department: departments.find(dept => dept.id === deptId)?.name || 'Unknown',
              date: format(date, 'yyyy-MM-dd'),
              checkIn: `${checkInHour}:00 AM`,
              checkOut: `${checkOutHour}:00 PM`,
              totalHours: `${totalHours}h 0m`,
              status: totalHours >= 8 ? 'Present' : 'Half Day',
            };
          });

          // Apply filters
          let filteredReports = mockReports.filter(report => {
            const reportDate = new Date(report.date);
            return (
              reportDate >= dateRange.startDate &&
              reportDate <= dateRange.endDate &&
              (employeeFilter === 'all' || report.employeeId === employeeFilter) &&
              (departmentFilter === 'all' || report.departmentId === departmentFilter)
            );
          });

          setTotalItems(filteredReports.length);
          
          // Apply pagination
          const start = (currentPage - 1) * itemsPerPage;
          const paginatedReports = filteredReports.slice(start, start + itemsPerPage);
          
          setReports(paginatedReports);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [dateRange, employeeFilter, departmentFilter, currentPage]);

  const handleExport = () => {
    // Implement export functionality
    alert(`Exporting report as ${exportType}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Present':
        return 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold';
      case 'Half Day':
        return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs font-semibold';
      case 'Absent':
        return 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-semibold';
      default:
        return '';
    }
  };

  // Format data for table
  const formattedData = reports.map(report => ({
    ...report,
    status: <span className={getStatusClass(report.status)}>{report.status}</span>
  }));

  return (
    <div className="attendance-report-container">
      <h1 className="text-2xl font-bold mb-6">Attendance Reports</h1>
      
      <Card>
        <div className="filters grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <DatePicker
              selected={dateRange.startDate}
              onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <DatePicker
              selected={dateRange.endDate}
              onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Employee</label>
            <Select
              options={employees}
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              labelKey="name"
              valueKey="id"
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
        </div>
        
        <div className="export-options flex justify-between items-center mb-4">
          <div className="summary">
            <p className="text-sm text-gray-600">
              {totalItems} records found | Period: {format(dateRange.startDate, 'dd MMM yyyy')} - {format(dateRange.endDate, 'dd MMM yyyy')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              options={[
                { id: 'pdf', name: 'PDF' },
                { id: 'excel', name: 'Excel' },
                { id: 'csv', name: 'CSV' }
              ]}
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              labelKey="name"
              valueKey="id"
              className="w-32"
            />
            <Button onClick={handleExport} variant="primary">
              Export
            </Button>
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

export default AttendanceReport;