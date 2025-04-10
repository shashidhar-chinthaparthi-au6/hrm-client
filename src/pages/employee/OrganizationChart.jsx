import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Box, Typography, Paper } from '@mui/material';
import { Tree, TreeNode } from 'react-organizational-chart';
import Card from '../../components/common/Card';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import Avatar from '../../components/common/Avatar';

const OrganizationChart = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orgData, setOrgData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [viewMode, setViewMode] = useState('dept'); // 'dept' or 'hierarchy'
  
  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        setLoading(true);
        
        // Fetch departments
        const deptRes = await axios.get('/api/departments');
        setDepartments([{ id: 'all', name: 'All Departments' }, ...deptRes.data]);
        
        // Fetch organization data
        const res = await axios.get(`/api/organization/chart?departmentId=${selectedDepartment}&viewMode=${viewMode}`);
        setOrgData(res.data);
        
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load organization chart');
        setLoading(false);
        console.error('Error fetching organization data:', error);
      }
    };
    
    fetchOrgData();
  }, [selectedDepartment, viewMode]);
  
  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };
  
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };
  
  const handleEmployeeClick = (employeeId) => {
    navigate(`/employee/employee-details/${employeeId}`);
  };
  
  const renderEmployeeNode = (employee) => {
    return (
      <div 
        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer min-w-60"
        onClick={() => handleEmployeeClick(employee.id)}
      >
        <div className="flex items-center gap-3">
          <Avatar 
            src={employee.avatar} 
            name={`${employee.firstName} ${employee.lastName}`} 
            size="md" 
          />
          <div>
            <h3 className="font-medium text-gray-800">{`${employee.firstName} ${employee.lastName}`}</h3>
            <p className="text-sm text-gray-600">{employee.designation}</p>
            {employee.department && (
              <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                {employee.department}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const renderOrgChart = (data) => {
    if (!data) return null;
    
    const renderTreeNodes = (node) => {
      if (!node.children || node.children.length === 0) {
        return <TreeNode label={renderEmployeeNode(node)} />;
      }
      
      return (
        <TreeNode label={renderEmployeeNode(node)}>
          {node.children.map((child) => renderTreeNodes(child))}
        </TreeNode>
      );
    };
    
    if (viewMode === 'dept') {
      return (
        <div className="space-y-8">
          {data.map((dept) => (
            <Card key={dept.id} title={dept.name}>
              <div className="overflow-x-auto py-4">
                <Tree 
                  lineWidth="2px"
                  lineColor="#E5E7EB"
                  lineBorderRadius="10px"
                  label={
                    <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 shadow-sm">
                      <h3 className="font-medium text-gray-800">{dept.name}</h3>
                      <p className="text-sm text-gray-600">Department Head</p>
                    </div>
                  }
                >
                  {dept.employees.map((emp) => renderTreeNodes(emp))}
                </Tree>
              </div>
            </Card>
          ))}
        </div>
      );
    } else {
      return (
        <Card>
          <div className="overflow-x-auto py-4">
            <Tree 
              lineWidth="2px"
              lineColor="#E5E7EB"
              lineBorderRadius="10px"
              label={renderEmployeeNode(data)}
            >
              {data.children && data.children.map((child) => renderTreeNodes(child))}
            </Tree>
          </div>
        </Card>
      );
    }
  };
  
  return (
    <div className="px-6 py-8">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Organization Chart', path: '' }
        ]}
      />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Organization Chart</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            label="Department"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            options={departments.map(dept => ({ value: dept.id, label: dept.name }))}
            className="w-full sm:w-48"
          />
          
          <div className="flex items-center gap-2">
            <Button 
              variant={viewMode === 'dept' ? 'primary' : 'outline'}
              onClick={() => handleViewModeChange('dept')}
              size="sm"
            >
              Department View
            </Button>
            <Button 
              variant={viewMode === 'hierarchy' ? 'primary' : 'outline'}
              onClick={() => handleViewModeChange('hierarchy')}
              size="sm"
            >
              Hierarchy View
            </Button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">Loading organization chart...</div>
      ) : (
        <div className="org-chart-container overflow-x-auto pb-10">
          {renderOrgChart(orgData)}
        </div>
      )}
      
      <div className="bg-blue-50 p-4 rounded-lg mt-8">
        <h3 className="font-medium text-blue-700 mb-2">Chart Navigation</h3>
        <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
          <li>Click on any employee card to view their detailed profile</li>
          <li>Use the Department filter to focus on specific teams</li>
          <li>Switch between Department and Hierarchy views to change perspective</li>
          <li>Scroll or drag to navigate large organization charts</li>
        </ul>
      </div>
    </div>
  );
};

export default OrganizationChart;