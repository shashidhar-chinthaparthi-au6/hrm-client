// PayrollProcess.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import Table from '../common/Table';
import Select from '../common/Select';
import DatePicker from '../common/DatePicker';
import Modal from '../common/Modal';

const PayrollProcess = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [department, setDepartment] = useState('all');
  
  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operations', label: 'Operations' }
  ];

  useEffect(() => {
    // Fetch employees that need payroll processing
    const fetchEmployees = async () => {
      try {
        // API call would go here
        // const response = await api.get('/employees/payroll-eligible');
        // Mock data for demonstration
        const mockEmployees = [
          { id: 1, name: 'John Doe', department: 'Engineering', salary: 75000, attendance: 22, leaves: 1, overtime: 5 },
          { id: 2, name: 'Jane Smith', department: 'HR', salary: 65000, attendance: 21, leaves: 2, overtime: 0 },
          { id: 3, name: 'Mike Johnson', department: 'Finance', salary: 85000, attendance: 23, leaves: 0, overtime: 3 },
          { id: 4, name: 'Sarah Williams', department: 'Marketing', salary: 60000, attendance: 20, leaves: 3, overtime: 2 },
          { id: 5, name: 'Alex Brown', department: 'Engineering', salary: 80000, attendance: 23, leaves: 0, overtime: 7 },
        ];
        
        setEmployees(mockEmployees);
      } catch (error) {
        toast.error('Failed to fetch employees');
        console.error(error);
      }
    };

    fetchEmployees();
  }, [selectedMonth, department]);

  const handleProcessPayroll = async () => {
    setIsProcessing(true);
    try {
      // API call would go here
      // await api.post('/payroll/process', { month: selectedMonth, department });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Payroll processed successfully');
      setShowConfirmModal(false);
    } catch (error) {
      toast.error('Failed to process payroll');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredEmployees = department === 'all' 
    ? employees 
    : employees.filter(emp => emp.department.toLowerCase() === department);

  const columns = [
    { header: 'Employee ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Department', accessor: 'department' },
    { header: 'Base Salary', accessor: 'salary', cell: (row) => `$${row.salary.toLocaleString()}` },
    { header: 'Attendance', accessor: 'attendance' },
    { header: 'Leaves', accessor: 'leaves' },
    { header: 'Overtime (hrs)', accessor: 'overtime' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: () => <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pending</span>
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Process Payroll</h2>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-64">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
          <DatePicker 
            value={selectedMonth}
            onChange={setSelectedMonth}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
          />
        </div>
        
        <div className="w-64">
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <Select 
            options={departmentOptions}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
      </div>
      
      <Table 
        columns={columns}
        data={filteredEmployees}
        emptyMessage="No employees found for payroll processing"
      />
      
      <div className="mt-6 flex justify-end">
        <Button 
          label="Process Payroll"
          onClick={() => setShowConfirmModal(true)}
          primary
          disabled={filteredEmployees.length === 0}
        />
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Payroll Processing"
      >
        <div className="p-6">
          <p className="mb-4">Are you sure you want to process payroll for {filteredEmployees.length} employees for {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}?</p>
          <p className="mb-6 text-sm text-gray-600">This action will generate payslips and prepare bank transfer details.</p>
          
          <div className="flex justify-end gap-3">
            <Button 
              label="Cancel"
              onClick={() => setShowConfirmModal(false)}
              secondary
            />
            <Button 
              label={isProcessing ? "Processing..." : "Confirm Process"}
              onClick={handleProcessPayroll}
              primary
              disabled={isProcessing}
              loading={isProcessing}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PayrollProcess;