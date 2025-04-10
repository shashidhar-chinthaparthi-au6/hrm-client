import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay,
  isWeekend,
  getDay
} from 'date-fns';
import Card from '../common/Card';
import Button from '../common/Button';
import Select from '../common/Select';
import Badge from '../common/Badge';

const LeaveCalendar = ({ teamId, departmentId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, approved, pending, rejected
  const [teamFilter, setTeamFilter] = useState(teamId || 'all');
  const [departmentFilter, setDepartmentFilter] = useState(departmentId || 'all');
  const [teams, setTeams] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchCalendarData = async () => {
      setIsLoading(true);
      try {
        // Fetch holidays
        const holidaysResponse = await fetch(`/api/holidays?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`);
        const holidaysData = await holidaysResponse.json();
        setHolidays(holidaysData.map(h => ({
          date: new Date(h.date),
          name: h.name,
          type: 'holiday'
        })));

        // Build query params for leaves
        let queryParams = new URLSearchParams({
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
          status: filter !== 'all' ? filter : ''
        });
        
        if (teamFilter !== 'all') queryParams.append('teamId', teamFilter);
        if (departmentFilter !== 'all') queryParams.append('departmentId', departmentFilter);
        
        // Fetch leaves
        const leavesResponse = await fetch(`/api/leaves?${queryParams.toString()}`);
        const leavesData = await leavesResponse.json();
        
        setLeaves(leavesData.map(leave => ({
          id: leave.id,
          employeeId: leave.employeeId,
          employeeName: leave.employeeName,
          startDate: new Date(leave.startDate),
          endDate: new Date(leave.endDate),
          type: leave.leaveType,
          status: leave.status,
          isHalfDay: leave.isHalfDay,
          halfDayTime: leave.halfDayTime
        })));
        
        // Fetch teams and departments if not already set
        if (teams.length === 0) {
          const teamsResponse = await fetch('/api/teams');
          const teamsData = await teamsResponse.json();
          setTeams([
            { value: 'all', label: 'All Teams' },
            ...teamsData.map(team => ({ value: team.id, label: team.name }))
          ]);
        }
        
        if (departments.length === 0) {
          const departmentsResponse = await fetch('/api/departments');
          const departmentsData = await departmentsResponse.json();
          setDepartments([
            { value: 'all', label: 'All Departments' },
            ...departmentsData.map(dept => ({ value: dept.id, label: dept.name }))
          ]);
        }
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarData();
  }, [currentDate, filter, teamFilter, departmentFilter]);

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // Get days of current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Determine starting day offset (0 = Sunday, 1 = Monday, etc.)
  const startDay = getDay(monthStart);

  // Status color mapping
  const statusColors = {
    approved: 'green',
    pending: 'yellow',
    rejected: 'red'
  };

  // Leave type color mapping
  const leaveTypeColors = {
    'annual': 'blue',
    'sick': 'red',
    'casual': 'purple',
    'maternity': 'pink',
    'paternity': 'blue',
    'bereavement': 'gray',
    'unpaid': 'orange'
  };

  // Check if a date has a leave
  const getLeavesForDate = (date) => {
    return leaves.filter(leave => {
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      
      // For half-day leaves, only check the specific date
      if (leave.isHalfDay) {
        return isSameDay(date, leaveStart);
      }
      
      // For full day leaves, check if date is within range
      return date >= leaveStart && date <= leaveEnd;
    });
  };

  // Check if a date is a holiday
  const getHolidayForDate = (date) => {
    return holidays.find(holiday => isSameDay(date, holiday.date));
  };

  // Filter options
  const statusFilters = [
    { value: 'all', label: 'All Status' },
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'rejected', label: 'Rejected' }
  ];

  return (
    <Card title="Leave Calendar" isLoading={isLoading}>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            onClick={prevMonth}
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <Button
            variant="outline"
            onClick={nextMonth}
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Select
            label="Status Filter"
            id="statusFilter"
            name="statusFilter"
            options={statusFilters}
            value={filter}
            onChange={(selected) => setFilter(selected.value)}
          />
          
          <Select
            label="Team Filter"
            id="teamFilter"
            name="teamFilter"
            options={teams}
            value={teamFilter}
            onChange={(selected) => setTeamFilter(selected.value)}
          />
          
          <Select
            label="Department Filter"
            id="departmentFilter"
            name="departmentFilter"
            options={departments}
            value={departmentFilter}
            onChange={(selected) => setDepartmentFilter(selected.value)}
          />
        </div>
        
        <div className="overflow-hidden rounded-lg border border-gray-200">
          {/* Calendar header */}
          <div className="grid grid-cols-7 bg-gray-50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="py-2 text-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 bg-white">
            {/* Empty cells for days before the start of the month */}
            {Array.from({ length: startDay }).map((_, index) => (
              <div key={`empty-start-${index}`} className="h-24 border-t border-r border-gray-200 bg-gray-50"></div>
            ))}
            
            {/* Days of the month */}
            {monthDays.map((day) => {
              const dayLeaves = getLeavesForDate(day);
              const holiday = getHolidayForDate(day);
              const isToday = isSameDay(day, new Date());
              const isWeekendDay = isWeekend(day);
              
              return (
                <div
                  key={format(day, 'yyyy-MM-dd')}
                  className={`h-24 border-t border-r border-gray-200 p-1 overflow-y-auto ${
                    isWeekendDay ? 'bg-gray-50' : ''
                  } ${isToday ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    
                    {holiday && (
                      <Badge color="red" size="sm">
                        Holiday
                      </Badge>
                    )}
                  </div>
                  
                  {holiday && (
                    <div className="mt-1 text-xs text-red-600 font-medium truncate">
                      {holiday.name}
                    </div>
                  )}
                  
                  {dayLeaves.map((leave) => (
                    <div
                      key={leave.id}
                      className={`mt-1 px-1 py-0.5 rounded text-xs font-medium truncate bg-${statusColors[leave.status]}-100 text-${statusColors[leave.status]}-800 border-l-2 border-${statusColors[leave.status]}-500`}
                      title={`${leave.employeeName} - ${leave.type} leave (${leave.status})`}
                    >
                      {leave.isHalfDay ? `${leave.halfDayTime === 'first-half' ? 'AM' : 'PM'} - ` : ''}
                      {leave.employeeName.split(' ')[0]}
                    </div>
                  ))}
                </div>
              );
            })}
            
            {/* Empty cells for days after the end of the month */}
            {Array.from({ length: (7 - ((startDay + monthDays.length) % 7)) % 7 }).map((_, index) => (
              <div key={`empty-end-${index}`} className="h-24 border-t border-r border-gray-200 bg-gray-50"></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Legend:</h3>
        <div className="flex flex-wrap gap-2">
          <Badge color="green">Approved</Badge>
          <Badge color="yellow">Pending</Badge>
          <Badge color="red">Rejected</Badge>
          <Badge color="red">Holiday</Badge>
        </div>
      </div>
    </Card>
  );
};

export default LeaveCalendar;