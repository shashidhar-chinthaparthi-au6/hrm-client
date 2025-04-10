import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Table from '../common/Table';
import Badge from '../common/Badge';
import { useToast } from '../../hooks/useToast';

const SkillMatrix = ({ employeeId, departmentId, isManager }) => {
  const [skills, setSkills] = useState([]);
  const [employeeSkills, setEmployeeSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(employeeId || '');
  const [isTeamView, setIsTeamView] = useState(false);
  const { showToast } = useToast();

  const skillCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'technical', label: 'Technical Skills' },
    { value: 'soft', label: 'Soft Skills' },
    { value: 'domain', label: 'Domain Knowledge' },
    { value: 'tools', label: 'Tools & Software' },
    { value: 'leadership', label: 'Leadership Skills' },
  ];

  const proficiencyLevels = [
    { value: 0, label: 'Not Applicable' },
    { value: 1, label: 'Basic' },
    { value: 2, label: 'Intermediate' },
    { value: 3, label: 'Advanced' },
    { value: 4, label: 'Expert' },
    { value: 5, label: 'Master' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch skills catalog
        const skillsResponse = await fetch('/api/skills');
        const skillsData = await skillsResponse.json();
        setSkills(skillsData);
        
        // If manager and team view, fetch department employees
        if (isManager && isTeamView) {
          const employeesResponse = await fetch(`/api/departments/${departmentId}/employees`);
          const employeesData = await employeesResponse.json();
          setEmployeeList(employeesData);
          
          // Fetch all department employee skills
          const deptSkillsResponse = await fetch(`/api/departments/${departmentId}/skills`);
          const deptSkillsData = await deptSkillsResponse.json();
          setEmployeeSkills(deptSkillsData);
        } else {
          // Fetch individual employee skills
          const empId = selectedEmployee || employeeId;
          const empSkillsResponse = await fetch(`/api/employees/${empId}/skills`);
          const empSkillsData = await empSkillsResponse.json();
          setEmployeeSkills(empSkillsData);
        }
      } catch (error) {
        console.error('Error fetching skill data:', error);
        showToast('Failed to load skill matrix data', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [departmentId, employeeId, isManager, isTeamView, selectedEmployee, showToast]);

  const handleProficiencyChange = async (skillId, proficiency) => {
    try {
      const empId = selectedEmployee || employeeId;
      const response = await fetch(`/api/employees/${empId}/skills/${skillId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ proficiency: parseInt(proficiency) })
      });
      
      if (response.ok) {
        // Update local state
        setEmployeeSkills(prev => 
          prev.map(skill => 
            skill.skillId === skillId && skill.employeeId === empId 
              ? { ...skill, proficiency: parseInt(proficiency) } 
              : skill
          )
        );
        showToast('Skill proficiency updated', 'success');
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error updating proficiency:', error);
      showToast('Failed to update skill proficiency', 'error');
    }
  };

  const handleAddSkill = async (newSkill) => {
    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSkill)
      });
      
      if (response.ok) {
        const addedSkill = await response.json();
        setSkills(prev => [...prev, addedSkill]);
        showToast('New skill added successfully', 'success');
        return true;
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      showToast('Failed to add new skill', 'error');
      return false;
    }
  };

  // Filter skills by category
  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  // Get employee's proficiency for a skill
  const getEmployeeProficiency = (skillId, empId) => {
    const found = employeeSkills.find(
      es => es.skillId === skillId && es.employeeId === (empId || selectedEmployee || employeeId)
    );
    return found ? found.proficiency : 0;
  };

  // Generate table data
  const getTableData = () => {
    return filteredSkills.map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description,
      proficiency: getEmployeeProficiency(skill.id)
    }));
  };

  // Generate team matrix data
  const getTeamMatrixData = () => {
    if (!isTeamView || employeeList.length === 0) return [];
    
    return filteredSkills.map(skill => {
      const employeesWithSkill = employeeSkills.filter(
        es => es.skillId === skill.id && es.proficiency > 0
      );
      
      const avgProficiency = employeesWithSkill.length > 0
        ? employeesWithSkill.reduce((sum, es) => sum + es.proficiency, 0) / employeesWithSkill.length
        : 0;
        
      return {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        coverage: employeesWithSkill.length / employeeList.length * 100,
        avgProficiency,
        experts: employeesWithSkill.filter(es => es.proficiency >= 4).length
      };
    });
  };

  // Columns for individual view
  const individualColumns = [
    { key: 'name', header: 'Skill Name', width: '25%' },
    { key: 'category', header: 'Category', width: '15%', 
      cell: (row) => {
        const category = skillCategories.find(cat => cat.value === row.category);
        return <Badge variant="info">{category ? category.label : row.category}</Badge>;
      }
    },
    { key: 'description', header: 'Description', width: '30%' },
    { key: 'proficiency', header: 'Proficiency', width: '30%',
      cell: (row) => (
        <div>
          <Select
            value={row.proficiency.toString()}
            onChange={(value) => handleProficiencyChange(row.id, value)}
            options={proficiencyLevels}
            disabled={!isManager && employeeId !== selectedEmployee}
          />
          <div className="mt-1 bg-gray-200 h-2 rounded-full">
            <div 
              className={`h-2 rounded-full ${
                row.proficiency === 0 ? 'bg-gray-400' :
                row.proficiency === 1 ? 'bg-red-400' :
                row.proficiency === 2 ? 'bg-yellow-400' :
                row.proficiency === 3 ? 'bg-blue-400' :
                row.proficiency === 4 ? 'bg-green-400' :
                'bg-purple-400'
              }`}
              style={{ width: `${(row.proficiency / 5) * 100}%` }}
            />
          </div>
        </div>
      )
    }
  ];

  // Columns for team view
  const teamColumns = [
    { key: 'name', header: 'Skill Name', width: '25%' },
    { key: 'category', header: 'Category', width: '15%',
      cell: (row) => {
        const category = skillCategories.find(cat => cat.value === row.category);
        return <Badge variant="info">{category ? category.label : row.category}</Badge>;
      }
    },
    { key: 'coverage', header: 'Team Coverage', width: '30%',
      cell: (row) => (
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Coverage: {row.coverage.toFixed(0)}%</span>
            <span>{row.experts} experts</span>
          </div>
          <div className="bg-gray-200 h-2 rounded-full">
            <div 
              className="bg-blue-400 h-2 rounded-full"
              style={{ width: `${row.coverage}%` }}
            />
          </div>
        </div>
      )
    },
    { key: 'avgProficiency', header: 'Avg. Proficiency', width: '30%',
      cell: (row) => (
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>{row.avgProficiency.toFixed(1)} / 5.0</span>
          </div>
          <div className="bg-gray-200 h-2 rounded-full">
            <div 
              className={`h-2 rounded-full ${
                row.avgProficiency < 1 ? 'bg-gray-400' :
                row.avgProficiency < 2 ? 'bg-red-400' :
                row.avgProficiency < 3 ? 'bg-yellow-400' :
                row.avgProficiency < 4 ? 'bg-green-400' :
                'bg-purple-400'
              }`} 
              style={{ width: `${(row.avgProficiency / 5) * 100}%` }}
            />
          </div>
        </div>
      )
    }
  ];

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkillData, setNewSkillData] = useState({
    name: '',
    category: 'technical',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSkillData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewSkill = async (e) => {
    e.preventDefault();
    const success = await handleAddSkill(newSkillData);
    if (success) {
      setNewSkillData({
        name: '',
        category: 'technical',
        description: ''
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="skill-matrix-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Skill Matrix</h2>
        <div className="flex space-x-2">
          {isManager && (
            <Button
              variant="outline"
              onClick={() => setIsTeamView(!isTeamView)}
            >
              {isTeamView ? 'Individual View' : 'Team View'}
            </Button>
          )}
          {isManager && (
            <Button
              variant="primary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel' : 'Add Skill'}
            </Button>
          )}
        </div>
      </div>

      {/* Add new skill form */}
      {showAddForm && (
        <Card className="mb-6">
          <h3 className="font-semibold mb-4">Add New Skill</h3>
          <form onSubmit={handleSubmitNewSkill}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Skill Name"
                name="name"
                value={newSkillData.name}
                onChange={handleInputChange}
                placeholder="Enter skill name"
                required
              />
              
              <Select
                label="Category"
                name="category"
                value={newSkillData.category}
                onChange={(value) => setNewSkillData(prev => ({ ...prev, category: value }))}
                options={skillCategories.filter(cat => cat.value !== 'all')}
                required
              />
              
              <div className="md:col-span-2">
                <Input
                  label="Description"
                  name="description"
                  value={newSkillData.description}
                  onChange={handleInputChange}
                  placeholder="Briefly describe this skill"
                  multiline
                  rows={3}
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
              >
                Save Skill
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="md:w-1/3">
          <Select
            label="Category Filter"
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={skillCategories}
          />
        </div>
        
        {isManager && (
          <div className="md:w-1/3">
            <Select
              label="Employee"
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              options={[
                { value: employeeId, label: 'Self Assessment' },
                ...(employeeList.map(emp => ({ 
                  value: emp.id, 
                  label: `${emp.firstName} ${emp.lastName}` 
                })))
              ]}
              disabled={isTeamView}
            />
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">Loading skill matrix...</div>
      ) : (
        <>
          {isTeamView ? (
            <Table
              columns={teamColumns}
              data={getTeamMatrixData()}
              emptyMessage="No skills found for this category"
              showPagination={getTeamMatrixData().length > 10}
              pageSize={10}
            />
          ) : (
            <Table
              columns={individualColumns}
              data={getTableData()}
              emptyMessage="No skills found for this category"
              showPagination={getTableData().length > 10}
              pageSize={10}
            />
          )}
        </>
      )}
    </div>
  );
};

SkillMatrix.propTypes = {
  employeeId: PropTypes.string.isRequired,
  departmentId: PropTypes.string,
  isManager: PropTypes.bool
};

SkillMatrix.defaultProps = {
  departmentId: '',
  isManager: false
};

export default SkillMatrix;