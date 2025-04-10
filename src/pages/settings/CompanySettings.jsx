import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import DatePicker from '../../components/common/DatePicker';
import { uploadCompanyLogo } from '../../services/settingsService';

const CompanySettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [timezones, setTimezones] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    // Fetch timezones and currencies from API
    const fetchSettingsData = async () => {
      try {
        // Mock data for demo - replace with actual API calls
        setTimezones([
          { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
          { value: 'EST', label: 'EST (Eastern Standard Time)' },
          { value: 'PST', label: 'PST (Pacific Standard Time)' },
          { value: 'IST', label: 'IST (Indian Standard Time)' },
        ]);
        
        setCurrencies([
          { value: 'USD', label: 'USD - US Dollar' },
          { value: 'EUR', label: 'EUR - Euro' },
          { value: 'GBP', label: 'GBP - British Pound' },
          { value: 'INR', label: 'INR - Indian Rupee' },
        ]);
      } catch (error) {
        console.error('Error fetching settings data:', error);
      }
    };
    
    fetchSettingsData();
  }, []);

  const validationSchema = Yup.object({
    companyName: Yup.string().required('Company name is required'),
    legalName: Yup.string().required('Legal name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    taxId: Yup.string().required('Tax ID is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    zipCode: Yup.string().required('ZIP code is required'),
    timezone: Yup.string().required('Timezone is required'),
    currency: Yup.string().required('Currency is required'),
    fiscalYearStart: Yup.date().required('Fiscal year start date is required'),
  });

  const formik = useFormik({
    initialValues: {
      companyName: 'Acme Corporation',
      legalName: 'Acme Corp Ltd.',
      email: 'admin@acmecorp.com',
      phone: '+1 (555) 123-4567',
      taxId: 'TAX123456789',
      address: '123 Business Avenue',
      city: 'San Francisco',
      state: 'California',
      country: 'United States',
      zipCode: '94105',
      timezone: 'PST',
      currency: 'USD',
      fiscalYearStart: new Date('2023-01-01'),
      website: 'https://www.acmecorp.com',
      industry: 'Technology',
      companySize: '100-500',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // API call to save company settings
        console.log('Saving company settings:', values);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Company settings saved successfully!');
      } catch (error) {
        console.error('Error saving company settings:', error);
        toast.error('Failed to save company settings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Show preview
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Upload logo
    try {
      setIsLoading(true);
      // Replace with actual API call
      // const response = await uploadCompanyLogo(file);
      // console.log('Logo uploaded:', response);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    } catch (error) {
      console.error('Error uploading logo:', error);
      setIsLoading(false);
    }
  };

  const industrySizes = [
    { value: '1-50', label: '1-50 employees' },
    { value: '51-100', label: '51-100 employees' },
    { value: '100-500', label: '100-500 employees' },
    { value: '501-1000', label: '501-1000 employees' },
    { value: '1000+', label: '1000+ employees' },
  ];

  const industries = [
    { value: 'Technology', label: 'Technology' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Education', label: 'Education' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <div className="settings-container">
      <h1>Company Settings</h1>
      <p>Configure your organization's basic information and preferences</p>
      
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <h2>Company Identity</h2>
          
          <div className="logo-section">
            <div className="logo-preview">
              {logoPreview ? (
                <img src={logoPreview} alt="Company logo" />
              ) : (
                <div className="logo-placeholder">
                  {formik.values.companyName.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="logo-upload">
              <h3>Company Logo</h3>
              <p>Upload a square image, at least 200x200px (PNG or JPG)</p>
              <input 
                type="file" 
                accept="image/png, image/jpeg" 
                onChange={handleLogoChange}
                id="logo-upload"
              />
              <label htmlFor="logo-upload" className="upload-button">
                Choose File
              </label>
            </div>
          </div>
          
          <div className="form-row">
            <Input
              label="Company Name"
              id="companyName"
              name="companyName"
              value={formik.values.companyName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.companyName && formik.errors.companyName}
            />
            
            <Input
              label="Legal Name"
              id="legalName"
              name="legalName"
              value={formik.values.legalName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.legalName && formik.errors.legalName}
            />
          </div>
          
          <div className="form-row">
            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
            />
            
            <Input
              label="Phone Number"
              id="phone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && formik.errors.phone}
            />
          </div>
          
          <div className="form-row">
            <Input
              label="Website"
              id="website"
              name="website"
              value={formik.values.website}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.website && formik.errors.website}
            />
            
            <Input
              label="Tax ID"
              id="taxId"
              name="taxId"
              value={formik.values.taxId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.taxId && formik.errors.taxId}
            />
          </div>
          
          <div className="form-row">
            <Select
              label="Industry"
              id="industry"
              name="industry"
              options={industries}
              value={formik.values.industry}
              onChange={(value) => formik.setFieldValue('industry', value)}
              error={formik.touched.industry && formik.errors.industry}
            />
            
            <Select
              label="Company Size"
              id="companySize"
              name="companySize"
              options={industrySizes}
              value={formik.values.companySize}
              onChange={(value) => formik.setFieldValue('companySize', value)}
              error={formik.touched.companySize && formik.errors.companySize}
            />
          </div>
        </Card>
        
        <Card>
          <h2>Company Address</h2>
          <Input
            label="Street Address"
            id="address"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.address && formik.errors.address}
          />
          
          <div className="form-row">
            <Input
              label="City"
              id="city"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.city && formik.errors.city}
            />
            
            <Input
              label="State/Province"
              id="state"
              name="state"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.state && formik.errors.state}
            />
          </div>
          
          <div className="form-row">
            <Input
              label="Country"
              id="country"
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.country && formik.errors.country}
            />
            
            <Input
              label="ZIP/Postal Code"
              id="zipCode"
              name="zipCode"
              value={formik.values.zipCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.zipCode && formik.errors.zipCode}
            />
          </div>
        </Card>
        
        <Card>
          <h2>Regional Settings</h2>
          <div className="form-row">
            <Select
              label="Timezone"
              id="timezone"
              name="timezone"
              options={timezones}
              value={formik.values.timezone}
              onChange={(value) => formik.setFieldValue('timezone', value)}
              error={formik.touched.timezone && formik.errors.timezone}
            />
            
            <Select
              label="Currency"
              id="currency"
              name="currency"
              options={currencies}
              value={formik.values.currency}
              onChange={(value) => formik.setFieldValue('currency', value)}
              error={formik.touched.currency && formik.errors.currency}
            />
          </div>
          
          <div className="form-row">
            <DatePicker
              label="Fiscal Year Start"
              id="fiscalYearStart"
              name="fiscalYearStart"
              selected={formik.values.fiscalYearStart}
              onChange={(date) => formik.setFieldValue('fiscalYearStart', date)}
              error={formik.touched.fiscalYearStart && formik.errors.fiscalYearStart}
            />
          </div>
        </Card>
        
        <div className="form-actions">
          <Button type="submit" loading={isLoading}>
            Save Company Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompanySettings;