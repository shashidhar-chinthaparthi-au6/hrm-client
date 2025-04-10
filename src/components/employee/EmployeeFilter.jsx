import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
// import './EmployeeFilter.css';

const EmployeeFilter = ({
  departments = [],
  designations = [],
  locations = [],
  statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'onboarding', label: 'Onboarding' },
    { value: 'notice_period', label: 'Notice Period' },
  ],
  onFilter,
  initialFilters = {},
  className = '',
}) => {
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    designation: '',
    location: '',
    status: '',
    joinDateFrom: '',
    joinDateTo: '',
    ...initialFilters,
  });

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  useEffect(() => {
    // Apply initial filters if provided
    if (Object.keys(initialFilters).length > 0) {
      handleApplyFilters();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    // Clean empty filters before sending
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    onFilter(cleanFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      search: '',
      department: '',
      designation: '',
      location: '',
      status: '',
      joinDateFrom: '',
      joinDateTo: '',
    };
    
    setFilters(resetFilters);
    onFilter({}); // Pass empty object to reset filters
  };

  const toggleAdvancedFilters = () => {
    setIsAdvancedOpen(!isAdvancedOpen);
  };

  return (
    <div className={`employee-filter ${className}`}>
      <div className="filter-basic">
        <div className="search-field">
          <Input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            placeholder="Search by name, email, or employee ID"
            iconLeft="search"
            className="search-input"
          />
        </div>
        
        <div className="basic-filters">
          <Select
            name="department"
            value={filters.department}
            onChange={(value) => handleSelectChange('department', value)}
            options={departments}
            placeholder="Department"
            className="filter-select"
          />
          
          <Select
            name="status"
            value={filters.status}
            onChange={(value) => handleSelectChange('status', value)}
            options={statuses}
            placeholder="Status"
            className="filter-select"
          />
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={toggleAdvancedFilters}
            className="advanced-toggle"
          >
            {isAdvancedOpen ? 'Hide' : 'Show'} Advanced Filters
          </Button>
        </div>
      </div>
      
      {isAdvancedOpen && (
        <div className="filter-advanced">
          <div className="advanced-filters-grid">
            <Select
              name="designation"
              value={filters.designation}
              onChange={(value) => handleSelectChange('designation', value)}
              options={designations}
              placeholder="Designation"
              className="filter-select"
            />
            
            <Select
              name="location"
              value={filters.location}
              onChange={(value) => handleSelectChange('location', value)}
              options={locations}
              placeholder="Location"
              className="filter-select"
            />
            
            <div className="date-range">
              <label className="date-label">Joining Date Range</label>
              <div className="date-inputs">
                <Input
                  type="date"
                  name="joinDateFrom"
                  value={filters.joinDateFrom}
                  onChange={handleInputChange}
                  placeholder="From"
                  className="date-input"
                />
                <span className="date-separator">to</span>
                <Input
                  type="date"
                  name="joinDateTo"
                  value={filters.joinDateTo}
                  onChange={handleInputChange}
                  placeholder="To"
                  className="date-input"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="filter-actions">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={handleResetFilters}
        >
          Reset
        </Button>
        
        <Button 
          type="button" 
          variant="primary" 
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

EmployeeFilter.propTypes = {
  departments: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  designations: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  statuses: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  onFilter: PropTypes.func.isRequired,
  initialFilters: PropTypes.object,
  className: PropTypes.string,
};

export default EmployeeFilter;