import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Card from '../common/Card';
import { formatDate } from '../../utils/dateUtils';
import { useToast } from '../../hooks/useToast';

const GoalSetting = ({ employeeId, userId, isManager }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'performance',
    startDate: '',
    targetDate: '',
    status: 'draft',
    priority: 'medium',
    alignedWith: '',
  });
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();

  const categories = [
    { value: 'performance', label: 'Performance' },
    { value: 'development', label: 'Professional Development' },
    { value: 'behavioral', label: 'Behavioral' },
    { value: 'project', label: 'Project Based' },
    { value: 'company', label: 'Company Target' },
  ];

  const priorities = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const statuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        // Replace with actual API call
        const response = await fetch(`/api/goals/${employeeId || userId}`);
        const data = await response.json();
        setGoals(data);
      } catch (error) {
        console.error('Error fetching goals:', error);
        showToast('Failed to load goals', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [employeeId, userId, showToast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setNewGoal(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // Replace with actual API call
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newGoal,
          employeeId: employeeId || userId,
          createdBy: userId,
          createdAt: new Date().toISOString(),
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showToast('Goal created successfully', 'success');
        setGoals(prev => [...prev, data]);
        setNewGoal({
          title: '',
          description: '',
          category: 'performance',
          startDate: '',
          targetDate: '',
          status: 'draft',
          priority: 'medium',
          alignedWith: '',
        });
        setShowForm(false);
      } else {
        showToast(data.message || 'Failed to create goal', 'error');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      showToast('Failed to create goal', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateGoalStatus = async (goalId, newStatus) => {
    try {
      setLoading(true);
      // Replace with actual API call
      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          updatedBy: userId,
          updatedAt: new Date().toISOString(),
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showToast('Goal status updated', 'success');
        setGoals(prev => 
          prev.map(goal => goal.id === goalId ? { ...goal, status: newStatus } : goal)
        );
      } else {
        showToast(data.message || 'Failed to update goal', 'error');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      showToast('Failed to update goal', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  const getPriorityLabel = (priorityValue) => {
    const priority = priorities.find(p => p.value === priorityValue);
    return priority ? priority.label : priorityValue;
  };

  const renderGoalCard = (goal) => {
    return (
      <Card key={goal.id} className="mb-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg">{goal.title}</h3>
          <div className="flex space-x-2">
            <span className={`px-2 py-1 text-xs rounded ${
              goal.priority === 'high' ? 'bg-red-100 text-red-800' :
              goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {getPriorityLabel(goal.priority)}
            </span>
            <span className={`px-2 py-1 text-xs rounded ${
              goal.status === 'completed' ? 'bg-green-100 text-green-800' :
              goal.status === 'active' ? 'bg-blue-100 text-blue-800' :
              goal.status === 'on-hold' ? 'bg-orange-100 text-orange-800' :
              goal.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-3">{goal.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-xs text-gray-500">Category</span>
            <p className="text-sm">{getCategoryLabel(goal.category)}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Aligned With</span>
            <p className="text-sm">{goal.alignedWith || 'Not specified'}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Start Date</span>
            <p className="text-sm">{formatDate(goal.startDate)}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Target Date</span>
            <p className="text-sm">{formatDate(goal.targetDate)}</p>
          </div>
        </div>
        
        {(isManager || !employeeId) && (
          <div className="flex space-x-2 mt-2">
            {goal.status !== 'completed' && goal.status !== 'cancelled' && (
              <Button 
                variant="success" 
                size="sm" 
                onClick={() => updateGoalStatus(goal.id, 'completed')}
              >
                Mark Complete
              </Button>
            )}
            {goal.status === 'draft' && (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => updateGoalStatus(goal.id, 'active')}
              >
                Activate Goal
              </Button>
            )}
            {goal.status === 'active' && (
              <Button 
                variant="warning" 
                size="sm" 
                onClick={() => updateGoalStatus(goal.id, 'on-hold')}
              >
                Put On Hold
              </Button>
            )}
            {goal.status !== 'cancelled' && (
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => updateGoalStatus(goal.id, 'cancelled')}
              >
                Cancel Goal
              </Button>
            )}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="goal-setting-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          {employeeId && userId !== employeeId ? "Employee Goals" : "My Goals"}
        </h2>
        {(isManager || !employeeId) && (
          <Button 
            variant="primary" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add New Goal'}
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-6">
          <h3 className="font-semibold mb-4">Create New Goal</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <Input
                  label="Goal Title"
                  name="title"
                  value={newGoal.title}
                  onChange={handleInputChange}
                  placeholder="Enter goal title"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <Input
                  label="Description"
                  name="description"
                  value={newGoal.description}
                  onChange={handleInputChange}
                  placeholder="Describe the goal and desired outcomes"
                  multiline
                  rows={3}
                  required
                />
              </div>
              
              <Select
                label="Category"
                name="category"
                value={newGoal.category}
                onChange={(value) => handleSelectChange('category', value)}
                options={categories}
                required
              />
              
              <Select
                label="Priority"
                name="priority"
                value={newGoal.priority}
                onChange={(value) => handleSelectChange('priority', value)}
                options={priorities}
                required
              />
              
              <Input
                label="Start Date"
                name="startDate"
                type="date"
                value={newGoal.startDate}
                onChange={handleInputChange}
                required
              />
              
              <Input
                label="Target Date"
                name="targetDate"
                type="date"
                value={newGoal.targetDate}
                onChange={handleInputChange}
                required
              />
              
              <div className="md:col-span-2">
                <Input
                  label="Aligned With (Company/Department Objective)"
                  name="alignedWith"
                  value={newGoal.alignedWith}
                  onChange={handleInputChange}
                  placeholder="Enter related company or department objective"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                loading={loading}
              >
                Save Goal
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="goals-list">
        {loading && <p>Loading goals...</p>}
        
        {!loading && goals.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No goals found.</p>
            {(isManager || !employeeId) && !showForm && (
              <Button 
                variant="outline" 
                onClick={() => setShowForm(true)} 
                className="mt-2"
              >
                Create your first goal
              </Button>
            )}
          </div>
        )}

        {!loading && goals.length > 0 && (
          <div>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Active Goals</h3>
              {goals.filter(goal => goal.status === 'active').map(renderGoalCard)}
              {goals.filter(goal => goal.status === 'active').length === 0 && (
                <p className="text-gray-500 text-sm py-2">No active goals</p>
              )}
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Draft Goals</h3>
              {goals.filter(goal => goal.status === 'draft').map(renderGoalCard)}
              {goals.filter(goal => goal.status === 'draft').length === 0 && (
                <p className="text-gray-500 text-sm py-2">No draft goals</p>
              )}
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2">Completed Goals</h3>
              {goals.filter(goal => goal.status === 'completed').map(renderGoalCard)}
              {goals.filter(goal => goal.status === 'completed').length === 0 && (
                <p className="text-gray-500 text-sm py-2">No completed goals</p>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">Other Goals</h3>
              {goals.filter(goal => 
                goal.status !== 'active' && 
                goal.status !== 'draft' && 
                goal.status !== 'completed'
              ).map(renderGoalCard)}
              {goals.filter(goal => 
                goal.status !== 'active' && 
                goal.status !== 'draft' && 
                goal.status !== 'completed'
              ).length === 0 && (
                <p className="text-gray-500 text-sm py-2">No other goals</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

GoalSetting.propTypes = {
  employeeId: PropTypes.string, // If viewing another employee's goals
  userId: PropTypes.string.isRequired, // Current user ID
  isManager: PropTypes.bool, // Whether current user is a manager
};

GoalSetting.defaultProps = {
  employeeId: null,
  isManager: false,
};

export default GoalSetting;