import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  Card, 
  Table, 
  Input, 
  Button, 
  Select, 
  Modal, 
  Badge 
} from '../components/common';
import { fetchRoles, updateRole, createRole, deleteRole } from '../redux/actions/roleActions';

const RolePermissions = () => {
  const dispatch = useDispatch();
  const { roles, loading, error } = useSelector(state => state.roles);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [filterBy, setFilterBy] = useState('all');

  // Form state for creating/editing roles
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: {
      dashboard: { view: false, edit: false },
      employees: { view: false, edit: false, create: false, delete: false },
      attendance: { view: false, edit: false, approve: false },
      leave: { view: false, edit: false, approve: false },
      payroll: { view: false, edit: false, process: false },
      performance: { view: false, edit: false, review: false },
      settings: { view: false, edit: false },
    }
  });

  // Modules that have permissions
  const modules = [
    { id: 'dashboard', name: 'Dashboard', actions: ['view', 'edit'] },
    { id: 'employees', name: 'Employees', actions: ['view', 'edit', 'create', 'delete'] },
    { id: 'attendance', name: 'Attendance', actions: ['view', 'edit', 'approve'] },
    { id: 'leave', name: 'Leave Management', actions: ['view', 'edit', 'approve'] },
    { id: 'payroll', name: 'Payroll', actions: ['view', 'edit', 'process'] },
    { id: 'performance', name: 'Performance', actions: ['view', 'edit', 'review'] },
    { id: 'settings', name: 'Settings', actions: ['view', 'edit'] },
  ];

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (value) => {
    setFilterBy(value);
  };

  const filteredRoles = roles?.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          role.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'admin') return matchesSearch && role.isAdmin;
    if (filterBy === 'custom') return matchesSearch && !role.isAdmin && !role.isDefault;
    if (filterBy === 'default') return matchesSearch && role.isDefault;
    
    return matchesSearch;
  });

  const handleCreateRole = () => {
    setModalMode('create');
    setFormData({
      name: '',
      description: '',
      permissions: {
        dashboard: { view: false, edit: false },
        employees: { view: false, edit: false, create: false, delete: false },
        attendance: { view: false, edit: false, approve: false },
        leave: { view: false, edit: false, approve: false },
        payroll: { view: false, edit: false, process: false },
        performance: { view: false, edit: false, review: false },
        settings: { view: false, edit: false },
      }
    });
    setShowModal(true);
  };

  const handleEditRole = (role) => {
    setModalMode('edit');
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: { ...role.permissions }
    });
    setShowModal(true);
  };

  const handleDeleteRole = (roleId) => {
    if (window.confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      dispatch(deleteRole(roleId))
        .then(() => {
          toast.success('Role deleted successfully');
        })
        .catch(err => {
          toast.error('Failed to delete role');
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (module, action) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [action]: !prev.permissions[module][action]
        }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalMode === 'create') {
      dispatch(createRole(formData))
        .then(() => {
          toast.success('Role created successfully');
          setShowModal(false);
        })
        .catch(err => {
          toast.error('Failed to create role');
        });
    } else {
      dispatch(updateRole(selectedRole.id, formData))
        .then(() => {
          toast.success('Role updated successfully');
          setShowModal(false);
        })
        .catch(err => {
          toast.error('Failed to update role');
        });
    }
  };

  const handleSelectAll = (module) => {
    const allSelected = modules
      .find(m => m.id === module)
      .actions
      .every(action => formData.permissions[module][action]);

    const newValue = !allSelected;
    
    setFormData(prev => {
      const updatedModulePermissions = {};
      modules
        .find(m => m.id === module)
        .actions
        .forEach(action => {
          updatedModulePermissions[action] = newValue;
        });
      
      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [module]: {
            ...prev.permissions[module],
            ...updatedModulePermissions
          }
        }
      };
    });
  };

  const isRoleProtected = (role) => {
    return role.isDefault || role.isAdmin;
  };

  const getRoleBadge = (role) => {
    if (role.isAdmin) return <Badge type="primary" text="Admin" />;
    if (role.isDefault) return <Badge type="info" text="Default" />;
    return <Badge type="success" text="Custom" />;
  };

  return (
    <div className="role-permissions-container">
      <div className="page-header">
        <h1>Role & Permissions</h1>
        <p>Manage access control and user permissions</p>
      </div>

      <Card>
        <div className="filters-container">
          <div className="search-box">
            <Input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={handleSearchChange}
              icon="search"
            />
          </div>
          <div className="filter-dropdown">
            <Select
              value={filterBy}
              onChange={handleFilterChange}
              options={[
                { value: 'all', label: 'All Roles' },
                { value: 'admin', label: 'Admin Roles' },
                { value: 'default', label: 'Default Roles' },
                { value: 'custom', label: 'Custom Roles' },
              ]}
            />
          </div>
          <Button 
            type="primary"
            onClick={handleCreateRole}
            icon="plus"
          >
            Create New Role
          </Button>
        </div>

        {loading ? (
          <div className="loading-container">Loading roles...</div>
        ) : error ? (
          <div className="error-container">Error loading roles. Please try again.</div>
        ) : (
          <Table
            data={filteredRoles || []}
            columns={[
              { 
                header: 'Role Name', 
                accessor: 'name',
                cell: (row) => (
                  <div className="role-name">
                    <span>{row.name}</span>
                    {getRoleBadge(row)}
                  </div>
                )
              },
              { 
                header: 'Description', 
                accessor: 'description' 
              },
              { 
                header: 'Users Assigned', 
                accessor: 'usersCount',
                cell: (row) => <span>{row.usersCount || 0} users</span>
              },
              { 
                header: 'Last Modified', 
                accessor: 'updatedAt',
                cell: (row) => <span>{new Date(row.updatedAt).toLocaleDateString()}</span>
              },
              {
                header: 'Actions',
                cell: (row) => (
                  <div className="table-actions">
                    <Button 
                      type="text" 
                      onClick={() => handleEditRole(row)}
                      icon="edit"
                      disabled={isRoleProtected(row)}
                    >
                      Edit
                    </Button>
                    <Button 
                      type="text" 
                      onClick={() => handleDeleteRole(row.id)}
                      icon="trash"
                      className="delete-btn"
                      disabled={isRoleProtected(row)}
                    >
                      Delete
                    </Button>
                  </div>
                )
              }
            ]}
            pagination
            itemsPerPage={10}
          />
        )}
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'create' ? 'Create New Role' : 'Edit Role'}
        size="large"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Role Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter role name"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <Input
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the purpose of this role"
            />
          </div>

          <div className="permissions-container">
            <h3>Permissions</h3>
            <p>Select what users with this role can access and modify</p>

            <div className="permissions-table">
              <table>
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Permissions</th>
                    <th>Select All</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map(module => (
                    <tr key={module.id}>
                      <td className="module-name">{module.name}</td>
                      <td className="permission-options">
                        {module.actions.map(action => (
                          <div key={`${module.id}-${action}`} className="permission-checkbox">
                            <input
                              type="checkbox"
                              id={`${module.id}-${action}`}
                              checked={formData.permissions[module.id]?.[action] || false}
                              onChange={() => handlePermissionChange(module.id, action)}
                            />
                            <label htmlFor={`${module.id}-${action}`}>
                              {action.charAt(0).toUpperCase() + action.slice(1)}
                            </label>
                          </div>
                        ))}
                      </td>
                      <td className="select-all">
                        <input
                          type="checkbox"
                          id={`select-all-${module.id}`}
                          checked={
                            module.actions.every(action => 
                              formData.permissions[module.id]?.[action] || false
                            )
                          }
                          onChange={() => handleSelectAll(module.id)}
                        />
                        <label htmlFor={`select-all-${module.id}`}>Select All</label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="modal-footer">
            <Button type="text" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {modalMode === 'create' ? 'Create Role' : 'Update Role'}
            </Button>
          </div>
        </form>
      </Modal>

      <style jsx>{`
        .role-permissions-container {
          padding: 20px;
        }
        
        .page-header {
          margin-bottom: 24px;
        }
        
        .page-header h1 {
          font-size: 24px;
          margin-bottom: 8px;
        }
        
        .page-header p {
          color: #6b7280;
        }
        
        .filters-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .search-box {
          width: 300px;
        }
        
        .filter-dropdown {
          width: 180px;
        }
        
        .role-name {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .table-actions {
          display: flex;
          gap: 8px;
        }
        
        .delete-btn {
          color: #ef4444;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .permissions-container {
          margin-top: 24px;
        }
        
        .permissions-container h3 {
          margin-bottom: 8px;
        }
        
        .permissions-container p {
          margin-bottom: 16px;
          color: #6b7280;
        }
        
        .permissions-table {
          overflow-x: auto;
          margin-top: 16px;
        }
        
        .permissions-table table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .permissions-table th,
        .permissions-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .permissions-table th {
          background-color: #f9fafb;
          font-weight: 500;
        }
        
        .module-name {
          font-weight: 500;
        }
        
        .permission-options {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .permission-checkbox {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .select-all {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }
      `}</style>
    </div>
  );
};

export default RolePermissions;