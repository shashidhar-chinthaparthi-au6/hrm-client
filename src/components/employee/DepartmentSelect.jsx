import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from '../common/Select';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
// import './DepartmentSelect.css';

const DepartmentSelect = ({
  value = '',
  onChange,
  departments = [],
  isLoading = false,
  hasError = false,
  errorMessage = '',
  canCreate = false,
  onCreateDepartment,
  placeholder = 'Select Department',
  className = '',
  disabled = false,
  required = false,
  label = 'Department',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    code: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [localDepartments, setLocalDepartments] = useState([]);

  useEffect(() => {
    // Format departments for Select component
    if (Array.isArray(departments)) {
      const formattedDepartments = departments.map(dept => ({
        value: dept.id || dept.value,
        label: dept.name || dept.label,
      }));
      
      setLocalDepartments(formattedDepartments);
    }
  }, [departments]);

  const openCreateModal = () => {
    setIsModalOpen(true);
    setValidationErrors({});
    setNewDepartment({
      name: '',
      description: '',
      code: '',
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleCreateDepartment = async () => {
    // Validate inputs
    const errors = {};
    if (!newDepartment.name.trim()) {
      errors.name = 'Department name is required';
    }
    
    if (!newDepartment.code.trim()) {
      errors.code = 'Department code is required';
    } else if (!/^[A-Z0-9]+$/i.test(newDepartment.code)) {
      errors.code = 'Code should contain only letters and numbers';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    try {
      // If onCreateDepartment returns a promise, we can await it
      if (onCreateDepartment) {
        const createdDepartment = await onCreateDepartment(newDepartment);
        
        // If we get back the created department, we can add it to our local state
        if (createdDepartment) {
          const newDeptOption = {
            value: createdDepartment.id || createdDepartment.value,
            label: createdDepartment.name || createdDepartment.label,
          };
          
          setLocalDepartments(prev => [...prev, newDeptOption]);
          
          // Auto-select the newly created department
          onChange(newDeptOption.value);
        }
      }
      
      closeModal();
    } catch (error) {
      setValidationErrors({
        form: error.message || 'Failed to create department. Please try again.',
      });
    }
  };

  // Render a message when there are no departments
  const renderNoOptions = () => (
    <div className="no-departments">
      <p>No departments available.</p>
      {canCreate && (
        <Button 
          variant="link" 
          size="small" 
          onClick={openCreateModal}
        >
          Create a department
        </Button>
      )}
    </div>
  );

  return (
    <div className={`department-select-container ${className}`}>
      <div className="department-select-header">
        {label && (
          <label className="department-select-label">
            {label}
            {required && <span className="required-mark">*</span>}
          </label>
        )}
        
        {canCreate && (
          <Button 
            variant="link" 
            size="small" 
            onClick={openCreateModal}
            disabled={disabled}
          >
            + Add New
          </Button>
        )}
      </div>
      
      <Select
        name="department"
        value={value}
        onChange={onChange}
        options={localDepartments}
        placeholder={placeholder}
        isLoading={isLoading}
        disabled={disabled}
        noOptionsMessage={renderNoOptions}
        error={hasError}
        errorMessage={errorMessage}
        className="department-dropdown"
      />
      
      {/* Create Department Modal */}
      {canCreate && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Create New Department"
          size="medium"
        >
          <div className="department-form">
            {validationErrors.form && (
              <div className="form-error">{validationErrors.form}</div>
            )}
            
            <div className="form-group">
              <Input
                label="Department Name"
                name="name"
                value={newDepartment.name}
                onChange={handleInputChange}
                placeholder="Enter department name"
                required
                error={!!validationErrors.name}
                errorMessage={validationErrors.name}
              />
            </div>
            
            <div className="form-group">
              <Input
                label="Department Code"
                name="code"
                value={newDepartment.code}
                onChange={handleInputChange}
                placeholder="E.g., HR, IT, FIN"
                required
                error={!!validationErrors.code}
                errorMessage={validationErrors.code}
              />
            </div>
            
            <div className="form-group">
              <Input
                label="Description"
                name="description"
                value={newDepartment.description}
                onChange={handleInputChange}
                placeholder="Brief description of the department"
                type="textarea"
                rows={3}
              />
            </div>
            
            <div className="modal-actions">
              <Button 
                variant="secondary" 
                onClick={closeModal}
              >
                Cancel
              </Button>
              
              <Button 
                variant="primary" 
                onClick={handleCreateDepartment}
              >
                Create Department
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

DepartmentSelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  departments: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
      }),
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string.isRequired,
      }),
    ])
  ),
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
  canCreate: PropTypes.bool,
  onCreateDepartment: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  label: PropTypes.string,
};

export default DepartmentSelect;