import React, { useState, useEffect } from 'react';
import { Edit, Mail, Phone, MapPin, Calendar, Briefcase, Award, Book } from 'lucide-react';
import Avatar from '../common/Avatar';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import EmployeeForm from './EmployeeForm';

const EmployeeProfile = ({ employeeId }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch(`/api/employees/${employeeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }
        const data = await response.json();
        setEmployee(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [employeeId]);

  const handleEditSubmit = async (updatedData) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update employee');
      }
      
      const updatedEmployee = await response.json();
      setEmployee(updatedEmployee);
      setShowEditModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (!employee) {
    return <div className="p-4">No employee found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar 
            src={employee.profileImage} 
            alt={employee.name} 
            size="xl" 
            className="border-4 border-blue-100"
          />
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{employee.name}</h1>
                <p className="text-gray-600">{employee.designation}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    ID: {employee.employeeId}
                  </div>
                  <div className={`${employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs px-2 py-1 rounded-full`}>
                    {employee.status}
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-1"
              >
                <Edit size={16} />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="col-span-1">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p>{employee.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p>{employee.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p>{employee.dateOfBirth}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Work Information */}
        <Card className="col-span-1">
          <h2 className="text-lg font-semibold mb-4">Work Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Briefcase size={20} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p>{employee.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award size={20} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p>{employee.designation}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Joining Date</p>
                <p>{employee.joiningDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase size={20} className="text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p>{employee.experience} years</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Skills & Qualifications */}
        <Card className="col-span-1">
          <h2 className="text-lg font-semibold mb-4">Skills & Qualifications</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {employee.skills?.map((skill, index) => (
                  <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Education</p>
              {employee.education?.map((edu, index) => (
                <div key={index} className="flex items-start gap-3 mb-3">
                  <Book size={20} className="text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-xs text-gray-500">{edu.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Employee Profile"
      >
        <EmployeeForm 
          initialData={employee} 
          onSubmit={handleEditSubmit} 
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </div>
  );
};

export default EmployeeProfile;