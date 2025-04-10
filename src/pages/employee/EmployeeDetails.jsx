import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import EmployeeProfile from '../../components/employee/EmployeeProfile';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
// import { useAuth } from '../../contexts/AuthContext';
// import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../utils/dateUtils';

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const { showToast } = useToast();
  
  const canEditEmployee = hasPermission('employee:update');
  const canDeleteEmployee = hasPermission('employee:delete');
  
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/employees/${employeeId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch employee details');
        }
        
        setEmployee(data);
      } catch (error) {
        console.error('Error fetching employee details:', error);
        showToast(error.message || 'An error occurred while loading employee details', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployeeDetails();
  }, [employeeId, showToast]);
  
  const handleEditEmployee = () => {
    navigate(`/employee/edit/${employeeId}`);
  };
  
  const handleActivateEmployee = async () => {
    try {
      const response = await fetch(`/api/employees/${employeeId}/activate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to activate employee');
      }
      
      setEmployee(prev => ({ ...prev, status: 'active' }));
      showToast('Employee activated successfully', 'success');
    } catch (error) {
      console.error('Error activating employee:', error);
      showToast(error.message || 'An error occurred while activating employee', 'error');
    }
  };
  
  const handleDeactivateEmployee = async () => {
    setShowConfirmModal(false);
    
    try {
      const response = await fetch(`/api/employees/${employeeId}/deactivate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to deactivate employee');
      }
      
      setEmployee(prev => ({ ...prev, status: 'inactive' }));
      showToast('Employee deactivated successfully', 'success');
    } catch (error) {
      console.error('Error deactivating employee:', error);
      showToast(error.message || 'An error occurred while deactivating employee', 'error');
    }
  };
  
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
      case 'on_leave':
        return 'warning';
      case 'suspended':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading employee details...</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!employee) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg text-gray-600 mb-4">Employee not found</p>
          <Button variant="primary" onClick={() => navigate('/employee')}>
            Back to Directory
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Employees', path: '/employee' },
    { label: `${employee.firstName} ${employee.lastName}`, path: null },
  ];
  
  return (
    <MainLayout>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employee Details</h1>
        <div className="flex space-x-3">
          {canEditEmployee && (
            <Button variant="primary" onClick={handleEditEmployee}>
              Edit Employee
            </Button>
          )}
          {canDeleteEmployee && employee.status === 'active' && (
            <Button variant="danger" onClick={() => setShowConfirmModal(true)}>
              Deactivate
            </Button>
          )}
          {canDeleteEmployee && employee.status === 'inactive' && (
            <Button variant="success" onClick={handleActivateEmployee}>
              Activate
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <div className="p-6 flex flex-col items-center">
              <Avatar 
                src={employee.profileImage}
                alt={`${employee.firstName} ${employee.lastName}`}
                size="xl"
              />
              <h2 className="mt-4 text-xl font-semibold">{employee.firstName} {employee.lastName}</h2>
              <p className="text-gray-600">{employee.designation}</p>
              <Badge 
                color={getStatusBadgeColor(employee.status)}
                className="mt-2"
              >
                {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
              </Badge>
              <div className="w-full mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Employee ID</span>
                  <span className="font-medium">{employee.employeeId}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Department</span>
                  <span className="font-medium">{employee.departmentName}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{employee.location || 'N/A'}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Joined Date</span>
                  <span className="font-medium">{formatDate(employee.joiningDate)}</span>
                </div>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{employee.phoneNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Emergency Contact</p>
                  <p className="font-medium">{employee.emergencyContact || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{employee.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  className={`px-4 py-4 text-sm font-medium ${
                    activeTab === 'profile' 
                      ? 'border-b-2 border-blue-500 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile
                </button>
                <button
                  className={`px-4 py-4 text-sm font-medium ${
                    activeTab === 'documents' 
                      ? 'border-b-2 border-blue-500 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('documents')}
                >
                  Documents
                </button>
                <button
                  className={`px-4 py-4 text-sm font-medium ${
                    activeTab === 'employment' 
                      ? 'border-b-2 border-blue-500 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('employment')}
                >
                  Employment
                </button>
                <button
                  className={`px-4 py-4 text-sm font-medium ${
                    activeTab === 'performance' 
                      ? 'border-b-2 border-blue-500 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('performance')}
                >
                  Performance
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'profile' && (
                <EmployeeProfile employee={employee} />
              )}
              
              {activeTab === 'documents' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Documents</h3>
                  <p className="text-gray-600">Employment documents and important files.</p>
                  {/* Documents component will go here */}
                </div>
              )}
              
              {activeTab === 'employment' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Employment History</h3>
                  <p className="text-gray-600">Past roles, promotions, and job changes.</p>
                  {/* Employment history component will go here */}
                </div>
              )}
              
              {activeTab === 'performance' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Performance Reviews</h3>
                  <p className="text-gray-600">Past reviews, goals, and achievements.</p>
                  {/* Performance reviews component will go here */}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Deactivate Employee"
      >
        <div className="p-6">
          <p className="mb-4">
            Are you sure you want to deactivate {employee.firstName} {employee.lastName}?
            This will prevent the employee from accessing the system.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeactivateEmployee}>
              Deactivate
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default EmployeeDetails;