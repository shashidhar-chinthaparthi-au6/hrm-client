import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import Select from '../common/Select';

const BankDetails = ({ employeeId, onSave, initialData = null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    // Fetch list of banks from API
    const fetchBanks = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/banks');
        const data = await response.json();
        setBanks(data.map(bank => ({ value: bank.id, label: bank.name })));
      } catch (error) {
        console.error('Error fetching banks:', error);
        setBanks([]);
      }
    };

    fetchBanks();

    // If initial data is provided, populate the form
    if (initialData) {
      formik.setValues({
        accountHolderName: initialData.accountHolderName || '',
        accountNumber: initialData.accountNumber || '',
        bankName: initialData.bankName || '',
        ifscCode: initialData.ifscCode || '',
        branchName: initialData.branchName || '',
        accountType: initialData.accountType || 'savings',
        isPrimary: initialData.isPrimary || false,
      });
    }
  }, [initialData]);

  // Validation schema
  const validationSchema = Yup.object({
    accountHolderName: Yup.string().required('Account holder name is required'),
    accountNumber: Yup.string()
      .required('Account number is required')
      .matches(/^\d+$/, 'Account number must be numeric')
      .min(8, 'Account number must be at least 8 digits'),
    bankName: Yup.string().required('Bank name is required'),
    ifscCode: Yup.string()
      .required('IFSC code is required')
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'),
    branchName: Yup.string().required('Branch name is required'),
    accountType: Yup.string().required('Account type is required'),
  });

  // Account type options
  const accountTypes = [
    { value: 'savings', label: 'Savings Account' },
    { value: 'current', label: 'Current Account' },
    { value: 'salary', label: 'Salary Account' },
  ];

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      accountHolderName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      branchName: '',
      accountType: 'savings',
      isPrimary: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        const response = await fetch(`/api/employees/${employeeId}/bank-details`, {
          method: initialData ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to save bank details');
        }

        const data = await response.json();
        onSave(data);
        // Show success message or notification
      } catch (error) {
        console.error('Error saving bank details:', error);
        // Show error message or notification
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleIfscLookup = async () => {
    if (formik.values.ifscCode.length < 11) return;
    
    setIsLoading(true);
    try {
      // Replace with actual IFSC API call
      const response = await fetch(`/api/ifsc/${formik.values.ifscCode}`);
      const data = await response.json();
      
      if (data.bank) {
        formik.setFieldValue('bankName', data.bank);
        formik.setFieldValue('branchName', data.branch);
      }
    } catch (error) {
      console.error('Error looking up IFSC:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Bank Account Details">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <Input
          label="Account Holder Name"
          id="accountHolderName"
          name="accountHolderName"
          value={formik.values.accountHolderName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.accountHolderName && formik.errors.accountHolderName}
          placeholder="Enter account holder name"
          required
        />

        <Input
          label="Account Number"
          id="accountNumber"
          name="accountNumber"
          value={formik.values.accountNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.accountNumber && formik.errors.accountNumber}
          placeholder="Enter account number"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Bank Name"
            id="bankName"
            name="bankName"
            options={banks}
            value={formik.values.bankName}
            onChange={(selected) => formik.setFieldValue('bankName', selected.value)}
            onBlur={formik.handleBlur}
            error={formik.touched.bankName && formik.errors.bankName}
            placeholder="Select bank"
            required
          />

          <div className="relative">
            <Input
              label="IFSC Code"
              id="ifscCode"
              name="ifscCode"
              value={formik.values.ifscCode}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e);
                handleIfscLookup();
              }}
              error={formik.touched.ifscCode && formik.errors.ifscCode}
              placeholder="Enter IFSC code"
              required
            />
            <button
              type="button"
              onClick={handleIfscLookup}
              className="absolute right-2 top-8 text-blue-600 text-sm"
              disabled={isLoading}
            >
              Lookup
            </button>
          </div>
        </div>

        <Input
          label="Branch Name"
          id="branchName"
          name="branchName"
          value={formik.values.branchName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.branchName && formik.errors.branchName}
          placeholder="Enter branch name"
          required
        />

        <Select
          label="Account Type"
          id="accountType"
          name="accountType"
          options={accountTypes}
          value={formik.values.accountType}
          onChange={(selected) => formik.setFieldValue('accountType', selected.value)}
          onBlur={formik.handleBlur}
          error={formik.touched.accountType && formik.errors.accountType}
          required
        />

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="isPrimary"
            name="isPrimary"
            checked={formik.values.isPrimary}
            onChange={formik.handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-700">
            Set as primary account for salary disbursement
          </label>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSave(null)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            {initialData ? 'Update' : 'Save'} Bank Details
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default BankDetails;