import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, Filter, ArrowUpDown, Download } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Select from '../common/Select';
import DatePicker from '../common/DatePicker';
import Table from '../common/Table';
import CheckInOut from './CheckInOut';
import AttendanceSummary from '../dashboard/AttendanceSummary';

const AttendanceTracker = ({ userId, isAdmin = false }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)), // First day of current month
    endDate: new Date(), // Today
  });
  const [filters, setFilters] = useState({
    status: 'all',
    employeeId: isAdmin ? 'all' : userId,
  });
  const [employees, setEmployees] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setIsLoading(true);
        
        // Construct query params
        const queryParams = new URLSearchParams({
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
          status: filters.status,
          employeeId: filters.employeeId,
        });
        
        // Replace with your actual API endpoint
        const response = await fetch(`/api/attendance?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch attendance data');
        }
        
        const data = await response.json();
        setAttendanceData(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [dateRange, filters, userId]);

  useEffect(() => {
    // Only fetch employees if admin view
    if (isAdmin) {
      const fetchEmployees = async () => {
        try {
          // Replace with your actual API endpoint
          const response = await fetch('/api/employees');
          
          if (!response.ok) {
            throw new Error('Failed to fetch employees');
          }
          
          const data = await response.json();
          setEmployees(data);
        } catch (err) {
          console.error('Error fetching employees:', err);
        }
      };

      fetchEmployees();
    }
  }, [isAdmin]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateRangeChange = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
  };

  const exportAttendance = () => {
    // Implementation for exporting attendance data
    const dataStr = JSON.stringify(attendanceData);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `attendance_${dateRange.startDate.toISOString().split('T')[0]}_to_${dateRange.endDate.toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'half-day': return 'bg-orange-100 text-orange-800';
      case 'weekend': return 'bg-purple-100 text-purple-800';
      case 'holiday': return 'bg-blue-100 text-blue-800';
      case 'leave': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    { 
      header: 'Date', 
      accessor: 'date',
      cell: (row) => new Date(row.date).toLocaleDateString()
    },
    { 
      header: isAdmin ? 'Employee' : null, 
      accessor: 'employeeName',
      hidden: !isAdmin
    },
    { 
      header: 'Check In', 
      accessor: 'checkIn',
      cell: (row) => row.checkIn ? new Date(row.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'
    },
    { 
      header: 'Check Out', 
      accessor: 'checkOut',
      cell: (row) => row.checkOut ? new Date(row.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'
    },
    { 
      header: 'Hours', 
      accessor: 'hoursWorked',
      cell: (row) => row.hoursWorked ? `${row.hoursWorked.toFixed(2)}h` : '-'
    },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
          {row.status}
        </span>
      )
    },
    { 
      header: 'Notes', 
      accessor: 'notes'
    }
  ].filter(col => !col.hidden);

  return (
    <div className="space-y-6">
      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CheckInOut userId={userId} onUpdate={() => {
            // Refresh data after check-in/out
            const fetchAttendanceData = async () => {
              try {
                // Replace with your actual API endpoint
                const response = await fetch(`/api/attendance/today?employeeId=${userId}`);
                
                if (!response.ok) {
                  throw new Error('Failed to fetch today\'s attendance');
                }
                
                const data = await response.json();
                // Update today's entry in the table
                setAttendanceData(prev => {
                  const updated = [...prev];
                  const todayIndex = updated.findIndex(item => 
                    new Date(item.date).toDateString() === new Date().toDateString()
                  );
                  if (todayIndex >= 0) {
                    updated[todayIndex] = data;
                  } else {
                    updated.unshift(data);
                  }
                  return updated;
                });
              } catch (err) {
                console.error('Error updating attendance:', err);
              }
            };
            
            fetchAttendanceData();
          }} />
          <AttendanceSummary className="col-span-2" employeeId={userId} period="month" />
        </div>
      )}

      <Card>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold">Attendance Log</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex">
              <DatePicker
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onChange={handleDateRangeChange}
                className="w-full md:w-auto"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1"
            >
              <Filter size={16} />
              Filters
            </Button>
            <Button
              variant="primary"
              onClick={exportAttendance}
              className="flex items-center gap-1"
            >
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {isAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee
                </label>
                <Select
                  options={[
                    { value: 'all', label: 'All Employees' },
                    ...employees.map(emp => ({ 
                      value: emp.id, 
                      label: emp.name 
                    }))
                  ]}
                  value={filters.employeeId}
                  onChange={(value) => handleFilterChange('employeeId', value)}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'present', label: 'Present' },
                  { value: 'absent', label: 'Absent' },
                  { value: 'late', label: 'Late' },
                  { value: 'half-day', label: 'Half Day' },
                  { value: 'leave', label: 'On Leave' }
                ]}
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
              />
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setFilters({
                    status: 'all',
                    employeeId: isAdmin ? 'all' : userId,
                  });
                  setDateRange({
                    startDate: new Date(new Date().setDate(1)),
                    endDate: new Date(),
                  });
                }}
                className="w-full md:w-auto"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}

        {error ? (
          <div className="bg-red-50 p-4 rounded-md mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={attendanceData}
            isLoading={isLoading}
            className="w-full"
            emptyMessage="No attendance records found for the selected criteria."
          />
        )}
      </Card>
    </div>
  );
};

export default AttendanceTracker;