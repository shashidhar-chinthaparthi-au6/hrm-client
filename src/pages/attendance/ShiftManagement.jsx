import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Modal, Select, DatePicker, Table, Badge } from '../components/common';
import { fetchShifts, createShift, updateShift, deleteShift } from '../redux/actions/shiftActions';
import { getAllEmployees } from '../redux/actions/employeeActions';
import { Loader } from '../../components/common/Loader';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import './ShiftManagement.scss';

const ShiftManagement = () => {
  const dispatch = useDispatch();
  const { shifts, loading, error } = useSelector((state) => state.shifts);
  const { employees } = useSelector((state) => state.employees);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentShift, setCurrentShift] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterMonth, setFilterMonth] = useState(new Date());
  
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    description: '',
    employees: [],
    daysOfWeek: [], // 0-6, Sunday to Saturday
    color: '#3B82F6', // Default blue color
  });

  useEffect(() => {
    dispatch(fetchShifts());
    dispatch(getAllEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (currentShift) {
      setFormData({
        name: currentShift.name,
        startTime: currentShift.startTime,
        endTime: currentShift.endTime,
        description: currentShift.description,
        employees: currentShift.employees || [],
        daysOfWeek: currentShift.daysOfWeek || [],
        color: currentShift.color || '#3B82F6',
      });
    }
  }, [currentShift]);

  const handleOpenModal = (mode, shift = null) => {
    setModalMode(mode);
    setCurrentShift(shift);
    if (mode === 'create') {
      setFormData({
        name: '',
        startTime: '',
        endTime: '',
        description: '',
        employees: [],
        daysOfWeek: [],
        color: '#3B82F6',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentShift(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmployeeChange = (selectedEmployees) => {
    setFormData({
      ...formData,
      employees: selectedEmployees,
    });
  };

  const handleDayToggle = (day) => {
    const newDays = [...formData.daysOfWeek];
    if (newDays.includes(day)) {
      setFormData({
        ...formData,
        daysOfWeek: newDays.filter(d => d !== day),
      });
    } else {
      setFormData({
        ...formData,
        daysOfWeek: [...newDays, day],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.startTime || !formData.endTime) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (modalMode === 'create') {
      dispatch(createShift(formData))
        .then(() => {
          toast.success('Shift created successfully');
          handleCloseModal();
        })
        .catch((err) => {
          toast.error('Failed to create shift');
        });
    } else {
      dispatch(updateShift(currentShift.id, formData))
        .then(() => {
          toast.success('Shift updated successfully');
          handleCloseModal();
        })
        .catch((err) => {
          toast.error('Failed to update shift');
        });
    }
  };

  const handleDeleteShift = (shiftId) => {
    if (window.confirm('Are you sure you want to delete this shift?')) {
      dispatch(deleteShift(shiftId))
        .then(() => {
          toast.success('Shift deleted successfully');
        })
        .catch((err) => {
          toast.error('Failed to delete shift');
        });
    }
  };

  const columns = [
    {
      title: 'Shift Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <div 
            className="shift-color-indicator mr-2" 
            style={{ backgroundColor: record.color }}
          />
          <span>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Timing',
      dataIndex: 'startTime',
      key: 'timing',
      render: (_, record) => `${record.startTime} - ${record.endTime}`,
    },
    {
      title: 'Days',
      dataIndex: 'daysOfWeek',
      key: 'days',
      render: (days) => {
        const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days.map(day => dayMap[day]).join(', ');
      },
    },
    {
      title: 'Employees',
      dataIndex: 'employees',
      key: 'employees',
      render: (employees) => <span>{employees?.length || 0} assigned</span>,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Badge 
          type={record.isActive ? 'success' : 'gray'} 
          text={record.isActive ? 'Active' : 'Inactive'} 
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button 
            type="primary" 
            icon={<FaEdit />} 
            size="small"
            onClick={() => handleOpenModal('edit', record)}
          />
          <Button 
            type="danger" 
            icon={<FaTrash />} 
            size="small"
            onClick={() => handleDeleteShift(record.id)}
          />
        </div>
      ),
    },
  ];

  const dayOptions = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  if (loading) return <Loader />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="shift-management">
      <div className="page-header">
        <h1>Shift Management</h1>
        <Button 
          type="primary" 
          icon={<FaPlus />} 
          onClick={() => handleOpenModal('create')}
        >
          Create Shift
        </Button>
      </div>

      <div className="filters mb-4">
        <div className="flex flex-wrap gap-4">
          <div className="filter-item">
            <Select
              label="Department"
              value={filterDepartment}
              onChange={(value) => setFilterDepartment(value)}
              options={[
                { value: 'all', label: 'All Departments' },
                { value: 'engineering', label: 'Engineering' },
                { value: 'hr', label: 'Human Resources' },
                { value: 'marketing', label: 'Marketing' },
                { value: 'sales', label: 'Sales' },
              ]}
            />
          </div>
          <div className="filter-item">
            <DatePicker
              label="Month"
              value={filterMonth}
              onChange={(date) => setFilterMonth(date)}
              format="MM/YYYY"
              picker="month"
            />
          </div>
        </div>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={shifts}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={modalMode === 'create' ? 'Create New Shift' : 'Edit Shift'}
        visible={showModal}
        onClose={handleCloseModal}
        width="600px"
      >
        <form onSubmit={handleSubmit} className="shift-form">
          <div className="form-group">
            <label htmlFor="name">Shift Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Morning Shift"
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="startTime">Start Time*</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group half">
              <label htmlFor="endTime">End Time*</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Days of Week</label>
            <div className="day-selector">
              {dayOptions.map((day) => (
                <div 
                  key={day.value}
                  className={`day-option ${formData.daysOfWeek.includes(day.value) ? 'selected' : ''}`}
                  onClick={() => handleDayToggle(day.value)}
                >
                  {day.label.substring(0, 3)}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="color">Shift Color</label>
            <input
              type="color"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="employees">Assign Employees</label>
            <Select
              mode="multiple"
              placeholder="Select employees"
              value={formData.employees}
              onChange={handleEmployeeChange}
              options={employees.map(emp => ({
                value: emp.id,
                label: `${emp.firstName} ${emp.lastName}`,
              }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Shift description"
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <Button type="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {modalMode === 'create' ? 'Create Shift' : 'Update Shift'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ShiftManagement;