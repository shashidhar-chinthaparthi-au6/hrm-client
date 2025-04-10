import React, { useState, useEffect } from 'react';
import { Card, Button, Table, DatePicker, Select, Input } from '../components/common';
import MainLayout from '../components/layout/MainLayout';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import CheckInOut from '../components/attendance/CheckInOut';

const TimeTracking = () => {
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userStatus, setUserStatus] = useState('not-checked-in'); // 'not-checked-in', 'checked-in', 'checked-out'
  const [clockTime, setClockTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('all');

  // Update clock time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setClockTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Mock data - replace with API call
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        employeeId: `EMP${1000 + index}`,
        name: `Employee ${index + 1}`,
        date: new Date(new Date().setDate(new Date().getDate() - Math.floor(index / 4))),
        checkIn: `0${8 + (index % 2)}:${15 + (index % 30)}`,
        checkOut: index % 5 === 0 ? null : `1${7 - (index % 2)}:${30 + (index % 30)}`,
        duration: index % 5 === 0 ? 'In progress' : `${7 + (index % 3)}h ${index % 60}m`,
        status: index % 5 === 0 ? 'Active' : 'Completed',
        notes: index % 3 === 0 ? 'Working on Project X' : '',
      }));
      
      setTimeLogs(mockData);
      setLoading(false);
      
      // Set mock user status
      const hour = new Date().getHours();
      if (hour < 9) {
        setUserStatus('not-checked-in');
      } else if (hour < 17) {
        setUserStatus('checked-in');
      } else {
        setUserStatus('checked-out');
      }
    }, 600);
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleCheckIn = () => {
    setUserStatus('checked-in');
    // In a real implementation, send this to the server
    const newLog = {
      id: timeLogs.length + 1,
      employeeId: 'EMP1001', // Current user
      name: 'Current User',
      date: new Date(),
      checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      checkOut: null,
      duration: 'In progress',
      status: 'Active',
      notes: '',
    };
    
    setTimeLogs([newLog, ...timeLogs]);
  };

  const handleCheckOut = () => {
    setUserStatus('checked-out');
    // Update the latest time log
    const updatedLogs = [...timeLogs];
    if (updatedLogs.length > 0 && updatedLogs[0].status === 'Active') {
      const checkInTime = new Date();
      checkInTime.setHours(
        parseInt(updatedLogs[0].checkIn.split(':')[0]),
        parseInt(updatedLogs[0].checkIn.split(':')[1])
      );
      
      const checkOutTime = new Date();
      const durationMs = checkOutTime - checkInTime;
      const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
      const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      
      updatedLogs[0] = {
        ...updatedLogs[0],
        checkOut: checkOutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: `${durationHours}h ${durationMinutes}m`,
        status: 'Completed',
      };
      
      setTimeLogs(updatedLogs);
    }
  };

  const handleNoteChange = (id, note) => {
    const updatedLogs = timeLogs.map(log => 
      log.id === id ? { ...log, notes: note } : log
    );
    setTimeLogs(updatedLogs);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'name',
      key: 'name',
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
      render: (checkOut) => checkOut || '—',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`status-badge status-${status.toLowerCase()}`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes, record) => (
        <Input
          type="text"
          placeholder="Add a note..."
          value={notes}
          onChange={(e) => handleNoteChange(record.id, e.target.value)}
          className="note-input"
        />
      ),
    },
  ];

  // Filter the time logs based on search and employee filter
  const filteredLogs = timeLogs.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesEmployee = filterEmployee === 'all' || log.employeeId === filterEmployee;
    
    return matchesSearch && matchesEmployee;
  });

  return (
    <MainLayout>
      <div className="time-tracking-page">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Attendance', link: '/attendance' },
            { label: 'Time Tracking', link: '/attendance/time-tracking' },
          ]}
        />

        <h1 className="page-title">Time Tracking</h1>

        <div className="time-tracking-overview">
          <Card className="clock-card">
            <div className="current-time">
              <h2>{clockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h2>
              <p>{clockTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <CheckInOut 
              status={userStatus}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
            />
          </Card>
        </div>

        <Card className="time-logs-filter">
          <div className="filter-row">
            <div className="filter-item">
              <label>Date</label>
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="filter-item">
              <label>Employee</label>
              <Select
                value={filterEmployee}
                onChange={setFilterEmployee}
                options={[
                  { value: 'all', label: 'All Employees' },
                  { value: 'EMP1001', label: 'Employee 1' },
                  { value: 'EMP1002', label: 'Employee 2' },
                  { value: 'EMP1003', label: 'Employee 3' },
                ]}
              />
            </div>
            <div className="filter-item search">
              <label>Search</label>
              <Input
                type="search"
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </Card>

        <Card className="time-logs-table">
          <h2>Time Logs</h2>
          <Table
            columns={columns}
            dataSource={filteredLogs}
            loading={loading}
            className="time-tracking-table"
          />
        </Card>
      </div>
    </MainLayout>
  );
};

export default TimeTracking;