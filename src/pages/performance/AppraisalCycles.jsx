import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Button,
  Modal,
  Input,
  Select,
  DatePicker,
  Form,
  Tabs,
  Progress,
  Badge,
  message
} from '../../components/common';
import { fetchAppraisalCycles, createAppraisalCycle, updateAppraisalCycle } from '../../redux/actions/performanceActions';

const AppraisalCycles = () => {
  const dispatch = useDispatch();
  const { appraisalCycles, loading, error } = useSelector(state => state.performance);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAppraisalCycles());
  }, [dispatch]);

  const handleCreateCycle = (values) => {
    if (isEditMode && selectedCycle) {
      dispatch(updateAppraisalCycle({ ...selectedCycle, ...values }));
      message.success('Appraisal cycle updated successfully');
    } else {
      dispatch(createAppraisalCycle(values));
      message.success('Appraisal cycle created successfully');
    }
    
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedCycle(null);
    form.resetFields();
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setSelectedCycle(record);
    
    form.setFieldsValue({
      name: record.name,
      startDate: record.startDate,
      endDate: record.endDate,
      reviewers: record.reviewers,
      reviewType: record.reviewType,
      eligibleDepartments: record.eligibleDepartments,
      description: record.description,
    });
    
    setIsModalOpen(true);
  };

  const handleDuplicate = (record) => {
    setIsEditMode(false);
    setSelectedCycle(null);
    
    form.setFieldsValue({
      name: `Copy of ${record.name}`,
      startDate: record.startDate,
      endDate: record.endDate,
      reviewers: record.reviewers,
      reviewType: record.reviewType,
      eligibleDepartments: record.eligibleDepartments,
      description: record.description,
    });
    
    setIsModalOpen(true);
  };

  const getCycleStatus = (record) => {
    const today = new Date();
    const startDate = new Date(record.startDate);
    const endDate = new Date(record.endDate);
    
    if (today < startDate) return { status: 'upcoming', text: 'Upcoming' };
    if (today > endDate) return { status: 'completed', text: 'Completed' };
    return { status: 'active', text: 'Active' };
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'upcoming': return 'blue';
      case 'completed': return 'gray';
      default: return 'blue';
    }
  };

  const calculateProgress = (record) => {
    if (!record.startDate || !record.endDate) return 0;
    
    const startDate = new Date(record.startDate);
    const endDate = new Date(record.endDate);
    const today = new Date();
    
    if (today < startDate) return 0;
    if (today > endDate) return 100;
    
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const daysPassed = (today - startDate) / (1000 * 60 * 60 * 24);
    return Math.round((daysPassed / totalDays) * 100);
  };

  const cycleColumns = [
    {
      title: 'Cycle Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <div><strong>{text}</strong></div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {new Date(record.startDate).toLocaleDateString()} - {new Date(record.endDate).toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const { status, text } = getCycleStatus(record);
        return <Badge color={getBadgeColor(status)} text={text} />;
      }
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => <Progress percent={calculateProgress(record)} size="small" />
    },
    {
      title: 'Review Type',
      dataIndex: 'reviewType',
      key: 'reviewType',
    },
    {
      title: 'Participants',
      dataIndex: 'participantCount',
      key: 'participantCount',
    },
    {
      title: 'Completion',
      dataIndex: 'completionRate',
      key: 'completionRate',
      render: (text) => `${text}%`
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" onClick={() => handleDuplicate(record)}>Duplicate</Button>
          <Button 
            type="link" 
            disabled={getCycleStatus(record).status === 'completed'}
          >
            Manage
          </Button>
        </div>
      ),
    },
  ];

  const templateColumns = [
    {
      title: 'Template Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Last Modified',
      dataIndex: 'lastModified',
      key: 'lastModified',
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Review Type',
      dataIndex: 'reviewType',
      key: 'reviewType',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <>
          <Button type="link">Edit</Button>
          <Button type="link">Preview</Button>
          <Button type="link">Duplicate</Button>
        </>
      ),
    },
  ];

  if (loading) return <div>Loading appraisal cycles...</div>;
  if (error) return <div>Error loading appraisal cycles: {error}</div>;

  return (
    <div className="appraisal-cycles-container">
      <h1>Appraisal Cycles</h1>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="Appraisal Cycles" key="1">
          <Card 
            title="Appraisal Cycles" 
            extra={<Button type="primary" onClick={() => {
              setIsEditMode(false);
              setSelectedCycle(null);
              form.resetFields();
              setIsModalOpen(true);
            }}>Create New Cycle</Button>}
          >
            <Table 
              columns={cycleColumns} 
              dataSource={appraisalCycles?.cycles || []} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Tabs.TabPane>
        
        <Tabs.TabPane tab="Review Templates" key="2">
          <Card 
            title="Review Templates" 
            extra={<Button type="primary">Create New Template</Button>}
          >
            <Table 
              columns={templateColumns} 
              dataSource={appraisalCycles?.templates || []} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Tabs.TabPane>
        
        <Tabs.TabPane tab="Review Settings" key="3">
          <Card title="Default Review Settings">
            <Form layout="vertical" initialValues={appraisalCycles?.settings}>
              <Form.Item name="defaultReviewCycle" label="Default Review Cycle">
                <Select
                  options={[
                    { value: 'quarterly', label: 'Quarterly' },
                    { value: 'biannual', label: 'Bi-Annual' },
                    { value: 'annual', label: 'Annual' },
                  ]}
                />
              </Form.Item>
              
              <Form.Item name="defaultReviewers" label="Default Reviewers">
                <Select
                  mode="multiple"
                  options={[
                    { value: 'direct_manager', label: 'Direct Manager' },
                    { value: 'department_head', label: 'Department Head' },
                    { value: 'hr_manager', label: 'HR Manager' },
                  ]}
                />
              </Form.Item>
              
              <Form.Item name="notificationDays" label="Notification Days Before Cycle End">
                <Input type="number" min={1} max={30} />
              </Form.Item>
              
              <Form.Item name="allowSelfReview" label="Allow Self-Review" valuePropName="checked">
                <Input type="checkbox" />
              </Form.Item>
              
              <Form.Item name="requireManagerApproval" label="Require Manager Approval" valuePropName="checked">
                <Input type="checkbox" />
              </Form.Item>
              
              <Form.Item name="showRatingsToEmployees" label="Show Ratings to Employees" valuePropName="checked">
                <Input type="checkbox" />
              </Form.Item>
              
              <Button type="primary" htmlType="submit">
                Save Settings
              </Button>
            </Form>
          </Card>
        </Tabs.TabPane>
      </Tabs>
      
      <Modal
        title={isEditMode ? "Edit Appraisal Cycle" : "Create Appraisal Cycle"}
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setSelectedCycle(null);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateCycle}
        >
          <Form.Item
            name="name"
            label="Cycle Name"
            rules={[{ required: true, message: 'Please enter cycle name' }]}
          >
            <Input placeholder="Enter cycle name" />
          </Form.Item>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: 'Please select start date' }]}
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: 'Please select end date' }]}
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>
          
          <Form.Item
            name="reviewType"
            label="Review Type"
            rules={[{ required: true, message: 'Please select review type' }]}
          >
            <Select
              options={[
                { value: '360_review', label: '360° Review' },
                { value: 'manager_review', label: 'Manager Review' },
                { value: 'peer_review', label: 'Peer Review' },
                { value: 'self_assessment', label: 'Self Assessment' },
              ]}
              placeholder="Select review type"
            />
          </Form.Item>
          
          <Form.Item
            name="reviewers"
            label="Default Reviewers"
            rules={[{ required: true, message: 'Please select reviewers' }]}
          >
            <Select
              mode="multiple"
              options={[
                { value: 'direct_manager', label: 'Direct Manager' },
                { value: 'department_head', label: 'Department Head' },
                { value: 'hr_manager', label: 'HR Manager' },
                { value: 'peers', label: 'Peers' },
              ]}
              placeholder="Select reviewers"
            />
          </Form.Item>
          
          <Form.Item
            name="eligibleDepartments"
            label="Eligible Departments"
            rules={[{ required: true, message: 'Please select departments' }]}
          >
            <Select
              mode="multiple"
              options={[
                { value: 'engineering', label: 'Engineering' },
                { value: 'product', label: 'Product' },
                { value: 'design', label: 'Design' },
                { value: 'marketing', label: 'Marketing' },
                { value: 'sales', label: 'Sales' },
                { value: 'hr', label: 'Human Resources' },
                { value: 'finance', label: 'Finance' },
                { value: 'all', label: 'All Departments' },
              ]}
              placeholder="Select departments"
            />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={4} placeholder="Enter description" />
          </Form.Item>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button 
              onClick={() => {
                setIsModalOpen(false);
                setIsEditMode(false);
                setSelectedCycle(null);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {isEditMode ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AppraisalCycles;