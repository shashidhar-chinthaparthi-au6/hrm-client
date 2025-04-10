import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Form, Input, Select, Switch, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/common/PageHeader';

const LeaveSettings = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [holidayModalVisible, setHolidayModalVisible] = useState(false);
  const [holidayForm] = Form.useForm();
  const [holidays, setHolidays] = useState([]);
  const [activeTab, setActiveTab] = useState('leaveTypes');

  // Fetch leave types and holidays on component mount
  useEffect(() => {
    fetchLeaveTypes();
    fetchHolidays();
  }, []);

  const fetchLeaveTypes = async () => {
    setLoading(true);
    try {
      // Simulated API call
      // const response = await api.getLeaveTypes();
      // setLeaveTypes(response.data);
      
      // Mock data
      setLeaveTypes([
        {
          id: 1,
          name: 'Casual Leave',
          code: 'CL',
          defaultDays: 12,
          carryForward: true,
          maxCarryForward: 5,
          applicableFor: 'All Employees',
          status: true,
        },
        {
          id: 2,
          name: 'Sick Leave',
          code: 'SL',
          defaultDays: 8,
          carryForward: false,
          maxCarryForward: 0,
          applicableFor: 'All Employees',
          status: true,
        },
        {
          id: 3,
          name: 'Maternity Leave',
          code: 'ML',
          defaultDays: 180,
          carryForward: false,
          maxCarryForward: 0,
          applicableFor: 'Female Employees',
          status: true,
        }
      ]);
    } catch (error) {
      message.error('Failed to fetch leave types');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHolidays = async () => {
    try {
      // Simulated API call
      // const response = await api.getHolidays();
      // setHolidays(response.data);
      
      // Mock data
      setHolidays([
        {
          id: 1,
          name: 'New Year',
          date: '2025-01-01',
          description: 'New Year Day Celebration',
          optional: false,
        },
        {
          id: 2,
          name: 'Independence Day',
          date: '2025-08-15',
          description: 'National Holiday',
          optional: false,
        },
        {
          id: 3,
          name: 'Diwali',
          date: '2025-11-12',
          description: 'Festival of Lights',
          optional: false,
        }
      ]);
    } catch (error) {
      message.error('Failed to fetch holidays');
      console.error(error);
    }
  };

  const handleAddLeaveType = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditLeaveType = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      defaultDays: record.defaultDays,
      carryForward: record.carryForward,
      maxCarryForward: record.maxCarryForward,
      applicableFor: record.applicableFor,
      status: record.status,
    });
    setModalVisible(true);
  };

  const handleDeleteLeaveType = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this leave type?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        setLeaveTypes(leaveTypes.filter(type => type.id !== id));
        message.success('Leave type deleted successfully');
      }
    });
  };

  const handleSaveLeaveType = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingId) {
        // Update existing leave type
        setLeaveTypes(leaveTypes.map(type => 
          type.id === editingId ? { ...type, ...values } : type
        ));
        message.success('Leave type updated successfully');
      } else {
        // Add new leave type
        const newLeaveType = {
          id: Date.now(),
          ...values,
        };
        setLeaveTypes([...leaveTypes, newLeaveType]);
        message.success('Leave type added successfully');
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleAddHoliday = () => {
    holidayForm.resetFields();
    setHolidayModalVisible(true);
  };

  const handleSaveHoliday = async () => {
    try {
      const values = await holidayForm.validateFields();
      
      const newHoliday = {
        id: Date.now(),
        ...values,
      };
      
      setHolidays([...holidays, newHoliday]);
      setHolidayModalVisible(false);
      message.success('Holiday added successfully');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleDeleteHoliday = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this holiday?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        setHolidays(holidays.filter(holiday => holiday.id !== id));
        message.success('Holiday deleted successfully');
      }
    });
  };

  const leaveTypeColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Default Days',
      dataIndex: 'defaultDays',
      key: 'defaultDays',
    },
    {
      title: 'Carry Forward',
      dataIndex: 'carryForward',
      key: 'carryForward',
      render: (carryForward) => (carryForward ? 'Yes' : 'No'),
    },
    {
      title: 'Max Carry Forward',
      dataIndex: 'maxCarryForward',
      key: 'maxCarryForward',
    },
    {
      title: 'Applicable For',
      dataIndex: 'applicableFor',
      key: 'applicableFor',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status ? 'Active' : 'Inactive'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditLeaveType(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteLeaveType(record.id)}
          />
        </>
      ),
    },
  ];

  const holidayColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Optional',
      dataIndex: 'optional',
      key: 'optional',
      render: (optional) => (optional ? 'Yes' : 'No'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteHoliday(record.id)}
          />
        </>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Leave Settings"
        breadcrumb={[
          { path: '/dashboard', name: 'Dashboard' },
          { path: '/leave', name: 'Leave Management' },
          { path: '/leave/settings', name: 'Leave Settings' }
        ]}
      />

      <div className="settings-tabs">
        <div className="tab-buttons">
          <Button 
            type={activeTab === 'leaveTypes' ? 'primary' : 'default'}
            onClick={() => setActiveTab('leaveTypes')}
          >
            Leave Types
          </Button>
          <Button 
            type={activeTab === 'holidays' ? 'primary' : 'default'}
            onClick={() => setActiveTab('holidays')}
          >
            Holidays
          </Button>
          <Button 
            type={activeTab === 'policies' ? 'primary' : 'default'}
            onClick={() => setActiveTab('policies')}
          >
            Leave Policies
          </Button>
        </div>

        {activeTab === 'leaveTypes' && (
          <Card 
            title="Leave Types" 
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddLeaveType}
              >
                Add Leave Type
              </Button>
            }
          >
            <Table 
              columns={leaveTypeColumns} 
              dataSource={leaveTypes}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        )}

        {activeTab === 'holidays' && (
          <Card 
            title="Holidays" 
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleAddHoliday}
              >
                Add Holiday
              </Button>
            }
          >
            <Table 
              columns={holidayColumns} 
              dataSource={holidays}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        )}

        {activeTab === 'policies' && (
          <Card title="Leave Policies">
            <Form layout="vertical">
              <Form.Item label="Probation Period Leave Rules" name="probationRules">
                <Select defaultValue="prorated" style={{ width: 300 }}>
                  <Select.Option value="prorated">Prorated based on joining date</Select.Option>
                  <Select.Option value="after">Available after probation period</Select.Option>
                  <Select.Option value="none">No leaves during probation</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Weekend Policy" name="weekendPolicy">
                <Select defaultValue="exclude" style={{ width: 300 }}>
                  <Select.Option value="exclude">Exclude weekends from leave count</Select.Option>
                  <Select.Option value="include">Include weekends in leave count</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Holiday Policy" name="holidayPolicy">
                <Select defaultValue="exclude" style={{ width: 300 }}>
                  <Select.Option value="exclude">Exclude holidays from leave count</Select.Option>
                  <Select.Option value="include">Include holidays in leave count</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Minimum Leave Duration" name="minDuration">
                <Select defaultValue="halfDay" style={{ width: 300 }}>
                  <Select.Option value="halfDay">Half Day</Select.Option>
                  <Select.Option value="fullDay">Full Day</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Year Start Month" name="yearStartMonth">
                <Select defaultValue="january" style={{ width: 300 }}>
                  <Select.Option value="january">January</Select.Option>
                  <Select.Option value="april">April</Select.Option>
                  <Select.Option value="july">July</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary">Save Policy Settings</Button>
              </Form.Item>
            </Form>
          </Card>
        )}
      </div>

      {/* Leave Type Modal */}
      <Modal
        title={editingId ? "Edit Leave Type" : "Add Leave Type"}
        visible={modalVisible}
        onOk={handleSaveLeaveType}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="name" 
            label="Leave Type Name" 
            rules={[{ required: true, message: 'Please enter leave type name' }]}
          >
            <Input placeholder="e.g. Casual Leave" />
          </Form.Item>
          
          <Form.Item 
            name="code" 
            label="Leave Code" 
            rules={[{ required: true, message: 'Please enter leave code' }]}
          >
            <Input placeholder="e.g. CL" />
          </Form.Item>
          
          <Form.Item 
            name="defaultDays" 
            label="Default Days" 
            rules={[{ required: true, message: 'Please enter default days' }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          
          <Form.Item 
            name="carryForward" 
            label="Allow Carry Forward" 
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item 
            name="maxCarryForward" 
            label="Max Carry Forward Days"
          >
            <Input type="number" min={0} />
          </Form.Item>
          
          <Form.Item 
            name="applicableFor" 
            label="Applicable For" 
            rules={[{ required: true, message: 'Please select applicable employees' }]}
          >
            <Select>
              <Select.Option value="All Employees">All Employees</Select.Option>
              <Select.Option value="Male Employees">Male Employees</Select.Option>
              <Select.Option value="Female Employees">Female Employees</Select.Option>
              <Select.Option value="Permanent Employees">Permanent Employees</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="status" 
            label="Status" 
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Holiday Modal */}
      <Modal
        title="Add Holiday"
        visible={holidayModalVisible}
        onOk={handleSaveHoliday}
        onCancel={() => setHolidayModalVisible(false)}
      >
        <Form form={holidayForm} layout="vertical">
          <Form.Item 
            name="name" 
            label="Holiday Name" 
            rules={[{ required: true, message: 'Please enter holiday name' }]}
          >
            <Input placeholder="e.g. New Year" />
          </Form.Item>
          
          <Form.Item 
            name="date" 
            label="Date" 
            rules={[{ required: true, message: 'Please enter date' }]}
          >
            <Input type="date" />
          </Form.Item>
          
          <Form.Item 
            name="description" 
            label="Description"
          >
            <Input.TextArea rows={3} placeholder="Holiday description" />
          </Form.Item>
          
          <Form.Item 
            name="optional" 
            label="Optional Holiday" 
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default LeaveSettings;