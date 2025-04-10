import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Box, Grid, Typography, Divider, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import DatePicker from '../../components/common/DatePicker';
import Card from '../../components/common/Card';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
  
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [managers, setManagers] = useState([]);
  
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch employee data
        const response = await axios.get(`/api/employees/${id}`);
        const employeeData = response.data;
        
        // Populate form with employee data
        Object.keys(employeeData).forEach(key => {
          if (key === 'dateOfBirth' || key === 'joiningDate') {
            setValue(key, new Date(employeeData[key]));
          } else {
            setValue(key, employeeData[key]);
          }
        });
        
        // Fetch related data for dropdowns
        const [deptRes, desigRes, managerRes] = await Promise.all([
          axios.get('/api/departments'),
          axios.get('/api/designations'),
          axios.get('/api/employees/managers')
        ]);
        
        setDepartments(deptRes.data);
        setDesignations(desigRes.data);
        setManagers(managerRes.data);
        
        setIsLoading(false);
      } catch (error) {
        toast.error('Failed to load employee data');
        setIsLoading(false);
        console.error('Error fetching employee data:', error);
      }
    };
    
    fetchEmployeeData();
  }, [id, setValue]);
  
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await axios.put(`/api/employees/${id}`, data);
      toast.success('Employee updated successfully');
      navigate('/employee/employee-directory');
    } catch (error) {
      toast.error('Failed to update employee');
      setIsLoading(false);
      console.error('Error updating employee:', error);
    }
  };
  
  const handleCancel = () => {
    navigate('/employee/employee-directory');
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading employee data...</div>;
  }
  
  return (
    <div className="px-6 py-8">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Employee Directory', path: '/employee/employee-directory' },
          { label: 'Edit Employee', path: '' }
        ]}
      />
      
      <h1 className="text-2xl font-bold mb-6">Edit Employee</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                error={errors.firstName?.message}
                {...register('firstName', { required: 'First name is required' })}
              />
              
              <Input
                label="Last Name"
                error={errors.lastName?.message}
                {...register('lastName', { required: 'Last name is required' })}
              />
              
              <DatePicker
                label="Date of Birth"
                error={errors.dateOfBirth?.message}
                {...register('dateOfBirth', { required: 'Date of birth is required' })}
              />
              
              <Select
                label="Gender"
                error={errors.gender?.message}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' }
                ]}
                {...register('gender', { required: 'Gender is required' })}
              />
              
              <Input
                label="Email"
                type="email"
                error={errors.email?.message}
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              
              <Input
                label="Phone Number"
                error={errors.phoneNumber?.message}
                {...register('phoneNumber', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9+\-\s()]*$/,
                    message: 'Invalid phone number'
                  }
                })}
              />
              
              <Input
                label="Address"
                className="md:col-span-2"
                error={errors.address?.message}
                {...register('address', { required: 'Address is required' })}
              />
            </div>
          </Card>
          
          <Card title="Employment Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Employee ID"
                error={errors.employeeId?.message}
                {...register('employeeId', { required: 'Employee ID is required' })}
              />
              
              <DatePicker
                label="Joining Date"
                error={errors.joiningDate?.message}
                {...register('joiningDate', { required: 'Joining date is required' })}
              />
              
              <Select
                label="Department"
                error={errors.departmentId?.message}
                options={departments.map(dept => ({ value: dept.id, label: dept.name }))}
                {...register('departmentId', { required: 'Department is required' })}
              />
              
              <Select
                label="Designation"
                error={errors.designationId?.message}
                options={designations.map(desig => ({ value: desig.id, label: desig.title }))}
                {...register('designationId', { required: 'Designation is required' })}
              />
              
              <Select
                label="Reporting Manager"
                error={errors.managerId?.message}
                options={managers.map(manager => ({ 
                  value: manager.id, 
                  label: `${manager.firstName} ${manager.lastName}` 
                }))}
                {...register('managerId')}
              />
              
              <Select
                label="Employment Type"
                error={errors.employmentType?.message}
                options={[
                  { value: 'full-time', label: 'Full Time' },
                  { value: 'part-time', label: 'Part Time' },
                  { value: 'contract', label: 'Contract' },
                  { value: 'intern', label: 'Intern' }
                ]}
                {...register('employmentType', { required: 'Employment type is required' })}
              />
              
              <Input
                label="Work Email"
                type="email"
                error={errors.workEmail?.message}
                {...register('workEmail', { 
                  required: 'Work email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              
              <Input
                label="Work Phone"
                error={errors.workPhone?.message}
                {...register('workPhone')}
              />
            </div>
          </Card>
        </div>
        
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Update Employee
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee;