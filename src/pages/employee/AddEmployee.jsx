import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import EmployeeForm from '../../components/employee/EmployeeForm';
import Card from '../../components/common/Card';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import { useAuth } from '../../contexts/AuthContext';
import useToast from '../../hooks/useToast';
import { employeeService } from '../../services/employeeService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
// import './EmployeeForm.css';

const AddEmployee = () => {
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  
  const navigate = useNavigate();
  const { hasPermission, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  
  // Verify permissions and authentication
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      
      // Check permissions but don't block rendering
      if (hasPermission && !hasPermission('employee:create')) {
        showToast('You do not have permission to add employees', 'error');
        // Don't navigate away, just show a toast
      }
      
      // Set initialized to true regardless of permissions
      setInitialized(true);
    }
  }, [authLoading, isAuthenticated, hasPermission, navigate, showToast]);
  
  // Fetch departments, designations and managers
  useEffect(() => {
    if (!initialized) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [deptRes, desigRes, managerRes] = await Promise.all([
          employeeService.getDepartments(),
          employeeService.getDesignations(),
          employeeService.getManagers()
        ]);
        
        setDepartments(deptRes.data || []);
        setDesignations(desigRes.data || []);
        setManagers(managerRes.data || []);
      } catch (error) {
        console.error('Error in fetchData:', error);
        setError('Failed to load form data. Please try again.');
        showToast(error.message || 'Failed to load form data', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [initialized, showToast]);
  
  // Default employee data
  const defaultEmployeeData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employeeId: '',
    dateOfBirth: null,
    gender: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    department: '',
    designation: '',
    jobTitle: '',
    managerId: '',
    dateOfJoining: new Date(),
    employmentType: 'full-time',
    salary: '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: ''
    },
    role: '',
    avatar: null,
    status: 'active'
  };
  
  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);

      // Create a new FormData object
      const employeeFormData = new FormData();

      // Handle file upload
      if (formData.avatar) {
        employeeFormData.append('avatar', formData.avatar);
      }

      // Format dates to ISO strings
      if (formData.dateOfBirth) {
        employeeFormData.append('dateOfBirth', formData.dateOfBirth.toISOString());
      }
      if (formData.dateOfJoining) {
        employeeFormData.append('dateOfJoining', formData.dateOfJoining.toISOString());
      }

      // Handle bank details
      if (formData.bankDetails) {
        employeeFormData.append('bankDetails', JSON.stringify(formData.bankDetails));
      }

      // Append all other fields
      Object.keys(formData).forEach(key => {
        if (key !== 'avatar' && key !== 'dateOfBirth' && key !== 'dateOfJoining' && key !== 'bankDetails') {
          if (formData[key] !== null && formData[key] !== undefined) {
            employeeFormData.append(key, formData[key]);
          }
        }
      });

      const response = await employeeService.create(employeeFormData);
      showToast('Employee created successfully', 'success');
      navigate('/employees');
    } catch (err) {
      console.error('Error creating employee:', err);
      setError(err.message || 'Failed to create employee');
      showToast(err.message || 'Failed to create employee', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/employees');
  };
  
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Employees', path: '/employees' },
    { label: 'Add Employee', path: null },
  ];
  
  if (authLoading || !initialized) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Employee</h1>
      </div>
      
      <Card>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-red-600">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : (
          <EmployeeForm 
            employee={defaultEmployeeData}
            departments={departments}
            designations={designations}
            managers={managers}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={submitting}
            isNewEmployee={true}
          />
        )}
      </Card>
    </MainLayout>
  );
};

export default AddEmployee;