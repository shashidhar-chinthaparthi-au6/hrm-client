import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Avatar,
  Divider,
  CircularProgress,
  Fade,
  Tooltip,
  Chip,
  Stack
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  AttachMoney as CurrencyIcon,
  CalendarToday as CalendarIcon,
  Upload as UploadIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import MainLayout from '../../components/layout/MainLayout';
import Breadcrumbs from '../../components/layout/Breadcrumbs';

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
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumbs
          items={[
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Settings', link: '/settings' },
            { label: 'Company Settings', link: '/settings/company' },
          ]}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Company Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure your organization's basic information and preferences
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={formik.handleSubmit}
            disabled={isLoading}
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
              }
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
          </Button>
        </Box>

        <Fade in timeout={500}>
          <Card elevation={3} sx={{ borderRadius: 2, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                Company Identity
              </Typography>
              
              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 200, 
                      height: 200, 
                      borderRadius: 2, 
                      overflow: 'hidden', 
                      mb: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: 'background.paper'
                    }}
                  >
                    {logoPreview ? (
                      <Box 
                        component="img" 
                        src={logoPreview} 
                        alt="Company logo" 
                        sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    ) : (
                      <Typography variant="h1" sx={{ color: 'primary.main' }}>
                        {formik.values.companyName.charAt(0)}
                      </Typography>
                    )}
                  </Box>
                  
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    sx={{ mb: 1 }}
                  >
                    Upload Logo
                    <input
                      type="file"
                      hidden
                      accept="image/png, image/jpeg"
                      onChange={handleLogoChange}
                    />
                  </Button>
                  
                  <Typography variant="caption" color="text.secondary" align="center">
                    Upload a square image, at least 200x200px (PNG or JPG)
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Company Name"
                        id="companyName"
                        name="companyName"
                        value={formik.values.companyName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                        helperText={formik.touched.companyName && formik.errors.companyName}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Legal Name"
                        id="legalName"
                        name="legalName"
                        value={formik.values.legalName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.legalName && Boolean(formik.errors.legalName)}
                        helperText={formik.touched.legalName && formik.errors.legalName}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        id="phone"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone && formik.errors.phone}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Website"
                        id="website"
                        name="website"
                        value={formik.values.website}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LanguageIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Industry</InputLabel>
                        <Select
                          label="Industry"
                          id="industry"
                          name="industry"
                          value={formik.values.industry}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          {industries.map((industry) => (
                            <MenuItem key={industry.value} value={industry.value}>
                              {industry.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Company Size</InputLabel>
                        <Select
                          label="Company Size"
                          id="companySize"
                          name="companySize"
                          value={formik.values.companySize}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          {industrySizes.map((size) => (
                            <MenuItem key={size.value} value={size.value}>
                              {size.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>

        <Fade in timeout={500}>
          <Card elevation={3} sx={{ borderRadius: 2, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                Address Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    id="address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    id="city"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    id="state"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    id="country"
                    name="country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.country && Boolean(formik.errors.country)}
                    helperText={formik.touched.country && formik.errors.country}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ZIP/Postal Code"
                    id="zipCode"
                    name="zipCode"
                    value={formik.values.zipCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                    helperText={formik.touched.zipCode && formik.errors.zipCode}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>

        <Fade in timeout={500}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
                Company Preferences
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tax ID / VAT Number"
                    id="taxId"
                    name="taxId"
                    value={formik.values.taxId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.taxId && Boolean(formik.errors.taxId)}
                    helperText={formik.touched.taxId && formik.errors.taxId}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      label="Timezone"
                      id="timezone"
                      name="timezone"
                      value={formik.values.timezone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.timezone && Boolean(formik.errors.timezone)}
                    >
                      {timezones.map((timezone) => (
                        <MenuItem key={timezone.value} value={timezone.value}>
                          {timezone.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.timezone && formik.errors.timezone && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {formik.errors.timezone}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      label="Currency"
                      id="currency"
                      name="currency"
                      value={formik.values.currency}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.currency && Boolean(formik.errors.currency)}
                    >
                      {currencies.map((currency) => (
                        <MenuItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.currency && formik.errors.currency && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {formik.errors.currency}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Fiscal Year Start"
                      value={formik.values.fiscalYearStart}
                      onChange={(date) => formik.setFieldValue('fiscalYearStart', date)}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          fullWidth 
                          error={formik.touched.fiscalYearStart && Boolean(formik.errors.fiscalYearStart)}
                          helperText={formik.touched.fiscalYearStart && formik.errors.fiscalYearStart}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>
      </Box>
    </MainLayout>
  );
};

export default CompanySettings;