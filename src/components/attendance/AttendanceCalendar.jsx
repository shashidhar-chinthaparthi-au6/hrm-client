import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Card, Button, Select } from '../common';

const AttendanceCalendar = ({ employeeId, viewMode = "self" }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(employeeId);
  const [employees, setEmployees] = useState([]);

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    const dayOfWeekStart = firstDayOfMonth.getDay(); // 0 = Sunday
    
    let calendar = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < dayOfWeekStart; i++) {
      calendar.push({ day: null, date: null });
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      
      // Find attendance data for this date
      const attendanceForDay = attendanceData.find(att => 
        new Date(att.date).toDateString() === date.toDateString()
      );
      
      calendar.push({
        day,
        date: date.toISOString().split('T')[0],
        status: attendanceForDay?.status || 'absent',
        checkIn: attendanceForDay?.checkInTime,
        checkOut: attendanceForDay?.checkOutTime,
        hours: attendanceForDay?.hours
      });
    }
    
    return calendar;
  };

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const response = await fetch(`/api/attendance/${selectedEmployee}/${year}/${month}`);
        if (!response.ok) throw new Error('Failed to fetch attendance data');
        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [currentDate, selectedEmployee]);

  useEffect(() => {
    // Only fetch employees if in admin/manager view mode
    if (viewMode !== "self") {
      const fetchEmployees = async () => {
        try {
          const response = await fetch('/api/employees');
          if (!response.ok) throw new Error('Failed to fetch employees');
          const data = await response.json();
          setEmployees(data);
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      };
      
      fetchEmployees();
    }
  }, [viewMode]);

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'leave': return 'bg-yellow-100 text-yellow-800';
      case 'holiday': return 'bg-blue-100 text-blue-800';
      case 'weekend': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStyledCell = (day) => {
    if (!day.day) return <td className="border p-1"></td>;
    
    const isToday = day.date === new Date().toISOString().split('T')[0];
    const statusClass = getStatusColor(day.status);
    
    return (
      <td className={`border p-1 ${isToday ? 'ring-2 ring-blue-500' : ''}`} key={day.date}>
        <div className="flex flex-col h-20">
          <div className="flex justify-between">
            <span className={`text-sm font-medium ${isToday ? 'text-blue-700' : ''}`}>{day.day}</span>
            {day.status && (
              <span className={`text-xs px-2 py-1 rounded ${statusClass}`}>
                {day.status.charAt(0).toUpperCase() + day.status.slice(1)}
              </span>
            )}
          </div>
          
          {day.checkIn && (
            <div className="mt-1 text-xs text-gray-600">
              In: {day.checkIn}
            </div>
          )}
          
          {day.checkOut && (
            <div className="mt-1 text-xs text-gray-600">
              Out: {day.checkOut}
            </div>
          )}
          
          {day.hours && (
            <div className="mt-auto text-xs font-medium">
              {day.hours} hrs
            </div>
          )}
        </div>
      </td>
    );
  };

  const calendar = generateCalendarDays();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarRows = [];
  for (let i = 0; i < calendar.length; i += 7) {
    calendarRows.push(calendar.slice(i, i + 7));
  }

  return (
    <Card className="p-4 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CalendarIcon size={20} className="mr-2 text-gray-600" />
          <h2 className="text-xl font-semibold">Attendance Calendar</h2>
        </div>

        {viewMode !== "self" && (
          <Select
            options={employees.map(emp => ({ value: emp.id, label: emp.name }))}
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            placeholder="Select Employee"
            className="w-48"
          />
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={goToPreviousMonth}
            variant="outline"
            size="sm"
            icon={<ChevronLeft size={16} />}
            ariaLabel="Previous month"
          />
          
          <Button
            onClick={goToToday}
            variant="outline"
            size="sm"
            label="Today"
          />
          
          <Button
            onClick={goToNextMonth}
            variant="outline"
            size="sm"
            icon={<ChevronRight size={16} />}
            ariaLabel="Next month"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-6">Loading calendar...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {weekdays.map(day => (
                  <th key={day} className="border p-2 bg-gray-50">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calendarRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((day, index) => getStyledCell(day))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
          <span className="text-xs">Present</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
          <span className="text-xs">Absent</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
          <span className="text-xs">Leave</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
          <span className="text-xs">Holiday</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-500 mr-1"></div>
          <span className="text-xs">Weekend</span>
        </div>
      </div>
    </Card>
  );
};

export default AttendanceCalendar;