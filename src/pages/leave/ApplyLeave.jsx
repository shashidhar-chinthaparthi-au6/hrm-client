import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

// Components
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import DatePicker from '../../components/common/DatePicker';
// import { LeaveBalance } from '../../components/leave/LeaveBalance';

// Services
// import { createLeaveRequest, getLeaveTypes, getEmployeeLeaveBalance } from '../../services/leaveService';

const ApplyLeave = () => {
  const navigate = useNavigate();
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [calculatedDays, setCalculatedDays] = useState(0);
  
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const types = await getLeaveTypes();
        setLeaveTypes(types.map(type => ({ value: type.id, label: type.name })));
        
        const balances = await getEmployeeLeaveBalance();
        setLeaveBalances(balances);
      } catch (error) {
        toast.error('Failed to load leave information');
        console.error('Error fetching leave data:', error);
      }
    };
    
    fetchInitialData();
  }, []);
  
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      // Calculate business days between two dates (excluding weekends)
      const calcDays = getBusinessDayCount(dateRange.startDate, dateRange.endDate);
      setCalculatedDays(calcDays);
    }
  }, [dateRange]);
  
  const getBusinessDayCount = (startDate, endDate) => {
    let count = 0;
    const curDate = new Date(startDate);
    const end = new Date(endDate);
    
    while (curDate <= end) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
      curDate.setDate(curDate.getDate() + 1);
    }
    
    return count;
  };

  const formik = useFormik({
    initialValues: {
      leaveTypeId: '',
      startDate: '',
      endDate: '',
      halfDay: false,
      reason: '',
      contactInfo: '',
      attachments: null,
    },
    validationSchema: Yup.object({
      leaveTypeId: Yup.string().required('Leave type is required'),
      startDate: Yup.date().required('Start date is required'),
      endDate: Yup.date()
        .required('End date is required')
        .min(Yup.ref('startDate'), 'End date must be after start date'),
      reason: Yup.string().required('Reason is required').min(10, 'Please provide more details'),
      contactInfo: Yup.string(),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Prepare form data for file uploads
        const formData = new FormData();
        Object.keys(values).forEach(key => {
          if (key === 'attachments' && values[key]) {
            for (let i = 0; i < values[key].length; i++) {
              formData.append('attachments', values[key][i]);
            }
          } else {
            formData.append(key, values[key]);
          }
        });
        
        // Add calculated days
        formData.append('numberOfDays', calculatedDays);
        
        await createLeaveRequest(formData);
        toast.success('Leave request submitted successfully');
        navigate('/leave/leave-management');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to submit leave request');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleDateChange = (field, date) => {
    formik.setFieldValue(field, date);
    
    if (field === 'startDate') {
      setDateRange(prev => ({ ...prev, startDate: date }));
    } else if (field === 'endDate') {
      setDateRange(prev => ({ ...prev, endDate: date }));
    }
  };

  const handleFileChange = (e) => {
    formik.setFieldValue('attachments', e.currentTarget.files);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Apply for Leave</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Select
                    label="Leave Type"
                    name="leaveTypeId"
                    options={leaveTypes}
                    value={formik.values.leaveTypeId}
                    onChange={formik.handleChange}
                    error={formik.touched.leaveTypeId && formik.errors.leaveTypeId}
                    required
                  />
                </div>
                
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    id="halfDay"
                    name="halfDay"
                    checked={formik.values.halfDay}
                    onChange={formik.handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="halfDay" className="text-sm text-gray-700">Half Day Leave</label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <DatePicker
                  label="Start Date"
                  name="startDate"
                  value={formik.values.startDate}
                  onChange={(date) => handleDateChange('startDate', date)}
                  error={formik.touched.startDate && formik.errors.startDate}
                  required
                  minDate={new Date()}
                />
                
                <DatePicker
                  label="End Date"
                  name="endDate"
                  value={formik.values.endDate}
                  onChange={(date) => handleDateChange('endDate', date)}
                  error={formik.touched.endDate && formik.errors.endDate}
                  required
                  disabled={!formik.values.startDate}
                  minDate={formik.values.startDate ? new Date(formik.values.startDate) : new Date()}
                />
              </div>
              
              {calculatedDays > 0 && (
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    You're requesting <strong>{calculatedDays}</strong> working day{calculatedDays !== 1 ? 's' : ''} of leave
                  </p>
                </div>
              )}
              
              <div className="mb-6">
                <Input
                  label="Reason for Leave"
                  name="reason"
                  as="textarea"
                  rows={4}
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                  error={formik.touched.reason && formik.errors.reason}
                  required
                  placeholder="Please explain the reason for your leave request..."
                />
              </div>
              
              <div className="mb-6">
                <Input
                  label="Emergency Contact Information"
                  name="contactInfo"
                  value={formik.values.contactInfo}
                  onChange={formik.handleChange}
                  error={formik.touched.contactInfo && formik.errors.contactInfo}
                  placeholder="Phone number or email during your leave (optional)"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachments (if any)
                </label>
                <input
                  type="file"
                  name="attachments"
                  onChange={handleFileChange}
                  multiple
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-1 text-xs text-gray-500">You can upload medical certificates or other supporting documents</p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/leave/leave-management')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </Card>
        </div>
        
        <div>
          <LeaveBalance balances={leaveBalances} />
          
          <Card className="mt-4">
            <h3 className="text-lg font-medium mb-3">Leave Policy Highlights</h3>
            <ul className="list-disc list-inside text-sm space-y-2 text-gray-600">
              <li>Leave requests should be submitted at least 3 days in advance</li>
              <li>Urgent/medical leaves can be applied with proper documentation</li>
              <li>Unused annual leaves can be carried forward (max 5 days)</li>
              <li>Your manager will be notified automatically</li>
              <li>You'll receive email notifications about the status of your request</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;