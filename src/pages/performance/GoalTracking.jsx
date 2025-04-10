import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import DatePicker from '../../components/common/DatePicker';
import GoalSetting from '../../components/performance/GoalSetting';
import Badge from '../../components/common/Badge';
import { getEmployeeGoals, createGoal, updateGoal, deleteGoal } from '../../services/performanceService';
import { toast } from 'react-toastify';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import '../../assets/styles/pages/performance.css';

const GoalTracking = () => {
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // view, edit, create, delete
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    searchQuery: ''
  });
  
  const { employeeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGoals();
  }, [employeeId]);

  useEffect(() => {
    applyFilters();
  }, [goals, filters]);

  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const goalsData = await getEmployeeGoals(employeeId);
      setGoals(goalsData);
      setFilteredGoals(goalsData);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals data');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...goals];
    
    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(goal => goal.status.toLowerCase() === filters.status.toLowerCase());
    }
    
    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(goal => goal.category.toLowerCase() === filters.category.toLowerCase());
    }
    
    // Apply priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(goal => goal.priority.toLowerCase() === filters.priority.toLowerCase());
    }
    
    // Apply search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(goal => 
        goal.title.toLowerCase().includes(query) || 
        goal.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredGoals(filtered);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateGoal = () => {
    setSelectedGoal(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleViewGoal = (goal) => {
    setSelectedGoal(goal);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditGoal = (goal) => {
    setSelectedGoal(goal);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDeleteGoal = (goal) => {
    setSelectedGoal(goal);
    setModalMode('delete');
    setShowModal(true);
  };

  const handleStatusUpdate = async (goalId, newStatus) => {
    try {
      const goalToUpdate = goals.find(g => g.id === goalId);
      if (!goalToUpdate) return;
      
      const updatedGoal = {
        ...goalToUpdate,
        status: newStatus
      };
      
      await updateGoal(goalId, updatedGoal);
      
      // Update local state
      const updatedGoals = goals.map(g => g.id === goalId ? updatedGoal : g);
      setGoals(updatedGoals);
      
      toast.success(`Goal status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating goal status:', error);
      toast.error('Failed to update goal status');
    }
  };

  const handleSubmitGoal = async (goalData) => {
    try {
      if (modalMode === 'create') {
        const newGoal = await createGoal(employeeId, goalData);
        setGoals(prev => [...prev, newGoal]);
        toast.success('Goal created successfully');
      } else if (modalMode === 'edit') {
        const updatedGoal = await updateGoal(selectedGoal.id, goalData);
        setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
        toast.success('Goal updated successfully');
      } else if (modalMode === 'delete') {
        await deleteGoal(selectedGoal.id);
        setGoals(prev => prev.filter(g => g.id !== selectedGoal.id));
        toast.success('Goal deleted successfully');
      }
      
      setShowModal(false);
    } catch (error) {
      console.error('Error processing goal:', error);
      toast.error(`Failed to ${modalMode} goal`);
    }
  };

  const goalStatusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'not started', label: 'Not Started' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const goalCategoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'performance', label: 'Performance' },
    { value: 'learning', label: 'Learning & Development' },
    { value: 'career', label: 'Career Growth' },
    { value: 'project', label: 'Project-Based' },
    { value: 'behavioral', label: 'Behavioral' }
  ];

  const goalPriorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const columns = [
    {
      header: 'Title',
      accessor: 'title',
      cell: (row) => <span className="goal-title">{row.title}</span>
    },
    {
      header: 'Category',
      accessor: 'category',
      cell: (row) => <span className="goal-category">{row.category}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        let statusColor = '';
        switch (row.status.toLowerCase()) {
          case 'completed':
            statusColor = 'success';
            break;
          case 'in progress':
            statusColor = 'info';
            break;
          case 'not started':
            statusColor = 'warning';
            break;
          case 'overdue':
            statusColor = 'danger';
            break;
          default:
            statusColor = 'default';
        }
        return <Badge text={row.status} color={statusColor} />;
      }
    },
    {
      header: 'Priority',
      accessor: 'priority',
      cell: (row) => {
        let priorityColor = '';
        switch (row.priority.toLowerCase()) {
          case 'high':
            priorityColor = 'danger';
            break;
          case 'medium':
            priorityColor = 'warning';
            break;
          case 'low':
            priorityColor = 'info';
            break;
          default:
            priorityColor = 'default';
        }
        return <Badge text={row.priority} color={priorityColor} />;
      }
    },
    {
      header: 'Target Date',
      accessor: 'targetDate',
      cell: (row) => <span>{new Date(row.targetDate).toLocaleDateString()}</span>
    },
    {
      header: 'Progress',
      accessor: 'progress',
      cell: (row) => (
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${row.progress}%` }}
            ></div>
          </div>
          <span>{row.progress}%</span>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="table-actions">
          <button className="action-btn view" onClick={() => handleViewGoal(row)}>
            <i className="fas fa-eye"></i>
          </button>
          <button className="action-btn edit" onClick={() => handleEditGoal(row)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="action-btn delete" onClick={() => handleDeleteGoal(row)}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Performance', path: '/performance' },
    { label: 'Goal Tracking', path: null }
  ];

  return (
    <div className="goal-tracking-container">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="page-header">
        <h1>Goal Tracking</h1>
        <div className="action-buttons">
          <Button 
            variant="primary" 
            onClick={handleCreateGoal}
          >
            <i className="fas fa-plus"></i> Add New Goal
          </Button>
        </div>
      </div>

      <Card className="goal-stats-card">
        <div className="goal-stats">
          <div className="stat-item">
            <div className="stat-value">{goals.filter(g => g.status === 'Completed').length}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{goals.filter(g => g.status === 'In Progress').length}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{goals.filter(g => g.status === 'Not Started').length}</div>
            <div className="stat-label">Not Started</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{goals.filter(g => g.status === 'Overdue').length}</div>
            <div className="stat-label">Overdue</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{goals.length}</div>
            <div className="stat-label">Total Goals</div>
          </div>
        </div>
      </Card>

      <Card className="goal-filters-card">
        <div className="filters-container">
          <div className="filter-group">
            <Input
              type="text"
              placeholder="Search goals..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <Select
              options={goalStatusOptions}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              placeholder="Filter by status"
            />
          </div>
          <div className="filter-group">
            <Select
              options={goalCategoryOptions}
              value={filters.category}
              onChange={(value) => handleFilterChange('category', value)}
              placeholder="Filter by category"
            />
          </div>
          <div className="filter-group">
            <Select
              options={goalPriorityOptions}
              value={filters.priority}
              onChange={(value) => handleFilterChange('priority', value)}
              placeholder="Filter by priority"
            />
          </div>
          <div className="filter-group">
            <Button 
              variant="secondary" 
              onClick={() => setFilters({
                status: 'all',
                category: 'all',
                priority: 'all',
                searchQuery: ''
              })}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="loading-spinner">Loading goals...</div>
      ) : filteredGoals.length === 0 ? (
        <Card className="no-data-card">
          <div className="no-data-message">
            <i className="fas fa-tasks"></i>
            <h3>No goals found</h3>
            <p>No goals match your current filters or no goals have been created yet.</p>
            <Button 
              variant="primary" 
              onClick={handleCreateGoal}
            >
              Create Your First Goal
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="goals-table-card">
          <Table 
            columns={columns} 
            data={filteredGoals}
            onRowClick={handleViewGoal}
          />
        </Card>
      )}

      {/* Goal Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
          modalMode === 'view' ? 'Goal Details' : 
          modalMode === 'create' ? 'Create New Goal' : 
          modalMode === 'edit' ? 'Edit Goal' : 
          'Delete Goal'
        }
        size={modalMode === 'delete' ? 'small' : 'large'}
      >
        {modalMode === 'delete' ? (
          <div className="delete-confirmation">
            <p>Are you sure you want to delete the goal "{selectedGoal?.title}"?</p>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <Button 
                variant="secondary" 
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleSubmitGoal()}
              >
                Delete Goal
              </Button>
            </div>
          </div>
        ) : (
          <GoalSetting
            goalData={selectedGoal}
            readOnly={modalMode === 'view'}
            onSubmit={handleSubmitGoal}
            onCancel={() => setShowModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default GoalTracking;