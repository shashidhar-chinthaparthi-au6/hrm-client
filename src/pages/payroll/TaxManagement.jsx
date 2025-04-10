import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTaxSettings, updateTaxSettings, addTaxSlab } from '../../redux/actions/taxActions';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Card } from '../../components/common';

const TaxManagement = () => {
  const dispatch = useDispatch();
  const { taxSettings, loading, error } = useSelector(state => state.tax);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [formValues, setFormValues] = useState({
    minAmount: '',
    maxAmount: '',
    taxRate: '',
    applicableFor: [],
    financialYear: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    dispatch(fetchTaxSettings());
  }, [dispatch]);

  const handleAddTaxSlab = () => {
    // Validate form
    const errors = {};
    if (!formValues.minAmount) errors.minAmount = 'Please enter minimum amount';
    if (!formValues.maxAmount) errors.maxAmount = 'Please enter maximum amount';
    if (!formValues.taxRate) errors.taxRate = 'Please enter tax rate';
    if (!formValues.applicableFor || formValues.applicableFor.length === 0) 
      errors.applicableFor = 'Please select applicable groups';
    if (!formValues.financialYear) errors.financialYear = 'Please select financial year';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    dispatch(addTaxSlab(formValues));
    setIsModalOpen(false);
    setFormValues({
      minAmount: '',
      maxAmount: '',
      taxRate: '',
      applicableFor: [],
      financialYear: ''
    });
    showAlert('Tax slab added successfully', 'success');
  };

  const handleUpdateSettings = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());
    dispatch(updateTaxSettings(values));
    showAlert('Tax settings updated successfully', 'success');
  };

  const handleEdit = (record) => {
    setFormValues({
      minAmount: record.minAmount,
      maxAmount: record.maxAmount,
      taxRate: record.taxRate,
      applicableFor: record.applicableFor,
      financialYear: record.financialYear,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    // Implement delete logic
    showAlert('Tax slab deleted successfully', 'success');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    // Clear error when field is filled
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleSelectChange = (event, name) => {
    const { value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    // Clear error when field is filled
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>Loading tax settings...</Box>;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>Error loading tax settings: {error}</Alert>;

  return (
    <Box className="tax-management-container" sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>Tax Management</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="tax management tabs">
          <Tab label="Tax Settings" />
          <Tab label="Tax Slabs" />
          <Tab label="Tax Deductions" />
          <Tab label="Tax Documents" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <Card title="Organization Tax Settings">
          <Box component="form" onSubmit={handleUpdateSettings} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="taxIdentificationNumber"
                  label="Tax Identification Number (TIN)"
                  variant="outlined"
                  required
                  defaultValue={taxSettings?.organizationSettings?.taxIdentificationNumber}
                  placeholder="Enter organization TIN"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="tax-regime-label">Tax Regime</InputLabel>
                  <Select
                    labelId="tax-regime-label"
                    name="taxRegime"
                    defaultValue={taxSettings?.organizationSettings?.taxRegime || ''}
                    label="Tax Regime"
                  >
                    <MenuItem value="old">Old Regime</MenuItem>
                    <MenuItem value="new">New Regime</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" required>
                  <DatePicker
                    label="Financial Year Start"
                    views={['month']}
                    openTo="month"
                    value={taxSettings?.organizationSettings?.financialYearStart || null}
                    slotProps={{ textField: { name: 'financialYearStart', fullWidth: true } }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="tax-calc-method-label">Tax Calculation Method</InputLabel>
                  <Select
                    labelId="tax-calc-method-label"
                    name="taxCalculationMethod"
                    defaultValue={taxSettings?.organizationSettings?.taxCalculationMethod || ''}
                    label="Tax Calculation Method"
                  >
                    <MenuItem value="monthly">Monthly Projection</MenuItem>
                    <MenuItem value="yearly">Yearly Actual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                  Save Settings
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Card 
          title="Tax Slabs"
          action={
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setIsModalOpen(true)}
            >
              Add New Tax Slab
            </Button>
          }
        >
          <TableContainer component={Paper}>
            <Table aria-label="tax slabs table">
              <TableHead>
                <TableRow>
                  <TableCell>Income Range</TableCell>
                  <TableCell>Tax Rate (%)</TableCell>
                  <TableCell>Applicable For</TableCell>
                  <TableCell>Financial Year</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(taxSettings?.taxSlabs || []).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{`${row.minAmount} - ${row.maxAmount}`}</TableCell>
                    <TableCell>{row.taxRate}</TableCell>
                    <TableCell>{row.applicableFor}</TableCell>
                    <TableCell>{row.financialYear}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEdit(row)} color="primary" sx={{ mr: 1 }}>
                        Edit
                      </Button>
                      <Button onClick={() => handleDelete(row.id)} color="error">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!taxSettings?.taxSlabs?.length && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No tax slabs found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Card title="Tax Deduction Types">
          <TableContainer component={Paper}>
            <Table aria-label="tax deductions table">
              <TableHead>
                <TableRow>
                  <TableCell>Deduction Name</TableCell>
                  <TableCell>Section Code</TableCell>
                  <TableCell>Maximum Limit</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(taxSettings?.deductionTypes || []).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.sectionCode}</TableCell>
                    <TableCell>{row.maxLimit}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>
                      <Button color="primary" sx={{ mr: 1 }}>Edit</Button>
                      <Button color="error">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!taxSettings?.deductionTypes?.length && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No deduction types found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Card title="Tax Documents">
          <Box className="tax-documents-section" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Form Generation</Typography>
            <Grid container spacing={2} className="form-grid">
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="outlined" fullWidth>Generate Form 16</Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="outlined" fullWidth>Generate Form 12BA</Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="outlined" fullWidth>Generate Investment Declaration</Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="outlined" fullWidth>Generate TDS Reports</Button>
              </Grid>
            </Grid>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Document Upload</Typography>
            <Grid container spacing={2} className="upload-section">
              <Grid item xs={12} sm={6}>
                <Button variant="outlined" fullWidth>Upload Tax Documents</Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button variant="outlined" fullWidth>Upload Investment Proofs</Button>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </TabPanel>
      
      <Dialog 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="add-tax-slab-title"
      >
        <DialogTitle id="add-tax-slab-title">Add Tax Slab</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Amount"
                name="minAmount"
                type="number"
                value={formValues.minAmount}
                onChange={handleInputChange}
                error={!!formErrors.minAmount}
                helperText={formErrors.minAmount}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Maximum Amount"
                name="maxAmount"
                type="number"
                value={formValues.maxAmount}
                onChange={handleInputChange}
                error={!!formErrors.maxAmount}
                helperText={formErrors.maxAmount}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tax Rate (%)"
                name="taxRate"
                type="number"
                value={formValues.taxRate}
                onChange={handleInputChange}
                error={!!formErrors.taxRate}
                helperText={formErrors.taxRate}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.applicableFor} required>
                <InputLabel id="applicable-for-label">Applicable For</InputLabel>
                <Select
                  labelId="applicable-for-label"
                  multiple
                  name="applicableFor"
                  value={formValues.applicableFor}
                  onChange={(e) => handleSelectChange(e, 'applicableFor')}
                  label="Applicable For"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="senior">Senior Citizen</MenuItem>
                  <MenuItem value="all">All Employees</MenuItem>
                </Select>
                {formErrors.applicableFor && (
                  <FormHelperText>{formErrors.applicableFor}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.financialYear} required>
                <InputLabel id="financial-year-label">Financial Year</InputLabel>
                <Select
                  labelId="financial-year-label"
                  name="financialYear"
                  value={formValues.financialYear}
                  onChange={(e) => handleSelectChange(e, 'financialYear')}
                  label="Financial Year"
                >
                  <MenuItem value="2024-2025">2024-2025</MenuItem>
                  <MenuItem value="2023-2024">2023-2024</MenuItem>
                  <MenuItem value="2022-2023">2022-2023</MenuItem>
                </Select>
                {formErrors.financialYear && (
                  <FormHelperText>{formErrors.financialYear}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTaxSlab} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={alertOpen} 
        autoHideDuration={6000} 
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// TabPanel component for tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tax-tabpanel-${index}`}
      aria-labelledby={`tax-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default TaxManagement;