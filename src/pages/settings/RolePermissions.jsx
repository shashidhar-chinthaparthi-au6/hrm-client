import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Fade,
  InputAdornment,
  Tooltip,
  Stack,
  Divider,
  Alert,
  Zoom,
  Grid,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  Info as InfoIcon,
  Save as SaveIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import { fetchRoles, updateRole, createRole, deleteRole } from '../redux/actions/roleActions';

const RolePermissions = () => {
  const dispatch = useDispatch();
  const { roles, loading, error } = useSelector(state => state.roles);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [filterBy, setFilterBy] = useState('all');
  const [saving, setSaving] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

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
    { id: 'dashboard', name: 'Dashboard', icon: <AdminIcon />, actions: ['view', 'edit'] },
    { id: 'employees', name: 'Employees', icon: <PeopleIcon />, actions: ['view', 'edit', 'create', 'delete'] },
    { id: 'attendance', name: 'Attendance', icon: <SecurityIcon />, actions: ['view', 'edit', 'approve'] },
    { id: 'leave', name: 'Leave Management', icon: <SecurityIcon />, actions: ['view', 'edit', 'approve'] },
    { id: 'payroll', name: 'Payroll', icon: <SecurityIcon />, actions: ['view', 'edit', 'process'] },
    { id: 'performance', name: 'Performance', icon: <SecurityIcon />, actions: ['view', 'edit', 'review'] },
    { id: 'settings', name: 'Settings', icon: <SecurityIcon />, actions: ['view', 'edit'] },
  ];

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
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

  const handleDeleteClick = (role) => {
    setRoleToDelete(role);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (roleToDelete) {
      setSaving(true);
      dispatch(deleteRole(roleToDelete.id))
        .then(() => {
          toast.success('Role deleted successfully');
          setDeleteConfirmOpen(false);
          setRoleToDelete(null);
        })
        .catch(err => {
          toast.error('Failed to delete role');
        })
        .finally(() => {
          setSaving(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (modalMode === 'create') {
        await dispatch(createRole(formData));
        toast.success('Role created successfully');
      } else {
        await dispatch(updateRole(selectedRole.id, formData));
        toast.success('Role updated successfully');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(`Failed to ${modalMode} role`);
    } finally {
      setSaving(false);
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

  const getRoleChip = (role) => {
    if (role.isAdmin) {
      return <Chip icon={<AdminIcon />} label="Admin" color="primary" size="small" />;
    }
    if (role.isDefault) {
      return <Chip icon={<CheckCircleIcon />} label="Default" color="info" size="small" />;
    }
    return <Chip icon={<SecurityIcon />} label="Custom" color="success" size="small" />;
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumbs
          items={[
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Settings', link: '/settings' },
            { label: 'Role & Permissions', link: '/settings/roles' },
          ]}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Role & Permissions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage access control and user permissions
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateRole}
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
              }
            }}
          >
            Create New Role
          </Button>
        </Box>

        <Fade in timeout={500}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  size="small"
                  sx={{ width: 300 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Select
                  value={filterBy}
                  onChange={handleFilterChange}
                  size="small"
                  sx={{ width: 180 }}
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="admin">Admin Roles</MenuItem>
                  <MenuItem value="default">Default Roles</MenuItem>
                  <MenuItem value="custom">Custom Roles</MenuItem>
                </Select>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Error loading roles. Please try again.
                </Alert>
              ) : filteredRoles?.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <InfoIcon sx={{ mr: 1 }} />
                  No roles found matching your search criteria.
                </Alert>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Role Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Users Assigned</TableCell>
                        <TableCell>Last Modified</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredRoles?.map((role) => (
                        <TableRow key={role.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar 
                                sx={{ 
                                  bgcolor: role.isAdmin ? 'primary.main' : 
                                          role.isDefault ? 'info.main' : 'success.main',
                                  width: 32,
                                  height: 32
                                }}
                              >
                                {role.isAdmin ? <AdminIcon /> : 
                                 role.isDefault ? <CheckCircleIcon /> : <SecurityIcon />}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {role.name}
                                </Typography>
                                {getRoleChip(role)}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {role.description}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PeopleIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {role.usersCount || 0} users
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(role.updatedAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Edit Role">
                                <IconButton
                                  onClick={() => handleEditRole(role)}
                                  disabled={isRoleProtected(role)}
                                  color="primary"
                                  size="small"
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Role">
                                <IconButton
                                  onClick={() => handleDeleteClick(role)}
                                  disabled={isRoleProtected(role)}
                                  color="error"
                                  size="small"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Fade>

        {/* Create/Edit Role Modal */}
        <Dialog
          open={showModal}
          onClose={() => setShowModal(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            color: 'white',
            py: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {modalMode === 'create' ? <AddIcon /> : <EditIcon />}
              <Typography variant="h6">
                {modalMode === 'create' ? 'Create New Role' : 'Edit Role'}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Role Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SecurityIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    placeholder="Describe the purpose and responsibilities of this role"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Permissions
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <InfoIcon sx={{ mr: 1 }} />
                  Select what users with this role can access and modify
                </Alert>

                <TableContainer component={Paper} elevation={0} sx={{ mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'background.default' }}>
                        <TableCell>Module</TableCell>
                        <TableCell>Permissions</TableCell>
                        <TableCell align="center">Select All</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {modules.map(module => (
                        <TableRow key={module.id} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {module.icon}
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {module.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={2} flexWrap="wrap">
                              {module.actions.map(action => (
                                <FormControlLabel
                                  key={`${module.id}-${action}`}
                                  control={
                                    <Checkbox
                                      checked={formData.permissions[module.id]?.[action] || false}
                                      onChange={() => handlePermissionChange(module.id, action)}
                                      size="small"
                                    />
                                  }
                                  label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      {action === 'view' && <VisibilityIcon fontSize="small" color="action" />}
                                      {action === 'edit' && <EditIcon fontSize="small" color="action" />}
                                      {action === 'create' && <AddIcon fontSize="small" color="action" />}
                                      {action === 'delete' && <DeleteIcon fontSize="small" color="action" />}
                                      {action === 'approve' && <CheckCircleIcon fontSize="small" color="action" />}
                                      {action === 'process' && <LockIcon fontSize="small" color="action" />}
                                      {action === 'review' && <SecurityIcon fontSize="small" color="action" />}
                                      <Typography variant="body2">
                                        {action.charAt(0).toUpperCase() + action.slice(1)}
                                      </Typography>
                                    </Box>
                                  }
                                  sx={{ minWidth: 120 }}
                                />
                              ))}
                            </Stack>
                          </TableCell>
                          <TableCell align="center">
                            <Checkbox
                              checked={module.actions.every(action => 
                                formData.permissions[module.id]?.[action] || false
                              )}
                              onChange={() => handleSelectAll(module.id)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{
                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                }
              }}
            >
              {saving ? 'Saving...' : modalMode === 'create' ? 'Create Role' : 'Update Role'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <DialogTitle sx={{ 
            bgcolor: 'error.light',
            color: 'error.contrastText',
            py: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon />
              <Typography variant="h6">
                Confirm Delete
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <WarningIcon sx={{ mr: 1 }} />
              This action cannot be undone. All users assigned to this role will lose their permissions.
            </Alert>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete the role <strong>{roleToDelete?.name}</strong>?
            </Typography>
            {roleToDelete?.usersCount > 0 && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                Warning: This role is currently assigned to {roleToDelete.usersCount} users.
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteConfirm}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            >
              {saving ? 'Deleting...' : 'Delete Role'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </MainLayout>
  );
};

export default RolePermissions;