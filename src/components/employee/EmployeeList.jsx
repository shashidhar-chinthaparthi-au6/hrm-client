import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import EmployeeFilter from './EmployeeFilter';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';
// import './EmployeeList.css';

const EmployeeList = ({
  employees = [],
  loading = false,
  error = null,
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onFilterChange,
  departments = [],
  designations = [],
  totalCount = 0,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    designation: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1); // Reset to first page when filters change
    
    if (onFilterChange) {
      onFilterChange({ ...filters, ...newFilters, page: 1, pageSize });
    }
  };

  // Handle sort change
  const handleSortChange = (column, direction) => {
    setFilters({
      ...filters,
      sortBy: column,
      sortOrder: direction,
    });
    
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        sortBy: column,
        sortOrder: direction,
        page: currentPage,
        pageSize,
      });
    }
  };

  // Effect to fetch data when pagination or filters change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        page: currentPage,
        pageSize,
      });
    }
  }, [currentPage, pageSize]);

  // Table columns configuration
  const columns = [
    {
      id: 'employee',
      header: 'Employee',
      cell: (row) => (
        <div className="employee-item">
          <Avatar 
            src={row.avatar} 
            name={`${row.firstName} ${row.lastName}`} 
            size="small" 
          />
          <div className="employee-info">
            <div className="employee-name">{`${row.firstName} ${row.lastName}`}</div>
            <div className="employee-id">{row.employeeId}</div>
          </div>
        </div>
      ),
      sortable: true,
      sortField: 'name',
    },
    {
      id: 'department',
      header: 'Department',
      cell: (row) => <span>{row.department}</span>,
      sortable: true,
    },
    {
      id: 'designation',
      header: 'Designation',
      cell: (row) => <span>{row.designation}</span>,
      sortable: true,
    },
    {
      id: 'email',
      header: 'Email',
      cell: (row) => <span className="employee-email">{row.email}</span>,
    },
    {
      id: 'phone',
      header: 'Phone',
      cell: (row) => <span>{row.phone}</span>,
    },
    {
      id: 'joinDate',
      header: 'Join Date',
      cell: (row) => <span>{new Date(row.joinDate).toLocaleDateString()}</span>,
      sortable: true,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => {
        const statusConfig = {
          active: { variant: 'success', label: 'Active' },
          onLeave: { variant: 'warning', label: 'On Leave' },
          inactive: { variant: 'danger', label: 'Inactive' },
          probation: { variant: 'info', label: 'Probation' },
        };
        
        const config = statusConfig[row.status] || { variant: 'default', label: row.status };
        
        return <Badge variant={config.variant} label={config.label} />;
      },
      sortable: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="employee-actions">
          <Button 
            variant="text"
            onClick={() => onViewEmployee(row.id)}
            icon={
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            }
          />
          <Button 
            variant="text"
            onClick={() => onEditEmployee(row.id)}
            icon={
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            }
          />
          <Button 
            variant="text"
            onClick={() => onDeleteEmployee(row.id)}
            icon={
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            }
          />
        </div>
      ),
    },
  ];

  // Empty state
  const renderEmptyState = () => (
    <div className="employee-empty-state">
      <svg viewBox="0 0 24 24" width="48" height="48">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
      <h3>No employees found</h3>
      <p>Try adjusting your filters or add a new employee</p>
    </div>
  );

  return (
    <div className="employee-list-container">
      <div className="employee-list-header">
        <h2>Employees</h2>
        <Button 
          variant="primary"
          onClick={() => onEditEmployee('new')}
          icon={
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          }
        >
          Add Employee
        </Button>
      </div>
      
      <EmployeeFilter 
        departments={departments}
        designations={designations}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      {loading ? (
        <div className="employee-list-loading">
          <div className="loading-spinner"></div>
          <p>Loading employees...</p>
        </div>
      ) : error ? (
        <div className="employee-list-error">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {employees.length === 0 ? (
            renderEmptyState()
          ) : (
            <Table 
              data={employees}
              columns={columns}
              onSort={handleSortChange}
              sortField={filters.sortBy}
              sortDirection={filters.sortOrder}
              className="employee-table"
              rowKeyField="id"
            />
          )}
          
          {totalPages > 1 && (
            <div className="employee-list-footer">
              <div className="page-size-selector">
                <span>Show</span>
                <select 
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
              </div>
              
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
              
              <div className="page-info">
                Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

EmployeeList.propTypes = {
  employees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      employeeId: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
      department: PropTypes.string,
      designation: PropTypes.string,
      joinDate: PropTypes.string,
      status: PropTypes.string,
      avatar: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onViewEmployee: PropTypes.func.isRequired,
  onEditEmployee: PropTypes.func.isRequired,
  onDeleteEmployee: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func,
  departments: PropTypes.arrayOf(PropTypes.object),
  designations: PropTypes.arrayOf(PropTypes.object),
  totalCount: PropTypes.number,
};

export default EmployeeList;