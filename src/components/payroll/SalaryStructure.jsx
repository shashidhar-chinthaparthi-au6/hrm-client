import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Table from '../common/Table';
import Select from '../common/Select';

const SalaryStructure = () => {
  const [structures, setStructures] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStructure, setCurrentStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [structureTypes, setStructureTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    basicPercentage: 50,
    hraPercentage: 20,
    daPercentage: 10,
    pfPercentage: 12,
    taxPercentage: 5,
    otherAllowances: 3,
    description: ''
  });

  // Columns for the table
  const columns = [
    { id: 'name', label: 'Structure Name', sortable: true },
    { id: 'type', label: 'Type', sortable: true },
    { id: 'basic', label: 'Basic (%)', sortable: true },
    { id: 'hra', label: 'HRA (%)', sortable: true },
    { id: 'da', label: 'DA (%)', sortable: true },
    { id: 'pf', label: 'PF (%)', sortable: true },
    { id: 'tax', label: 'Tax (%)', sortable: true },
    { id: 'totalCTC', label: 'Total CTC', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false }
  ];

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          // Mock data for structure types
          setStructureTypes([
            { id: 'employee', name: 'Regular Employee' },
            { id: 'manager', name: 'Manager' },
            { id: 'executive', name: 'Executive' },
            { id: 'contract', name: 'Contract' },
            { id: 'intern', name: 'Intern' }
          ]);
          
          // Mock data for salary structures
          setStructures([
            {
              id: 1,
              name: 'Standard Employee Package',
              type: 'employee',
              typeName: 'Regular Employee',
              basic: 50,
              hra: 20,
              da: 10,
              pf: 12,
              tax: 5,
              otherAllowances: 3,
              totalCTC: '$50,000',
              description: 'Standard salary structure for regular employees',
              createdAt: '2023-01-15'
            },
            {
              id: 2,
              name: 'Manager Package',
              type: 'manager',
              typeName: 'Manager',
              basic: 45,
              hra: 25,
              da: 12,
              pf: 12,
              tax: 6,
              otherAllowances: 0,
              totalCTC: '$80,000',
              description: 'Salary structure for managerial positions',
              createdAt: '2023-01-10'
            },
            {
              id: 3,
              name: 'Executive Package',
              type: 'executive',
              typeName: 'Executive',
              basic: 40,
              hra: 30,
              da: 10,
              pf: 12,
              tax: 8,
              otherAllowances: 0,
              totalCTC: '$120,000',
              description: 'Salary structure for executive roles',
              createdAt: '2023-01-05'
            },
            {
              id: 4,
              name: 'Contract Worker Package',
              type: 'contract',
              typeName: 'Contract',
              basic: 70,
              hra: 10,
              da: 5,
              pf: 0,
              tax: 15,
              otherAllowances: 0,
              totalCTC: '$45,000',
              description: 'Salary structure for contract workers',
              createdAt: '2023-02-20'
            },
            {
              id: 5,
              name: 'Intern Package',
              type: 'intern',
              typeName: 'Intern',
              basic: 80,
              hra: 10,
              da: 5,
              pf: 0,
              tax: 5,
              otherAllowances: 0,
              totalCTC: '$20,000',
              description: 'Salary structure for interns',
              createdAt: '2023-03-01'
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching salary structures:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleOpenModal = (structure = null) => {
    if (structure) {
      setCurrentStructure(structure);
      setFormData({
        name: structure.name,
        type: structure.type,
        basicPercentage: structure.basic,
        hraPercentage: structure.hra,
        daPercentage: structure.da,
        pfPercentage: structure.pf,
        taxPercentage: structure.tax,
        otherAllowances: structure.otherAllowances || 0,
        description: structure.description
      });
    } else {
      setCurrentStructure(null);
      setFormData({
        name: '',
        type: '',
        basicPercentage: 50,
        hraPercentage: 20,
        daPercentage: 10,
        pfPercentage: 12,
        taxPercentage: 5,
        otherAllowances: 3,
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentStructure(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const total = parseFloat(formData.basicPercentage) + 
                 parseFloat(formData.hraPercentage) + 
                 parseFloat(formData.daPercentage) + 
                 parseFloat(formData.otherAllowances);
                 
    if (total !== 100) {
      alert("The sum of Basic, HRA, DA, and Other Allowances must equal 100%");
      return;
    }
    
    if (currentStructure) {
      // Update existing structure
      const updatedStructures = structures.map(item => 
        item.id === currentStructure.id 
          ? {
              ...item,
              name: formData.name,
              type: formData.type,
              typeName: structureTypes.find(t => t.id === formData.type)?.name,
              basic: parseFloat(formData.basicPercentage),
              hra: parseFloat(formData.hraPercentage),
              da: parseFloat(formData.daPercentage),
              pf: parseFloat(formData.pfPercentage),
              tax: parseFloat(formData.taxPercentage),
              otherAllowances: parseFloat(formData.otherAllowances),
              description: formData.description
            }
          : item
      );
      setStructures(updatedStructures);
    } else {
      // Add new structure
      const newStructure = {
        id: Date.now(),
        name: formData.name,
        type: formData.type,
        typeName: structureTypes.find(t => t.id === formData.type)?.name,
        basic: parseFloat(formData.basicPercentage),
        hra: parseFloat(formData.hraPercentage),
        da: parseFloat(formData.daPercentage),
        pf: parseFloat(formData.pfPercentage),
        tax: parseFloat(formData.taxPercentage),
        otherAllowances: parseFloat(formData.otherAllowances),
        totalCTC: '$0', // Will be calculated when applied to employees
        description: formData.description,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setStructures([...structures, newStructure]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this salary structure?')) {
      setStructures(structures.filter(item => item.id !== id));
    }
  };

  // Format data for the table
  const formattedData = structures.map(structure => ({
    ...structure,
    actions: (
      <div className="flex space-x-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleOpenModal(structure)}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleDelete(structure.id)}
        >
          Delete
        </Button>
      </div>
    )
  }));

  // Calculate total percentage
  const calculateTotal = () => {
    return (
      parseFloat(formData.basicPercentage || 0) +
      parseFloat(formData.hraPercentage || 0) +
      parseFloat(formData.daPercentage || 0) +
      parseFloat(formData.otherAllowances || 0)
    );
  };

  const totalPercentage = calculateTotal();
  const isValidTotal = totalPercentage === 100;

  return (
    <div className="salary-structure-container">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Salary Structures</h1>
        <Button
          variant="primary"
          onClick={() => handleOpenModal()}
        >
          Add New Structure
        </Button>
      </div>
      
      <Card>
        <Table
          columns={columns}
          data={formattedData}
          loading={loading}
          sortable={true}
          initialSort={{ column: 'name', direction: 'asc' }}
        />
      </Card>
      
      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentStructure ? "Edit Salary Structure" : "Add New Salary Structure"}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Input
                label="Structure Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Select
                label="Employee Type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                options={structureTypes}
                valueKey="id"
                labelKey="name"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Earnings Components (%)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Basic Salary"
                name="basicPercentage"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.basicPercentage}
                onChange={handleInputChange}
                required
              />
              <Input
                label="HRA"
                name="hraPercentage"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.hraPercentage}
                onChange={handleInputChange}
                required
              />
              <Input
                label="DA"
                name="daPercentage"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.daPercentage}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Other Allowances"
                name="otherAllowances"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.otherAllowances}
                onChange={handleInputChange}
                required
              />
              <div className="col-span-3">
                <div className={`text-sm font-medium ${isValidTotal ? 'text-green-600' : 'text-red-600'}`}>
                  Total Earnings: {totalPercentage}% {isValidTotal ? '✓' : '(Must equal 100%)'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Deductions Components (%)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Provident Fund"
                name="pfPercentage"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.pfPercentage}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Tax"
                name="taxPercentage"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.taxPercentage}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <Input
              label="Description"
              name="description"
              as="textarea"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!isValidTotal}>
              {currentStructure ? 'Update' : 'Create'} Structure
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SalaryStructure;