import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Table from '../common/Table';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import { format } from 'date-fns';

const LeaveApproval = ({ managerId, teamId, departmentId }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comment, setComment] = useState('');
  const [action, setAction] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [filterDateRange, setFilterDateRange] = useState('current');
  const [filterTeam, setFilterTeam] = useState(teamId || 'all');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch teams if needed
        if (!teamId && teams.length === 0) {
          const teamsResponse = await fetch('/api/teams');
          const teamsData = await teamsResponse.json();
          setTeams([
            { value: 'all', label: 'All Teams' },
            ...teamsData.map(team => ({ value: team.id, label: team.name }))
          ]);
        }

        // Fetch employees under manager
        const employeesResponse = await fetch(`/api/managers/${managerId}/employees`);
        const employeesData = await employeesResponse.json();
        setEmployees([
          { value: '', label: 'All Employees' },
          ...employeesData.map(emp => ({ value: emp.id, label: emp.name }))
        ]);

        // Prepare query parameters
        const queryParams = new URLSearchParams();
        if (managerId) queryParams.append('managerId', managerId);
        if (teamId || filterTeam !== 'all') queryParams.append('teamId', teamId || filterTeam);
        if (departmentId) queryParams.append('departmentId', departmentId);
        if (filterStatus !== 'all') queryParams.append('status', filterStatus);
        if (filterEmployee) queryParams.append('employeeId', filterEmployee);
        
        // Add date range filter
        switch (filterDateRange) {
          case 'current':
            queryParams.append('timeframe', 'current');
            break;
          case 'upcoming':
            queryParams.append('timeframe', 'upcoming');
            break;
          case 'past':
            queryParams.append('timeframe', 'past');
            break;
          default:
            break;
        }

        // Fetch leave requests
        const response = await fetch(`/api/leave-requests?${queryParams.toString()}`);
        const data = await response.json();
        
        setLeaveRequests(data);
        setFilteredRequests(data);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [managerId, teamId, departmentId, filterStatus, filterDateRange, filterTeam, filterEmployee]);

  const handleAction = async (requestId, actionType, comments = '') => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/leave-requests/${requestId}/${actionType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          managerId,
          comments
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${actionType} leave request`);
      }

      const updatedRequest = await response.json();
      
      // Update the leave requests list
      setLeaveRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? updatedRequest : req
        )
      );
      
      setFilteredRequests(prevFiltered => 
        prevFiltered.map(req => 
          req.id === requestId ? updatedRequest : req
        )
      );

      setShowModal(false);
      setSelectedRequest(null);
      setComment('');
      setAction('');
      
    } catch (error) {
      console.error('Error processing leave request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openActionModal = (request, actionType) => {
    setSelectedRequest(request);
    setAction(actionType);
    setShowModal(true);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'pending':
        return 'yellow';
      case 'cancelled':
        return 'gray';
      default:
        return 'blue';
    }
  };

  const getLeaveTypeBadgeColor = (leaveType) => {
    switch (leaveType) {
      case 'Sick Leave':
        return 'red';
      case 'Annual Leave':
        return 'blue';
      case 'Casual Leave':
        return 'green';
      case 'Maternity Leave':
        return 'pink';
      case 'Paternity Leave':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const columns = [
    {
      header: 'Employee',
      accessor: 'employeeName',
      render: (value, row) => (
        <div className="flex items-center">
          <img 
            src={row.employeeAvatar || '/api/placeholder/32/32'} 
            alt={value} 
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{row.department}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Leave Type',
      accessor: 'leaveType',
      render: (value) => (
        <Badge color={getLeaveTypeBadgeColor(value)} text={value} />
      )
    },
    {
      header: 'Duration',
      accessor: 'duration',
      render: (value, row) => (
        <div>
          <div className="font-medium">
            {row.isHalfDay ? 'Half Day' : `${value} days`}
          </div>
          <div className="text-xs text-gray-500">
            {format(new Date(row.startDate), 'MMM d, yyyy')}
            {!row.isHalfDay && ` to ${format(new Date(row.endDate), 'MMM d, yyyy')}`}
            {row.isHalfDay && ` (${row.halfDayType === 'first-half' ? 'Morning' : 'Afternoon'})`}
          </div>
        </div>
      )
    },
    {
      header: 'Applied On',
      accessor: 'appliedOn',
      render: (value) => format(new Date(value), 'MMM d, yyyy')
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <Badge color={getStatusBadgeColor(value)} text={value} />
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (value, row) => {
        if (row.status === 'pending') {
          return (
            <div className="flex space-x-2">
              <Button 
                variant="success" 
                size="sm" 
                onClick={() => openActionModal(row, 'approve')}
              >
                Approve
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => openActionModal(row, 'reject')}
              >
                Reject
              </Button>
            </div>
          );
        }
        return <span className="text-sm text-gray-500">No actions available</span>;
      }
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Requests' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'current', label: 'Current Month' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' }
  ];

  const renderActionModalContent = () => {
    if (!selectedRequest) return null;
    
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium text-gray-900">Leave Request Details</h3>
          <div className="mt-2 text-sm text-gray-600 grid grid-cols-2 gap-2">
            <div><span className="font-medium">Employee:</span> {selectedRequest.employeeName}</div>
            <div><span className="font-medium">Leave Type:</span> {selectedRequest.leaveType}</div>
            <div><span className="font-medium">From:</span> {format(new Date(selectedRequest.startDate), 'MMM d, yyyy')}</div>
            <div><span className="font-medium">To:</span> {selectedRequest.isHalfDay ? 'Half Day' : format(new Date(selectedRequest.endDate), 'MMM d, yyyy')}</div>
            <div className="col-span-2"><span className="font-medium">Reason:</span> {selectedRequest.reason}</div>
          </div>
        </div>
        
        <Input
          label="Comments"
          id="comment"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={`Add your ${action === 'approve' ? 'approval' : 'rejection'} comments here...`}
          multiline
          rows={3}
        />
        
        <div className="flex justify-end space-x-3 mt-4">
          <Button 
            variant="outline" 
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant={action === 'approve' ? 'success' : 'danger'} 
            onClick={() => handleAction(selectedRequest.id, action, comment)}
            isLoading={isLoading}
          >
            {action === 'approve' ? 'Approve' : 'Reject'} Leave
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card title="Leave Approval">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Status"
            id="filterStatus"
            name="filterStatus"
            options={filterOptions}
            value={filterStatus}
            onChange={(selected) => setFilterStatus(selected.value)}
          />
          
          <Select
            label="Time Period"
            id="filterDateRange"
            name="filterDateRange"
            options={dateRangeOptions}
            value={filterDateRange}
            onChange={(selected) => setFilterDateRange(selected.value)}
          />
          
          {!teamId && (
            <Select
              label="Team"
              id="filterTeam"
              name="filterTeam"
              options={teams}
              value={filterTeam}
              onChange={(selected) => setFilterTeam(selected.value)}
            />
          )}
          
          <Select
            label="Employee"
            id="filterEmployee"
            name="filterEmployee"
            options={employees}
            value={filterEmployee}
            onChange={(selected) => setFilterEmployee(selected.value)}
          />
        </div>
        
        <Table
          columns={columns}
          data={filteredRequests}
          isLoading={isLoading}
          emptyMessage="No leave requests found matching your criteria"
        />
      </Card>
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${action === 'approve' ? 'Approve' : 'Reject'} Leave Request`}
      >
        {renderActionModalContent()}
      </Modal>
    </>
  );
};

export default LeaveApproval;