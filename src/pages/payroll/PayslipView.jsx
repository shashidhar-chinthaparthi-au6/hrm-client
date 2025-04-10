import React, { useState, useEffect } from 'react';
import { Card, Button, Select, DatePicker, Input, Table, Modal } from '../../components/common';
import PayslipGenerator from '../../components/payroll/PayslipGenerator';
import { format } from 'date-fns';

const PayslipView = () => {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [downloadOptions, setDownloadOptions] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in a real app, this would come from your API
  useEffect(() => {
    setLoading(true);
    // Simulate API call for employees
    setTimeout(() => {
      const mockEmployees = [
        { id: 1, name: 'John Doe', department: 'Technology' },
        { id: 2, name: 'Jane Smith', department: 'Human Resources' },
        { id: 3, name: 'Robert Johnson', department: 'Finance' },
        { id: 4, name: 'Emily Davis', department: 'Marketing' },
        { id: 5, name: 'Michael Wilson', department: 'Technology' },
      ];
      setEmployeeList(mockEmployees);
      
      // Simulate API call for payslips
      const mockPayslips = [
        { 
          id: 101, 
          employeeId: 1, 
          employeeName: 'John Doe', 
          month: 'March 2025', 
          grossSalary: 97000, 
          netSalary: 76500, 
          status: 'generated',
          generatedDate: '2025-03-28',
          department: 'Technology'
        },
        { 
          id: 102, 
          employeeId: 2, 
          employeeName: 'Jane Smith', 
          month: 'March 2025', 
          grossSalary: 87000, 
          netSalary: 69200, 
          status: 'approved',
          generatedDate: '2025-03-28',
          department: 'Human Resources'
        },
        { 
          id: 103, 
          employeeId: 3, 
          employeeName: 'Robert Johnson', 
          month: 'March 2025', 
          grossSalary: 80000, 
          netSalary: 64800, 
          status: 'paid',
          generatedDate: '2025-03-28',
          paidDate: '2025-03-30',
          department: 'Finance'
        },
        { 
          id: 104, 
          employeeId: 4, 
          employeeName: 'Emily Davis', 
          month: 'March 2025', 
          grossSalary: 92000, 
          netSalary: 73800, 
          status: 'approved',
          generatedDate: '2025-03-28',
          department: 'Marketing'
        },
        { 
          id: 105, 
          employeeId: 5, 
          employeeName: 'Michael Wilson', 
          month: 'March 2025', 
          grossSalary: 77500, 
          netSalary: 63000, 
          status: 'generated',
          generatedDate: '2025-03-28',
          department: 'Technology'
        },
      ];
      setPayslips(mockPayslips);
      setLoading(false);
    }, 800);
  }, []);

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const handleEmployeeChange = (value) => {
    setSelectedEmployee(value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePayslipPreview = (payslip) => {
    setSelectedPayslip(payslip);
    setPreviewModal(true);
  };

  const handleDownloadOptions = (payslip) => {
    setSelectedPayslip(payslip);
    setDownloadOptions(true);
  };

  const handleBulkEmail = () => {
    // Logic to send emails
    alert('Payslips have been emailed to employees');
  };

  const handleBulkDownload = () => {
    // Logic to download multiple payslips
    alert('Payslips batch download started');
  };

  // Filter payslips based on selections
  const filteredPayslips = payslips.filter(payslip => {
    const matchesEmployee = selectedEmployee === 'all' || payslip.employeeId.toString() === selectedEmployee;
    const matchesSearch = payslip.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          payslip.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Month filtering would usually be done via API in a real app
    return matchesEmployee && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const styles = {
      generated: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Employee', accessor: 'employeeName' },
    { Header: 'Department', accessor: 'department' },
    { Header: 'Month', accessor: 'month' },
    { 
      Header: 'Gross Salary', 
      accessor: 'grossSalary',
      Cell: ({ value }) => `$${value.toLocaleString()}`
    },
    { 
      Header: 'Net Salary', 
      accessor: 'netSalary',
      Cell: ({ value }) => `$${value.toLocaleString()}`
    },
    { 
      Header: 'Status', 
      accessor: 'status',
      Cell: ({ value }) => getStatusBadge(value)
    },
    { 
      Header: 'Actions', 
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handlePayslipPreview(row.original)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Preview
          </button>
          <button 
            onClick={() => handleDownloadOptions(row.original)}
            className="text-green-600 hover:text-green-800 text-sm"
          >
            Download
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="payslip-view-container">
      <h1 className="text-2xl font-bold mb-6">Payslip Management</h1>
      
      <Card className="mb-6">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="w-64">
              <label className="block mb-2 text-sm font-medium">Month</label>
              <DatePicker
                selected={selectedMonth}
                onChange={handleMonthChange}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                className="w-full"
              />
            </div>
            <div className="w-64">
              <label className="block mb-2 text-sm font-medium">Employee</label>
              <Select
                options={[
                  { value: 'all', label: 'All Employees' },
                  ...employeeList.map(emp => ({ value: emp.id.toString(), label: emp.name }))
                ]}
                value={selectedEmployee}
                onChange={handleEmployeeChange}
                className="w-full"
              />
            </div>
            <div className="w-64">
              <label className="block mb-2 text-sm font-medium">Search</label>
              <Input
                placeholder="Search by name or department..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outlined" onClick={handleBulkEmail}>
              Email Payslips
            </Button>
            <Button onClick={handleBulkDownload}>
              Bulk Download
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            data={filteredPayslips}
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Card>

      {/* Payslip Preview Modal */}
      <Modal
        isOpen={previewModal}
        onClose={() => setPreviewModal(false)}
        title={`Payslip - ${selectedPayslip?.employeeName || ''}`}
        size="lg"
      >
        {selectedPayslip && (
          <div className="payslip-preview">
            <PayslipGenerator payslip={selectedPayslip} />
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outlined" onClick={() => setPreviewModal(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setPreviewModal(false);
                handleDownloadOptions(selectedPayslip);
              }}>
                Download
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Download Options Modal */}
      <Modal
        isOpen={downloadOptions}
        onClose={() => setDownloadOptions(false)}
        title="Download Options"
      >
        {selectedPayslip && (
          <div>
            <p className="mb-4">Select format for {selectedPayslip.employeeName}'s payslip:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button 
                className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center"
                onClick={() => {
                  alert(`Downloading PDF for ${selectedPayslip.employeeName}`);
                  setDownloadOptions(false);
                }}
              >
                <div className="text-red-500 mb-2">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="font-medium">PDF Format</div>
                <div className="text-sm text-gray-500">High-quality document format</div>
              </button>
              
              <button 
                className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center"
                onClick={() => {
                  alert(`Downloading Excel for ${selectedPayslip.employeeName}`);
                  setDownloadOptions(false);
                }}
              >
                <div className="text-green-500 mb-2">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="font-medium">Excel Format</div>
                <div className="text-sm text-gray-500">Spreadsheet format with calculations</div>
              </button>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailCopy"
                  className="mr-2"
                />
                <label htmlFor="emailCopy">
                  Also email a copy to {selectedPayslip.employeeName}
                </label>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button variant="outlined" onClick={() => setDownloadOptions(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PayslipView;