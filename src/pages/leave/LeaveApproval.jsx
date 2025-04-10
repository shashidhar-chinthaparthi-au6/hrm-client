import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Components
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

// Services
import { 
  getPendingLeaveRequests, 
  approveLeaveRequest, 
  rejectLeaveRequest,
  getAllLeaveRequests 
} from '../../services/leaveService';

const LeaveApproval = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');  // 'approve' or 'reject'
  const [comment, setComment] = useState('');
  const [filter, setFilter] = useState('pending');  // 'all', 'pending', 'approved', 'rejected'
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    fetchLeaveRequests();
  }, [filter]);
  
  const fetchLeaveRequests = async () => {
    setIsLoading(true);
    try {
      let requests;
      if (filter === 'pending') {
        requests = await getPendingLeaveRequests();
      } else {
        requests = await getAllLeaveRequests(filter);
      }
      setLeaveRequests(requests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to load leave requests');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };
  
  const handleAction = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setShowActionModal(true);
  };
  
  const processAction = async () => {
    if (!selectedRequest) return;
    
    setIsSubmitting(true);
    try {
      if (actionType === 'approve') {
        await approveLeaveRequest(selectedRequest.id, { comment });
        toast.success('Leave request approved successfully');
      } else if (actionType === 'reject') {
        await rejectLeaveRequest(selectedRequest.id, { comment });
        toast.success('Leave request rejected');
      }
      
      setShowActionModal(false);
      setComment('');
      fetchLeaveRequests();
    } catch (error) {
      toast.error(`Failed to ${actionType} leave request`);
      console.error(`Error during ${actionType} action:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge color="green">Approved</Badge>;
      case 'rejected':
        return <Badge color="red">Rejected</Badge>;
      case 'pending':
        return <Badge color="yellow">Pending</Badge>;
      case 'cancelled':
        return <Badge color="gray">Cancelled</Badge>;
      default:
        return <Badge color="gray">{status}</Badge>;
    }
  };
  
  const getLeaveTypeBadge = (type) => {
    switch (type.toLowerCase()) {
      case 'annual':
      case 'vacation':
        return <Badge color="blue">{type}</Badge>;
      case 'sick':
      case 'medical':
        return <Badge color="red">{type}</Badge>;
      case 'personal':
        return <Badge color="purple">{type}</Badge>;
      case 'maternity':
      case 'paternity':
        return <Badge color="pink">{type}</Badge>;
      default:
        return <Badge color="gray">{type}</Badge>;
    }
  };
  
  const columns = [
    {
      header: 'Employee',
      accessor: 'employee',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 overflow-hidden">
            {row.employee.profileImage && (
              <img 
                src={row.employee.profileImage} 
                alt={row.employee.name} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <div className="font-medium">{row.employee.name}</div>
            <div className="text-xs text-gray-500">{row.employee.department}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Leave Type',
      accessor: 'leaveType',
      cell: ({ value }) => getLeaveTypeBadge(value),
    },
    {
      header: 'Duration',
      accessor: 'duration',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.numberOfDays} day(s)</div>
          <div className="text-xs text-gray-500">
            {new Date(row.startDate).toLocaleDateString()} - {new Date(row.endDate).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: ({ value }) => getStatusBadge(value),
    },
    {
      header: 'Applied On',
      accessor: 'createdAt',
      cell: ({ value }) => new Date(value).toLocaleDateString(),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleViewDetails(row)}
          >
            Details
          </Button>
          
          {row.status.toLowerCase() === 'pending' && (
            <>
              <Button 
                size="sm" 
                variant="success"
                onClick={() => handleAction(row, 'approve')}
              >
                Approve
              </Button>
              
              <Button 
                size="sm" 
                variant="danger"
                onClick={() => handleAction(row, 'reject')}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leave Approvals</h1>
        
        <div className="flex items-center">
          <Select
            name="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: 'pending', label: 'Pending Requests' },
              { value: 'approved', label: 'Approved Requests' },
              { value: 'rejected', label: 'Rejected Requests' },
              { value: 'all', label: 'All Requests' },
            ]}
            className="w-48"
          />
        </div>
      </div>
      
      <Card>
        <Table
          columns={columns}
          data={leaveRequests}
          isLoading={isLoading}
          emptyMessage="No leave requests found"
          pagination
        />
      </Card>
      
      {/* Leave Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Leave Request Details"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                {selectedRequest.employee?.profileImage && (
                  <img 
                    src={selectedRequest.employee.profileImage} 
                    alt={selectedRequest.employee.name} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg">{selectedRequest.employee?.name}</h3>
                <p className="text-sm text-gray-600">{selectedRequest.employee?.department} • {selectedRequest.employee?.position}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Leave Type</p>
                <p className="font-medium">{getLeaveTypeBadge(selectedRequest.leaveType)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p>{getStatusBadge(selectedRequest.status)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">{new Date(selectedRequest.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium">{new Date(selectedRequest.endDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{selectedRequest.numberOfDays} day(s)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Applied On</p>
                <p className="font-medium">{new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Reason</p>
              <p className="p-3 bg-gray-50 rounded-md mt-1">{selectedRequest.reason}</p>
            </div>
            
            {selectedRequest.contactInfo && (
              <div>
                <p className="text-sm text-gray-500">Emergency Contact</p>
                <p className="font-medium">{selectedRequest.contactInfo}</p>
              </div>
            )}
            
            {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
              <div>
                <p className="text-sm text-gray-500">Attachments</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedRequest.attachments.map((attachment, index) => (
                    <a 
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center text-sm bg-blue-50 px-2 py-1 rounded"
                    >
                      <span className="material-icons text-sm mr-1">attachment</span>
                      {attachment.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {selectedRequest.actionByUser && (
              <div>
                <p className="text-sm text-gray-500">
                  {selectedRequest.status === 'approved' ? 'Approved' : 'Rejected'} by
                </p>
                <p className="font-medium">{selectedRequest.actionByUser.name}</p>
                {selectedRequest.comment && (
                  <div className="mt-1">
                    <p className="text-sm text-gray-500">Comment</p>
                    <p className="p-3 bg-gray-50 rounded-md mt-1">{selectedRequest.comment}</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
              
              {selectedRequest.status.toLowerCase() === 'pending' && (
                <>
                  <Button 
                    variant="success"
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleAction(selectedRequest, 'approve');
                    }}
                  >
                    Approve
                  </Button>
                  
                  <Button 
                    variant="danger"
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleAction(selectedRequest, 'reject');
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
      
      {/* Action Modal (Approve/Reject) */}
      <Modal
        isOpen={showActionModal}
        onClose={() => {
          setShowActionModal(false);
          setComment('');
        }}
        title={`${actionType === 'approve' ? 'Approve' : 'Reject'} Leave Request`}
      >
        <div className="space-y-4">
          {selectedRequest && (
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{selectedRequest.employee?.name}</p>
                  <p className="text-sm text-gray-600">{getLeaveTypeBadge(selectedRequest.leaveType)} - {selectedRequest.numberOfDays} day(s)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{new Date(selectedRequest.startDate).toLocaleDateString()} to {new Date(selectedRequest.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          
          <Input
            label="Comments (Optional)"
            name="comment"
            as="textarea"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Add a comment about why you're ${actionType === 'approve' ? 'approving' : 'rejecting'} this request...`}
          />
          
          <div className="flex justify-end space-x-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowActionModal(false);
                setComment('');
              }}
            >
              Cancel
            </Button>
            
            <Button
              variant={actionType === 'approve' ? 'success' : 'danger'}
              onClick={processAction}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'} Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LeaveApproval;