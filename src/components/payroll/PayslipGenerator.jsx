// PayslipGenerator.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import Select from '../common/Select';
import Table from '../common/Table';
import Modal from '../common/Modal';
import DatePicker from '../common/DatePicker';

const PayslipGenerator = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  
  useEffect(() => {
    // Fetch employees with processed payroll
    const fetchProcessedPayroll = async () => {
      setIsLoading(true);
      try {
        // API call would go here
        // const response = await api.get('/payroll/processed', { 
        //   params: { 
        //     month: selectedMonth.toISOString(),
        //   }
        // });
        
        // Mock data for demonstration
        const mockData = [
          { 
            id: 1, 
            name: 'John Doe', 
            department: 'Engineering', 
            position: 'Senior Developer',
            status: 'processed',
            basic: 5000,
            hra: 2000,
            allowances: 1000,
            deductions: 800,
            tax: 1200,
            netPay: 6000
          },
          { 
            id: 2, 
            name: 'Jane Smith', 
            department: 'HR', 
            position: 'HR Manager',
            status: 'processed',
            basic: 4500,
            hra: 1800,
            allowances: 900,
            deductions: 700,
            tax: 1000,
            netPay: 5500
          },
          { 
            id: 3, 
            name: 'Mike Johnson', 
            department: 'Finance', 
            position: 'Financial Analyst',
            status: 'processed',
            basic: 5500,
            hra: 2200,
            allowances: 1100,
            deductions: 850,
            tax: 1300,
            netPay: 6650
          },
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setEmployees(mockData);
      } catch (error) {
        toast.error('Failed to fetch payroll data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcessedPayroll();
  }, [selectedMonth]);

  const handleViewPayslip = (employee) => {
    setSelectedEmployee(employee);
    setShowPayslipModal(true);
  };

  const handleSendPayslipEmail = async () => {
    if (!selectedEmployee) return;
    
    setIsSendingEmail(true);
    try {
      // API call would go here
      // await api.post('/payroll/send-payslip', {
      //   employeeId: selectedEmployee.id,
      //   month: selectedMonth.toISOString()
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Payslip sent to ${selectedEmployee.name}'s email`);
    } catch (error) {
      toast.error('Failed to send payslip email');
      console.error(error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleBulkGenerate = async () => {
    setIsLoading(true);
    try {
      // API call would go here
      // await api.post('/payroll/generate-all', {
      //   month: selectedMonth.toISOString()
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('All payslips generated successfully');
    } catch (error) {
      toast.error('Failed to generate payslips');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { 
      header: 'Employee', 
      accessor: 'name',
      cell: (row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-sm text-gray-500">{row.position}</div>
        </div>
      )
    },
    { header: 'Department', accessor: 'department' },
    { 
      header: 'Net Pay', 
      accessor: 'netPay',
      cell: (row) => `$${row.netPay.toLocaleString()}`
    },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
          Processed
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <Button 
            label="View" 
            onClick={() => handleViewPayslip(row)}
            small
            secondary
          />
          <Button 
            label="Download" 
            small
            primary
            onClick={() => toast.info(`Downloading payslip for ${row.name}`)}
          />
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Payslip Generator</h2>
      
      <div className="flex flex-wrap gap-4 mb-6 justify-between">
        <div className="flex gap-4">
          <div className="w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <DatePicker 
              value={selectedMonth}
              onChange={setSelectedMonth}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
            />
          </div>
          
          <div className="w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search employee or department"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-end">
          <Button 
            label={isLoading ? "Processing..." : "Generate All Payslips"}
            onClick={handleBulkGenerate}
            primary
            disabled={isLoading}
          />
        </div>
      </div>
      
      <Table 
        columns={columns}
        data={filteredEmployees}
        isLoading={isLoading}
        emptyMessage="No processed payrolls found for the selected month"
      />
      
      {selectedEmployee && (
        <Modal
          isOpen={showPayslipModal}
          onClose={() => setShowPayslipModal(false)}
          title={`Payslip - ${selectedEmployee.name}`}
          size="lg"
        >
          <div className="p-6">
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-1">{selectedEmployee.name}</h3>
                  <p className="text-gray-600">{selectedEmployee.position}</p>
                  <p className="text-gray-600">{selectedEmployee.department}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-lg font-medium">Payslip</h4>
                  <p className="text-gray-600">
                    {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-gray-600">Employee ID: {selectedEmployee.id}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium mb-3">Earnings</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Basic Salary</span>
                    <span>${selectedEmployee.basic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>House Rent Allowance</span>
                    <span>${selectedEmployee.hra}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Allowances</span>
                    <span>${selectedEmployee.allowances}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total Earnings</span>
                    <span>${selectedEmployee.basic + selectedEmployee.hra + selectedEmployee.allowances}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Deductions</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Income Tax</span>
                    <span>${selectedEmployee.tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Provident Fund</span>
                    <span>${Math.round(selectedEmployee.basic * 0.12)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Deductions</span>
                    <span>${selectedEmployee.deductions}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total Deductions</span>
                    <span>${selectedEmployee.tax + Math.round(selectedEmployee.basic * 0.12) + selectedEmployee.deductions}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-md">
              <div className="flex justify-between text-lg font-semibold">
                <span>Net Pay</span>
                <span className="text-green-600">${selectedEmployee.netPay}</span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between">
              <Button 
                label="Download PDF"
                secondary
                onClick={() => toast.info(`Downloading PDF payslip for ${selectedEmployee.name}`)}
              />
              
              <Button 
                label={isSendingEmail ? "Sending..." : "Send via Email"}
                primary
                onClick={handleSendPayslipEmail}
                disabled={isSendingEmail}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PayslipGenerator;