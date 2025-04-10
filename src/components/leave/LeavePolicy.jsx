import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Table from '../common/Table';

const LeavePolicy = ({ isAdmin = false }) => {
  const [policies, setPolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // view, edit, add
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    daysAllowed: '',
    accrualRate: 'monthly',
    carryForward: false,
    maxCarryForward: '',
    proRated: true,
    applicableAfter: 0, // In days
    requiresApproval: true,
    documents: false,
    isActive: true,
    department: 'all', // all, or specific department
    grade: 'all', // all, or specific grade
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/leave-policies');
      const data = await response.json();
      setPolicies(data);
    } catch (error) {
      console.error('Error fetching leave policies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleViewPolicy = (policy) => {
    setSelectedPolicy(policy);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditPolicy = (policy) => {
    setSelectedPolicy(policy);
    setFormData({
      name: policy.name,
      description: policy.description,
      daysAllowed: policy.daysAllowed,
      accrualRate: policy.accrualRate,
      carryForward: policy.carryForward,
      maxCarryForward: policy.maxCarryForward || '',
      proRated: policy.proRated,
      applicableAfter: policy.applicableAfter,
      requiresApproval: policy.requiresApproval,
      documents: policy.documents,
      isActive: policy.isActive,
      department: policy.department || 'all',
      grade: policy.grade || 'all',
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleAddPolicy = () => {
    setSelectedPolicy(null);
    setFormData({
      name: '',
      description: '',
      daysAllowed: '',
      accrualRate: 'monthly',
      carryForward: false,
      maxCarryForward: '',
      proRated: true,
      applicableAfter: 0,
      requiresApproval: true,
      documents: false,
      isActive: true,
      department: 'all',
      grade: 'all',
    });
    setModalMode('add');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const endpoint = modalMode === 'add' 
        ? '/api/leave-policies' 
        : `/api/leave-policies/${selectedPolicy.id}`;
      
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${modalMode === 'add' ? 'create' : 'update'} policy`);
      }
      
      // Refresh policies
      await fetchPolicies();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving policy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      header: 'Leave Type',
      accessor: 'name',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500 mt-1">
            {row.isActive ? (
              <Badge color="green" text="Active" />
            ) : (
              <Badge color="gray" text="Inactive" />
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Entitlement',
      accessor: 'daysAllowed',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value} days</div>
          <div className="text-xs text-gray-500">
            {row.accrualRate === 'annually' ? 'Annually' : 
             row.accrualRate === 'monthly' ? 'Monthly accrual' : 
             row.accrualRate === 'quarterly' ? 'Quarterly accrual' : 'One-time'}
          </div>
        </div>
      )
    },
    {
      header: 'Carry Forward',
      accessor: 'carryForward',
      render: (value, row) => (
        <div>
          {value ? (
            <div>
              <Badge color="blue" text="Allowed" />
              {row.maxCarryForward && (
                <div className="text-xs text-gray-500 mt-1">
                  Max: {row.maxCarryForward} days
                </div>
              )}
            </div>
          ) : (
            <Badge color="gray" text="Not Allowed" />
          )}
        </div>
      )
    },
    {
      header: 'Applicable After',
      accessor: 'applicableAfter',
      render: (value) => (
        <div>
          {value === 0 ? (
            <span>Immediate</span>
          ) : (
            <span>
              {value} {value === 1 ? 'day' : 'days'}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Other Details',
      accessor: 'requiresApproval',
      render: (value, row) => (
        <div className="space-y-1">
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">Approval:</span>
            {value ? (
              <Badge color="yellow" text="Required" size="sm" />
            ) : (
              <Badge color="green" text="Auto-approved" size="sm" />
            )}
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">Documents:</span>
            {row.documents ? (
              <Badge color="blue" text="Required" size="sm" />
            ) : (
              <Badge color="gray" text="Not Required" size="sm" />
            )}
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">Pro-rated:</span>
            {row.proRated ? (
              <Badge color="green" text="Yes" size="sm" />
            ) : (
              <Badge color="gray" text="No" size="sm" />
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (value, row) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleViewPolicy(row)}
          >
            View
          </Button>
          {isAdmin && (
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => handleEditPolicy(row)}
            >
              Edit
            </Button>
          )}
        </div>
      )
    }
  ];

  const renderFormFields = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Leave Type Name"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g., Annual Leave, Sick Leave"
          required
          disabled={modalMode === 'view'}
        />
        
        <Input
          label="Days Allowed"
          id="daysAllowed"
          name="daysAllowed"
          type="number"
          value={formData.daysAllowed}
          onChange={handleInputChange}
          placeholder="e.g., 20"
          required
          disabled={modalMode === 'view'}
        />
      </div>
      
      <Input
        label="Description"
        id="description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Brief description of the leave policy"
        multiline
        rows={3}
        disabled={modalMode === 'view'}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Accrual Rate
          </label>
          <select
            id="accrualRate"
            name="accrualRate"
            value={formData.accrualRate}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            disabled={modalMode === 'view'}
          >
            <option value="annually">Annually</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="one-time">One-time</option>
          </select>
        </div>
        
        <Input
          label="Applicable After (days)"
          id="applicableAfter"
          name="applicableAfter"
          type="number"
          value={formData.applicableAfter}
          onChange={handleInputChange}
          placeholder="e.g., 90 for probation period"
          disabled={modalMode === 'view'}
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="carryForward"
          name="carryForward"
          checked={formData.carryForward}
          onChange={handleInputChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={modalMode === 'view'}
        />
        <label htmlFor="carryForward" className="ml-2 block text-sm text-gray-700">
          Allow Carry Forward to Next Year
        </label>
      </div>
      
      {formData.carryForward && (
        <Input
          label="Maximum Carry Forward Days"
          id="maxCarryForward"
          name="maxCarryForward"
          type="number"
          value={formData.maxCarryForward}
          onChange={handleInputChange}
          placeholder="e.g., 5"
          disabled={modalMode === 'view'}
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="proRated"
              name="proRated"
              checked={formData.proRated}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={modalMode === 'view'}
            />
            <label htmlFor="proRated" className="ml-2 block text-sm text-gray-700">
              Pro-rated for New Employees
            </label>
          </div>
          
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="requiresApproval"
              name="requiresApproval"
              checked={formData.requiresApproval}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={modalMode === 'view'}
            />
            <label htmlFor="requiresApproval" className="ml-2 block text-sm text-gray-700">
              Requires Manager Approval
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="documents"
              name="documents"
              checked={formData.documents}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={modalMode === 'view'}
            />
            <label htmlFor="documents" className="ml-2 block text-sm text-gray-700">
              Requires Supporting Documents
            </label>
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={modalMode === 'view'}
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Active Policy
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Applicable Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              disabled={modalMode === 'view'}
            >
              <option value="all">All Departments</option>
              <option value="it">IT Department</option>
              <option value="hr">HR Department</option>
              <option value="finance">Finance Department</option>
              <option value="marketing">Marketing Department</option>
              <option value="operations">Operations Department</option>
            </select>
          </div>
        </div>
      </div>
      
      {modalMode !== 'view' && (
        <div className="flex justify-end mt-6 space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            {modalMode === 'add' ? 'Create Policy' : 'Update Policy'}
          </Button>
        </div>
      )}
      
      {modalMode === 'view' && (
        <div className="flex justify-end mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </div>
      )}
    </form>
  );

  return (
    <>
      <Card title="Leave Policies">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            List of all leave policies applicable to employees
          </p>
          
          {isAdmin && (
            <Button 
              variant="primary"
              onClick={handleAddPolicy}
            >
              Add New Policy
            </Button>
          )}
        </div>
        
        <Table
          columns={columns}
          data={policies}
          isLoading={isLoading}
          emptyMessage="No leave policies found"
        />
      </Card>
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalMode === 'view' 
            ? 'Leave Policy Details' 
            : modalMode === 'edit' 
              ? 'Edit Leave Policy' 
              : 'Add New Leave Policy'
        }
      >
        {renderFormFields()}
      </Modal>
    </>
  );
};

export default LeavePolicy;