import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import DatePicker from '../common/DatePicker';
import Avatar from '../common/Avatar';
import DepartmentSelect from './DepartmentSelect';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { employeeService } from '../../services/employeeService';
import LoadingSpinner from '../common/LoadingSpinner';
// import './EmployeeForm.css';

const EmployeeForm = ({
  employee = null,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
  managers = [],
  roles = [],
  designations = [],
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    designation: '',
    managerId: '',
    dateOfJoining: new Date(),
    dateOfBirth: null,
    gender: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    employeeId: '',
    employmentType: 'full-time',
    salary: '',
    position: '',
    workLocation: '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: '',
    },
    role: '',
    avatar: null,
    ...employee
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Mock data for managers dropdown
  const mockManagers = [
    { id: '1', firstName: 'John', lastName: 'Smith', position: 'Senior Manager' },
    { id: '2', firstName: 'Sarah', lastName: 'Johnson', position: 'Department Head' },
    { id: '3', firstName: 'Michael', lastName: 'Brown', position: 'Team Lead' },
    { id: '4', firstName: 'Emily', lastName: 'Davis', position: 'Project Manager' },
    { id: '5', firstName: 'David', lastName: 'Wilson', position: 'Director' }
  ];

  // Use mock managers if no managers are provided
  const availableManagers = managers.length > 0 ? managers : mockManagers;

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        dateOfJoining: employee.dateOfJoining ? new Date(employee.dateOfJoining) : new Date(),
        dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth) : null,
      });
      
      if (employee.avatar) {
        setAvatarPreview(employee.avatar);
      }
    }

    // Only load data if we don't already have it
    if (managers.length === 0 || designations.length === 0) {
      const loadFormData = async () => {
        try {
          setIsLoadingData(true);
          const [depts, desigs, mgrs] = await Promise.all([
            employeeService.getDepartments(),
            employeeService.getDesignations(),
            employeeService.getManagers()
          ]);

          setDepartments(depts);
          // Only update these if they weren't passed as props
          if (managers.length === 0) {
            setManagers(mgrs);
          }
          if (designations.length === 0) {
            setDesignations(desigs);
          }
        } catch (error) {
          console.error('Error loading form data:', error);
          toast.error('Failed to load form data. Please try again.');
        } finally {
          setIsLoadingData(false);
        }
      };

      loadFormData();
    }
  }, [employee, managers, designations]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleDepartmentChange = (departmentId) => {
    setFormData((prev) => ({
      ...prev,
      department: departmentId,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'dateOfBirth',
      'dateOfJoining',
      'department',
      'position',
      'employmentType',
      'workLocation'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Bank details validation if provided
    if (formData.bankDetails) {
      const { accountNumber, bankName, ifscCode } = formData.bankDetails;
      if (accountNumber && !/^\d{9,18}$/.test(accountNumber)) {
        errors['bankDetails.accountNumber'] = 'Please enter a valid account number';
      }
      if (ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
        errors['bankDetails.ifscCode'] = 'Please enter a valid IFSC code';
      }
    }

    // Date validations
    if (formData.dateOfBirth && formData.dateOfJoining) {
      const dob = new Date(formData.dateOfBirth);
      const doj = new Date(formData.dateOfJoining);
      const today = new Date();
      
      if (dob > today) {
        errors.dateOfBirth = 'Date of birth cannot be in the future';
      }
      if (doj < dob) {
        errors.dateOfJoining = 'Date of joining cannot be before date of birth';
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateForm()) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    try {
      // Ensure position and workLocation are included in the submission
      const submissionData = {
        ...formData,
        position: formData.position || formData.jobTitle, // Use jobTitle as position if not set
        workLocation: formData.workLocation || 'Office', // Default to 'Office' if not set
      };
      
      await onSubmit(submissionData);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'Failed to add employee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ];

  const employmentTypeOptions = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'intern', label: 'Intern' },
    { value: 'probation', label: 'Probation' },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="employee-form-container">
      <h2 className="form-title">
        {employee ? 'Edit Employee Information' : 'Add New Employee'}
      </h2>
      
      {error && <div className="form-error">{error}</div>}
      
      <div className="form-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Basic Info</div>
        </div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Job Details</div>
        </div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Compensation</div>
        </div>
        <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-label">Additional Info</div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="employee-form">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="form-step">
            <div className="avatar-upload">
              <label htmlFor="avatar-input" className="avatar-label">
                <Avatar 
                  src={avatarPreview} 
                  name={`${formData.firstName} ${formData.lastName}`}
                  size="large"
                  className="employee-avatar"
                />
                <div className="avatar-overlay">
                  <span>Upload Photo</span>
                </div>
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="avatar-input"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  required
                  error={errors.firstName}
                />
              </div>
              <div className="form-group">
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  required
                  error={errors.lastName}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                  error={errors.email}
                />
              </div>
              <div className="form-group">
                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  required
                  error={errors.phone}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <Input
                  label="Employee ID"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  placeholder="Enter employee ID"
                  required
                  error={errors.employeeId}
                />
              </div>
              <div className="form-group">
                <DatePicker
                  selectedDate={formData.dateOfBirth}
                  onChange={(date) => handleDateChange('dateOfBirth', date)}
                  placeholder="Select date of birth"
                  label="Date of Birth"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange({
                    target: { name: 'gender', value: e.target.value }
                  })}
                  options={genderOptions}
                  placeholder="Select gender"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Job Details */}
        {step === 2 && (
          <div className="form-step">
            <div className="form-row">
              <div className="form-group">
                <DepartmentSelect
                  selectedDepartment={formData.department}
                  onChange={handleDepartmentChange}
                  error={errors.department}
                />
              </div>
              <div className="form-group">
                <Select
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={(e) => handleInputChange({
                    target: { name: 'designation', value: e.target.value }
                  })}
                  options={designations.map(d => ({ value: d.id, label: d.name }))}
                  placeholder="Select designation"
                  error={errors.designation}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <Input
                  label="Job Title"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="Enter job title"
                  required
                  error={errors.jobTitle}
                />
              </div>
              <div className="form-group">
                <Select
                  label="Employment Type"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={(e) => handleInputChange({
                    target: { name: 'employmentType', value: e.target.value }
                  })}
                  options={employmentTypeOptions}
                  placeholder="Select employment type"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <DatePicker
                  selectedDate={formData.dateOfJoining}
                  onChange={(date) => handleDateChange('dateOfJoining', date)}
                  placeholder="Select joining date"
                  label="Date of Joining"
                  required
                  error={errors.dateOfJoining}
                />
              </div>
              <div className="form-group">
                <Select
                  label="Reporting Manager"
                  name="managerId"
                  value={formData.managerId}
                  onChange={(e) => handleInputChange({
                    target: { name: 'managerId', value: e.target.value }
                  })}
                  options={availableManagers.map(m => ({ 
                    value: m.id, 
                    label: `${m.firstName} ${m.lastName} (${m.position})` 
                  }))}
                  placeholder="Select reporting manager"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <Select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange({
                    target: { name: 'role', value: e.target.value }
                  })}
                  options={roles.map(r => ({ value: r.id, label: r.name }))}
                  placeholder="Select role"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <Input
                  label="Position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Enter position"
                  required
                  error={errors.position}
                />
              </div>
              <div className="form-group">
                <Input
                  label="Work Location"
                  name="workLocation"
                  value={formData.workLocation}
                  onChange={handleInputChange}
                  placeholder="Enter work location"
                  required
                  error={errors.workLocation}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step 3: Compensation */}
        {step === 3 && (
          <div className="form-step">
            <div className="form-row">
              <div className="form-group">
                <Input
                  label="Salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="Enter salary amount"
                  required
                  error={errors.salary}
                />
              </div>
            </div>
            
            <h3 className="section-title">Bank Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <Input
                  label="Account Holder Name"
                  name="accountName"
                  value={formData.bankDetails?.accountName || ''}
                  onChange={(e) => handleNestedInputChange('bankDetails', 'accountName', e.target.value)}
                  placeholder="Enter account holder name"
                />
              </div>
              <div className="form-group">
                <Input
                  label="Account Number"
                  name="accountNumber"
                  value={formData.bankDetails?.accountNumber || ''}
                  onChange={(e) => handleNestedInputChange('bankDetails', 'accountNumber', e.target.value)}
                  placeholder="Enter account number"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <Input
                  label="Bank Name"
                  name="bankName"
                  value={formData.bankDetails?.bankName || ''}
                  onChange={(e) => handleNestedInputChange('bankDetails', 'bankName', e.target.value)}
                  placeholder="Enter bank name"
                />
              </div>
              <div className="form-group">
                <Input
                  label="IFSC Code"
                  name="ifscCode"
                  value={formData.bankDetails?.ifscCode || ''}
                  onChange={(e) => handleNestedInputChange('bankDetails', 'ifscCode', e.target.value)}
                  placeholder="Enter IFSC code"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Additional Information */}
        {step === 4 && (
          <div className="form-step">
            <h3 className="section-title">Address Information</h3>
            
            <div className="form-row">
              <div className="form-group full-width">
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </div>
              <div className="form-group">
                <Input
                  label="State/Province"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter state or province"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <Input
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Enter postal code"
                />
              </div>
              <div className="form-group">
                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="form-actions">
          {step > 1 && (
            <Button 
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={isSubmitting}
            >
              Previous
            </Button>
          )}
          
          {step < 4 ? (
            <Button 
              type="button"
              variant="primary"
              onClick={nextStep}
              disabled={isSubmitting}
            >
              Next
            </Button>
          ) : (
            <>
              <Button 
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="success"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {employee ? 'Update Employee' : 'Add Employee'}
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

EmployeeForm.propTypes = {
  employee: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  managers: PropTypes.array,
  roles: PropTypes.array,
  designations: PropTypes.array,
};

export default EmployeeForm;