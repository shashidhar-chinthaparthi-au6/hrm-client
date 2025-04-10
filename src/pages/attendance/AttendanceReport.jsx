import React, { useState, useEffect } from 'react';
import { Card, Select, DatePicker, Button, Table, Pagination } from '../../components/common';
import MainLayout from '../../components/layout/MainLayout';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import AttendanceSummary from '../../components/dashboard/AttendanceSummary';

const AttendanceReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)), // First day of current month
    endDate: new Date(),
  });
  const [filters, setFilters] = useState({
    department: 'all',
    employeeType: 'all',
    status: 'all',
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Mock data - replace with API call
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = Array.from({ length: 35 }, (_, index) => ({
        id: index + 1,
        employeeId: `EMP${1000 + index}`,
        name: `Employee ${index + 1}`,
        department: ['HR', 'Engineering', 'Finance', 'Marketing'][index % 4],
        date: new Date(new Date().setDate(new Date().getDate() - index)),
        checkIn: `0${8 + (index % 2)}:${15 + (index % 30)}`,
        checkOut: `1${7 - (index % 2)}:${30 + (index % 30)}`,
        hoursWorked: `${7 + (index % 3)}.${index % 60}`,
        status: ['Present', 'Late', 'Early Departure', 'Absent', 'Leave'][index % 5],
      }));
      
      setReports(mockData);
      setPagination(prev => ({ ...prev, total: mockData.length }));
      setLoading(false);
    }, 800);
  }, [dateRange, filters]);

  const handleDateChange = (dates) => {
    setDateRange({
      startDate: dates[0],
      endDate: dates[1],
    });
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const handleExport = (format) => {
    // Implement export functionality
    console.log(`Exporting in ${format} format`);
    // In a real implementation, you would call an API endpoint or use a library to generate and download the file
  };

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => date.toLocaleDateString(),
    },
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      key: 'checkIn',
    },
    {
      title: 'Check Out',
      dataIndex: 'checkOut',
      key: 'checkOut',
    },
    {
      title: 'Hours Worked',
      dataIndex: 'hoursWorked',
      key: 'hoursWorked',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <span className={`status-badge status-${status.toLowerCase().replace(' ', '-')}`}>{status}</span>,
    },
  ];

  // Calculate current page items
  const startIndex = (pagination.current - 1) * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const currentPageData = reports.slice(startIndex, endIndex);

  return (
    <MainLayout>
      <div className="attendance-report-page">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Attendance', link: '/attendance' },
            { label: 'Reports', link: '/attendance/reports' },
          ]}
        />

        <h1 className="page-title">Attendance Reports</h1>

        <div className="report-overview">
          <AttendanceSummary />
        </div>

        <Card className="report-filters">
          <div className="filter-row">
            <div className="filter-item">
              <label>Date Range</label>
              <DatePicker
                type="range"
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="filter-item">
              <label>Department</label>
              <Select
                value={filters.department}
                onChange={(value) => handleFilterChange('department', value)}
                options={[
                  { value: 'all', label: 'All Departments' },
                  { value: 'hr', label: 'HR' },
                  { value: 'engineering', label: 'Engineering' },
                  { value: 'finance', label: 'Finance' },
                  { value: 'marketing', label: 'Marketing' },
                ]}
              />
            </div>
            <div className="filter-item">
              <label>Status</label>
              <Select
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'present', label: 'Present' },
                  { value: 'absent', label: 'Absent' },
                  { value: 'late', label: 'Late' },
                  { value: 'leave', label: 'On Leave' },
                ]}
              />
            </div>
          </div>
          <div className="action-row">
            <Button type="primary" onClick={() => console.log('Generating report')}>
              Generate Report
            </Button>
            <div className="export-options">
              <Button type="secondary" onClick={() => handleExport('pdf')}>
                Export as PDF
              </Button>
              <Button type="secondary" onClick={() => handleExport('excel')}>
                Export as Excel
              </Button>
              <Button type="secondary" onClick={() => handleExport('csv')}>
                Export as CSV
              </Button>
            </div>
          </div>
        </Card>

        <Card className="report-table">
          <Table
            columns={columns}
            dataSource={currentPageData}
            loading={loading}
            className="attendance-table"
          />
          <div className="pagination-container">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
            />
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AttendanceReport;