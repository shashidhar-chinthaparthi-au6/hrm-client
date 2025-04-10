import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Select from '../common/Select';
import Button from '../common/Button';

const LeaveBalance = ({ employeeId, isAdmin = false }) => {
  const [balances, setBalances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState(employeeId || null);
  const [employees, setEmployees] = useState([]);
  
  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return { value: year, label: year.toString() };
  });

  useEffect(() => {
    // Fetch employees list if admin
    if (isAdmin && !employeeId) {
      const fetchEmployees = async () => {
        try {
          const response = await fetch('/api/employees');
          const data = await response.json();
          setEmployees(data.map(emp => ({
            value: emp.id,
            label: `${emp.firstName} ${emp.lastName}`
          })));
          
          // Set first employee as default if none selected
          if (!selectedEmployee && data.length > 0) {
            setSelectedEmployee(data[0].id);
          }
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      };
      
      fetchEmployees();
    }
  }, [isAdmin, employeeId]);

  useEffect(() => {
    const fetchLeaveBalances = async () => {
      if (!selectedEmployee) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/employees/${selectedEmployee}/leave-balances?year=${selectedYear}`);
        const data = await response.json();
        setBalances(data);
      } catch (error) {
        console.error('Error fetching leave balances:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveBalances();
  }, [selectedEmployee, selectedYear]);

  const calculateUsagePercentage = (used, total) => {
    if (total === 0) return 0;
    return Math.round((used / total) * 100);
  };

  const columns = [
    {
      Header: 'Leave Type',
      accessor: 'leaveType',
      Cell: ({ value }) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      Header: 'Description',
      accessor: 'description',
    },
    {
      Header: 'Entitlement',
      accessor: 'entitled',
      Cell: ({ value }) => (
        <span className="font-medium">{value} days</span>
      )
    },
    {
      Header: 'Accrued',
      accessor: 'accrued',
      Cell: ({ value }) => (
        <span>{value} days</span>
      )
    },
    {
      Header: 'Used',
      accessor: 'used',
      Cell: ({ value }) => (
        <span>{value} days</span>
      )
    },
    {
      Header: 'Balance',
      accessor: 'balance',
      Cell: ({ value }) => (
        <span className="font-semibold">{value} days</span>
      )
    },
    {
      Header: 'Usage',
      Cell: ({ row }) => {
        const percentage = calculateUsagePercentage(row.original.used, row.original.entitled);
        let color = 'green';
        if (percentage > 75) color = 'yellow';
        if (percentage > 90) color = 'red';
        
        return (
          <div className="w-full">
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                <div 
                  className={`bg-${color}-500 h-2.5 rounded-full`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{percentage}%</span>
            </div>
          </div>
        );
      }
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => {
        let color = 'green';
        if (value === 'Low') color = 'red';
        if (value === 'Medium') color = 'yellow';
        
        return <Badge color={color}>{value}</Badge>;
      }
    },
  ];

  const exportBalances = async () => {
    if (!selectedEmployee) return;
    
    try {
      const response = await fetch(`/api/employees/${selectedEmployee}/leave-balances/export?year=${selectedYear}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leave_balances_${selectedYear}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        throw new Error('Failed to export leave balances');
      }
    } catch (error) {
      console.error('Error exporting leave balances:', error);
    }
  };

  return (
    <Card 
      title="Leave Balances" 
      isLoading={isLoading}
      actions={
        <Button 
          variant="outline" 
          onClick={exportBalances}
          disabled={isLoading || balances.length === 0}
        >
          Export
        </Button>
      }
    >
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        {isAdmin && !employeeId && (
          <div className="md:w-1/2">
            <Select
              label="Select Employee"
              id="employeeSelect"
              name="employeeSelect"
              options={employees}
              value={selectedEmployee}
              onChange={(selected) => setSelectedEmployee(selected.value)}
              placeholder="Select an employee"
            />
          </div>
        )}
        
        <div className="md:w-1/2">
          <Select
            label="Select Year"
            id="yearSelect"
            name="yearSelect"
            options={years}
            value={selectedYear}
            onChange={(selected) => setSelectedYear(selected.value)}
          />
        </div>
      </div>
      
      {balances.length > 0 ? (
        <Table 
          columns={columns} 
          data={balances} 
          showPagination={false}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          {isLoading ? 'Loading leave balances...' : 'No leave balances found for the selected year'}
        </div>
      )}
      
      {balances.length > 0 && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>- Annual leave is accrued monthly based on your employment contract.</li>
            <li>- Sick leave is reset at the beginning of each calendar year.</li>
            <li>- Unused annual leave may be carried forward based on company policy.</li>
            <li>- For more details, please refer to the company leave policy.</li>
          </ul>
        </div>
      )}
    </Card>
  );
};

export default LeaveBalance;