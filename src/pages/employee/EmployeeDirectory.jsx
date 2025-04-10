import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Grid, Card, CardContent, TextField, InputAdornment, Menu, MenuItem, CircularProgress, Alert, Pagination, FormControl, InputLabel, Select, Container, Chip, Avatar, Divider, useTheme, alpha, Checkbox, ListItemText, IconButton, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employeeService';
import { saveAs } from 'file-saver';
import { debounce } from 'lodash';

const EmployeeDirectory = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    designation: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalCount: 0
  });
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Fetch departments and designations
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [deptResponse, desigResponse] = await Promise.all([
          employeeService.getDepartments(),
          employeeService.getDesignations()
        ]);
        setDepartments(deptResponse.data || []);
        setDesignations(desigResponse.data || []);
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Count active filters
  useEffect(() => {
    const count = Object.values(filters).filter(value => value !== '').length;
    setActiveFilters(count);
  }, [filters]);

  // Fetch employees with debounced search
  const fetchEmployees = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.getAll({
        page,
        search: searchQuery,
        ...filters,
        sortBy,
        sortOrder
      });
      
      setEmployees(response.data.employees);
      setPagination({
        page: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalCount: response.data.totalCount
      });
    } catch (err) {
      setError('Failed to fetch employees. Please try again later.');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = debounce((value) => {
    setSearchQuery(value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on search
  }, 500);

  useEffect(() => {
    fetchEmployees(pagination.page);
  }, [searchQuery, filters, sortBy, sortOrder, pagination.page]);

  // Handle search
  const handleSearch = (event) => {
    debouncedSearch(event.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter
    setFilterAnchorEl(null); // Close filter menu after selection
  };

  // Handle sort changes
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on sort
  };

  // Handle export
  const handleExport = async () => {
    try {
      setExportLoading(true);
      const response = await employeeService.getAll({
        ...filters,
        sortBy,
        sortOrder,
        export: true
      });
      
      // Format the data for export
      const exportData = response.data.employees.map(emp => ({
        'Employee ID': emp.employeeId,
        'Name': `${emp.firstName} ${emp.lastName}`,
        'Email': emp.email,
        'Department': emp.department?.name || 'N/A',
        'Designation': emp.designation?.name || 'N/A',
        'Status': emp.status,
        'Join Date': new Date(emp.dateOfJoining).toLocaleDateString(),
        'Phone': emp.phone
      }));

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      saveAs(blob, `employees_export_${new Date().toISOString().split('T')[0]}.json`);
    } catch (err) {
      console.error('Error exporting employees:', err);
      setError('Failed to export employees. Please try again later.');
    } finally {
      setExportLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, page: value }));
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'on-leave': return 'warning';
      default: return 'default';
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      department: '',
      status: '',
      designation: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Get filter label
  const getFilterLabel = (field) => {
    switch(field) {
      case 'department':
        const dept = departments.find(d => d._id === filters.department);
        return dept ? dept.name : 'Department';
      case 'designation':
        const desig = designations.find(d => d._id === filters.designation);
        return desig ? desig.name : 'Designation';
      case 'status':
        return filters.status ? filters.status.charAt(0).toUpperCase() + filters.status.slice(1) : 'Status';
      default:
        return field;
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.background.default, 0.1)} 100%)`,
        py: 4
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              letterSpacing: 1
            }}
          >
            Employee Directory
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/employees/add')}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              boxShadow: `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.39)}`,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              '&:hover': {
                background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                boxShadow: `0 6px 20px 0 ${alpha(theme.palette.primary.main, 0.5)}`,
              }
            }}
          >
            Add Employee
          </Button>
        </Box>
        
        <Paper 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search employees by name, department, or designation"
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                    },
                    '&.Mui-focused': {
                      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {/* Active Filters Display */}
                {activeFilters > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, width: '100%' }}>
                    {filters.department && (
                      <Chip 
                        label={`Department: ${getFilterLabel('department')}`}
                        onDelete={() => handleFilterChange('department', '')}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    )}
                    {filters.designation && (
                      <Chip 
                        label={`Designation: ${getFilterLabel('designation')}`}
                        onDelete={() => handleFilterChange('designation', '')}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    )}
                    {filters.status && (
                      <Chip 
                        label={`Status: ${getFilterLabel('status')}`}
                        onDelete={() => handleFilterChange('status', '')}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    )}
                    <Chip 
                      label="Clear All"
                      onClick={clearAllFilters}
                      color="default"
                      size="small"
                      sx={{ ml: 'auto' }}
                    />
                  </Box>
                )}

                <Button 
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                  sx={{ borderRadius: 2 }}
                >
                  Filter
                  {activeFilters > 0 && (
                    <Badge 
                      badgeContent={activeFilters} 
                      color="primary" 
                      sx={{ ml: 1 }}
                    />
                  )}
                </Button>

                <Button 
                  variant="outlined"
                  startIcon={<SortIcon />}
                  onClick={(e) => setSortAnchorEl(e.currentTarget)}
                  sx={{ borderRadius: 2 }}
                >
                  Sort
                </Button>

                <Button 
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleExport}
                  disabled={exportLoading}
                  sx={{ borderRadius: 2 }}
                >
                  {exportLoading ? 'Exporting...' : 'Export'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={() => setFilterAnchorEl(null)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
              mt: 1,
              minWidth: 250
            }
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Typography variant="subtitle1" fontWeight="bold">Filters</Typography>
          </Box>
          
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Department</Typography>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <Select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                displayEmpty
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="">All Departments</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Designation</Typography>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <Select
                value={filters.designation}
                onChange={(e) => handleFilterChange('designation', e.target.value)}
                displayEmpty
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="">All Designations</MenuItem>
                {designations.map((desig) => (
                  <MenuItem key={desig._id} value={desig._id}>
                    {desig.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="subtitle2" sx={{ mb: 1 }}>Status</Typography>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                displayEmpty
                sx={{ borderRadius: 1 }}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="on-leave">On Leave</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)', display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="text" 
              size="small" 
              onClick={clearAllFilters}
              disabled={activeFilters === 0}
            >
              Clear All
            </Button>
            <Button 
              variant="contained" 
              size="small" 
              onClick={() => setFilterAnchorEl(null)}
            >
              Apply
            </Button>
          </Box>
        </Menu>

        {/* Sort Menu */}
        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={() => setSortAnchorEl(null)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
              mt: 1
            }
          }}
        >
          <MenuItem onClick={() => handleSortChange('firstName')}>
            Name {sortBy === 'firstName' && (sortOrder === 'asc' ? '↑' : '↓')}
          </MenuItem>
          <MenuItem onClick={() => handleSortChange('department')}>
            Department {sortBy === 'department' && (sortOrder === 'asc' ? '↑' : '↓')}
          </MenuItem>
          <MenuItem onClick={() => handleSortChange('designation')}>
            Designation {sortBy === 'designation' && (sortOrder === 'asc' ? '↑' : '↓')}
          </MenuItem>
          <MenuItem onClick={() => handleSortChange('dateOfJoining')}>
            Join Date {sortBy === 'dateOfJoining' && (sortOrder === 'asc' ? '↑' : '↓')}
          </MenuItem>
        </Menu>

        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {employees.map((employee) => (
                <Grid item xs={12} sm={6} md={4} key={employee._id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 28px 0 rgba(0, 0, 0, 0.1)',
                      }
                    }} 
                    onClick={() => navigate(`/employees/${employee._id}`)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            width: 60, 
                            height: 60, 
                            bgcolor: theme.palette.primary.main,
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            mr: 2,
                            boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}`
                          }}
                        >
                          {employee.firstName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {`${employee.firstName} ${employee.lastName}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {employee.designation?.name || 'No Designation'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {employee.department?.name || 'No Department'}
                        </Typography>
                        <Chip 
                          label={employee.status?.charAt(0).toUpperCase() + employee.status?.slice(1) || 'Unknown'} 
                          color={getStatusColor(employee.status)}
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            borderRadius: 1.5,
                            px: 1
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Pagination 
                  count={pagination.totalPages} 
                  page={pagination.page} 
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 1,
                      '&.Mui-selected': {
                        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                      }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default EmployeeDirectory;