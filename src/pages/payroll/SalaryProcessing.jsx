import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Select, DatePicker, Modal } from '../components/common';
import PayrollProcess from '../components/payroll/PayrollProcess';
import TaxDeductions from '../components/payroll/TaxDeductions';
import { format } from 'date-fns';

const SalaryProcessing = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processComplete, setProcessComplete] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [payrollSummary, setPayrollSummary] = useState(null);

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'tech', name: 'Technology' },
    { id: 'hr', name: 'Human Resources' },
    { id: 'finance', name: 'Finance' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'operations', name: 'Operations' }
  ];

  // Mock data - in a real app, this would come from your API
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const mockEmployees = [
        { id: 1, name: 'John Doe', department: 'tech', position: 'Senior Developer', baseSalary: 85000, allowances: 12000, deductions: 8500 },
        { id: 2, name: 'Jane Smith', department: 'hr', position: 'HR Manager', baseSalary: 78000, allowances: 9000, deductions: 7800 },
        { id: 3, name: 'Robert Johnson', department: 'finance', position: 'Financial Analyst', baseSalary: 72000, allowances: 8000, deductions: 7200 },
        { id: 4, name: 'Emily Davis', department: 'marketing', position: 'Marketing Director', baseSalary: 82000, allowances: 10000, deductions: 8200 },
        { id: 5, name: 'Michael Wilson', department: 'tech', position: 'System Administrator', baseSalary: 70000, allowances: 7500, deductions: 7000 },
      ];
      setEmployees(mockEmployees);
      setLoading(false);
    }, 800);
  }, []);

  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const filteredEmployees = selectedDepartment === 'all' 
    ? employees 
    : employees.filter(emp => emp.department === selectedDepartment);

  const calculateNetSalary = (emp) => {
    return emp.baseSalary + emp.allowances - emp.deductions;
  };

  const handleStartProcessing = () => {
    setConfirmationModal(true);
  };

  const confirmProcessing = () => {
    setConfirmationModal(false);
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      const summary = {
        totalEmployees: filteredEmployees.length,
        totalSalary: filteredEmployees.reduce((acc, emp) => acc + calculateNetSalary(emp), 0),
        departmentBreakdown: departments
          .filter(d => d.id !== 'all')
          .map(d => ({
            department: d.name,
            count: filteredEmployees.filter(emp => emp.department === d.id).length,
            totalAmount: filteredEmployees
              .filter(emp => emp.department === d.id)
              .reduce((acc, emp) => acc + calculateNetSalary(emp), 0)
          }))
      };
      setPayrollSummary(summary);
      setIsProcessing(false);
      setProcessComplete(true);
    }, 3000);
  };

  const resetProcess = () => {
    setProcessComplete(false);
    setPayrollSummary(null);
  };

  const columns = [
    { Header: 'Employee ID', accessor: 'id' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Department', accessor: 'department', Cell: ({ value }) => departments.find(d => d.id === value)?.name || value },
    { Header: 'Position', accessor: 'position' },
    { Header: 'Base Salary', accessor: 'baseSalary', Cell: ({ value }) => `$${value.toLocaleString()}` },
    { Header: 'Allowances', accessor: 'allowances', Cell: ({ value }) => `$${value.toLocaleString()}` },
    { Header: 'Deductions', accessor: 'deductions', Cell: ({ value }) => `$${value.toLocaleString()}` },
    { 
      Header: 'Net Salary', 
      accessor: row => calculateNetSalary(row),
      Cell: ({ value }) => `$${value.toLocaleString()}`
    },
  ];

  return (
    <div className="salary-processing-container">
      <h1 className="text-2xl font-bold mb-6">Salary Processing</h1>
      
      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Payroll Parameters</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-64">
            <label className="block mb-2 text-sm font-medium">Select Month</label>
            <DatePicker
              selected={selectedMonth}
              onChange={handleMonthChange}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="w-full"
            />
          </div>
          <div className="w-64">
            <label className="block mb-2 text-sm font-medium">Department</label>
            <Select
              options={departments.map(dept => ({ value: dept.id, label: dept.name }))}
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              className="w-full"
            />
          </div>
        </div>
        <PayrollProcess />
      </Card>

      {!isProcessing && !processComplete && (
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Employee Salary Details</h2>
            <Button 
              onClick={handleStartProcessing}
              disabled={loading || filteredEmployees.length === 0}
            >
              Process Payroll for {format(selectedMonth, 'MMMM yyyy')}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              data={filteredEmployees}
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </div>
        </Card>
      )}

      {isProcessing && (
        <Card className="mb-6 text-center py-12">
          <div className="animate-pulse">
            <div className="text-xl font-semibold mb-4">Processing Payroll</div>
            <div className="text-gray-500">This may take a few moments...</div>
            <div className="mt-6 relative w-64 h-4 bg-gray-200 rounded-full mx-auto overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-blue-500 animate-progress-bar"></div>
            </div>
          </div>
        </Card>
      )}

      {processComplete && payrollSummary && (
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Payroll Summary - {format(selectedMonth, 'MMMM yyyy')}</h2>
            <div className="flex gap-3">
              <Button variant="outlined" onClick={resetProcess}>
                Process Again
              </Button>
              <Button>
                Generate Payslips
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500">Total Employees</div>
              <div className="text-2xl font-bold">{payrollSummary.totalEmployees}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500">Total Payroll Amount</div>
              <div className="text-2xl font-bold">${payrollSummary.totalSalary.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500">Processing Date</div>
              <div className="text-2xl font-bold">{format(new Date(), 'dd MMM yyyy')}</div>
            </div>
          </div>
          
          <h3 className="text-md font-semibold mb-3">Department Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Count</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payrollSummary.departmentBreakdown.map((dept, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{dept.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{dept.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${dept.totalAmount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={confirmationModal}
        onClose={() => setConfirmationModal(false)}
        title="Confirm Payroll Processing"
      >
        <div className="mb-6">
          <p className="mb-4">
            You are about to process payroll for <strong>{format(selectedMonth, 'MMMM yyyy')}</strong> for{' '}
            <strong>
              {selectedDepartment === 'all' 
                ? 'all departments' 
                : departments.find(d => d.id === selectedDepartment)?.name}
            </strong>.
          </p>
          <p className="mb-4">
            This will calculate salaries for <strong>{filteredEmployees.length}</strong> employees.
          </p>
          <p className="text-amber-600">
            Please note: Once processed, these figures will be available for payslip generation.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outlined" onClick={() => setConfirmationModal(false)}>
            Cancel
          </Button>
          <Button onClick={confirmProcessing}>
            Confirm & Process
          </Button>
        </div>
      </Modal>

      <style jsx>{`
        @keyframes progress {
          0% { width: 5%; }
          100% { width: 100%; }
        }
        .animate-progress-bar {
          animation: progress 3s linear;
        }
      `}</style>
    </div>
  );
};

export default SalaryProcessing;