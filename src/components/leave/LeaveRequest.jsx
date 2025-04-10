import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import Select from '../common/Select';
import DatePicker from '../common/DatePicker';
import { differenceInDays, isBefore, isWeekend } from 'date-fns';

const LeaveRequest = ({ employeeId, onSubmit, onCancel }) => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    // Fetch leave types and balances
    const fetchLeaveData = async () => {
      try {
        const [typesResponse, balancesResponse, holidaysResponse] = await Promise.all([
          fetch('/api/leave/types'),
          fetch(`/api/employees/${employeeId}/leave-balances`),
          fetch('/api/holidays')
        ]);
        
        const types = await typesResponse.json();
        const balances = await balancesResponse.json();
        const holidaysData = await holidaysResponse.json();
        
        setLeaveTypes(types.map(type => ({ 
          value: type.id, 
          label: type.name 
        })));
        
        setLeaveBalances(balances);
        setHolidays(holidaysData.map(h => new Date(h.date)));
      } catch (error) {
        console.error('Error fetching leave data:', error);
      }
    };

    fetchLeaveData();
  }, [employeeId]);

  const calculateBusinessDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    let count = 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Ensure start date is before end date
    if (isBefore(end, start)) return 0;
    
    const current = new Date(start);
    while (current <= end) {
      // Skip weekends and holidays
      if (!isWeekend(current) && !holidays.some(h => 
        h.getDate() === current.getDate() && 
        h.getMonth() === current.getMonth() && 
        h.getFullYear() === current.getFullYear()
      )) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  };

  const validationSchema = Yup.object({
    leaveType: Yup.string().required('Leave type is required'),
    startDate: Yup.date()
      .required('Start date is required')
      .min(new Date(), 'Start date cannot be in the past'),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date cannot be before start date'),
    reason: Yup.string()
      .required('Reason is required')
      .min(10, 'Please provide more details (at least 10 characters)'),
    contactInfo: Yup.string().required('Contact information is required'),
    halfDay: Yup.boolean(),
    halfDayTime: Yup.string().when('halfDay', {
      is: true,
      then: Yup.string().required('Please specify which half of the day')
    })
  });

  const formik = useFormik({
    initialValues: {
      leaveType: '',
      startDate: null,
      endDate: null,
      reason: '',
      contactInfo: '',
      halfDay: false,
      halfDayTime: 'first-half',
      documents: []
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // Calculate business days
        const days = values.halfDay ? 0.5 : calculateBusinessDays(values.startDate, values.endDate);
        
        // Check if employee has enough leave balance
        if (leaveBalances[values.leaveType] < days) {
          formik.setFieldError('leaveType', `Insufficient leave balance. Available: ${leaveBalances[values.leaveType]} days`);
          return;
        }
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('leaveType', values.leaveType);
        formData.append('startDate', values.startDate.toISOString());
        formData.append('endDate', values.endDate.toISOString());
        formData.append('reason', values.reason);
        formData.append('contactInfo', values.contactInfo);
        formData.append('halfDay', values.halfDay);
        formData.append('halfDayTime', values.halfDayTime);
        formData.append('days', days);
        
        // Append documents if any
        if (values.documents.length > 0) {
          for (let i = 0; i < values.documents.length; i++) {
            formData.append('documents', values.documents[i]);
          }
        }
        
        // Submit the request
        const response = await fetch(`/api/employees/${employeeId}/leave-requests`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Failed to submit leave request');
        }
        
        const data = await response.json();
        onSubmit(data);
      } catch (error) {
        console.error('Error submitting leave request:', error);
        // Show error notification
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Calculate current days selected
  const selectedDays = formik.values.halfDay 
    ? 0.5 
    : calculateBusinessDays(formik.values.startDate, formik.values.endDate);

  // Get current leave type balance
  const currentBalance = formik.values.leaveType 
    ? leaveBalances[formik.values.leaveType] || 0
    : 0;

  const handleFileChange = (event) => {
    formik.setFieldValue('documents', event.target.files);
  };

  return (
    <Card title="Leave Request Form">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Leave Type"
            id="leaveType"
            name="leaveType"
            options={leaveTypes}
            value={formik.values.leaveType}
            onChange={(selected) => formik.setFieldValue('leaveType', selected.value)}
            onBlur={formik.handleBlur}
            error={formik.touched.leaveType && formik.errors.leaveType}
            required
          />
          
          {formik.values.leaveType && (
            <div className="flex items-center py-2">
              <span className="text-sm font-medium text-gray-700">
                Available Balance: 
                <span className={`ml-2 font-bold ${currentBalance < selectedDays ? 'text-red-600' : 'text-green-600'}`}>
                  {currentBalance} days
                </span>
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="halfDay"
            name="halfDay"
            checked={formik.values.halfDay}
            onChange={formik.handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="halfDay" className="ml-2 block text-sm text-gray-700">
            Half Day Leave
          </label>
        </div>
        
        {formik.values.halfDay && (
          <div className="mb-4">
            <Select
              label="Half Day Time"
              id="halfDayTime"
              name="halfDayTime"
              options={[
                { value: 'first-half', label: 'First Half (Morning)' },
                { value: 'second-half', label: 'Second Half (Afternoon)' }
              ]}
              value={formik.values.halfDayTime}
              onChange={(selected) => formik.setFieldValue('halfDayTime', selected.value)}
              onBlur={formik.handleBlur}
              error={formik.touched.halfDayTime && formik.errors.halfDayTime}
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            label="Start Date"
            id="startDate"
            name="startDate"
            value={formik.values.startDate}
            onChange={(date) => formik.setFieldValue('startDate', date)}
            onBlur={formik.handleBlur}
            error={formik.touched.startDate && formik.errors.startDate}
            required
            minDate={new Date()}
          />
          
          {!formik.values.halfDay && (
            <DatePicker
              label="End Date"
              id="endDate"
              name="endDate"
              value={formik.values.endDate}
              onChange={(date) => formik.setFieldValue('endDate', date)}
              onBlur={formik.handleBlur}
              error={formik.touched.endDate && formik.errors.endDate}
              required
              minDate={formik.values.startDate || new Date()}
            />
          )}
        </div>
        
        {formik.values.startDate && formik.values.endDate && !formik.values.halfDay && (
          <div className="bg-blue-50 p-3 rounded-md mb-4">
            <p className="text-sm text-blue-800">
              <strong>Days Requested:</strong> {selectedDays} working day(s)
              {currentBalance < selectedDays && (
                <span className="text-red-600 ml-2">
                  (Exceeds available balance)
                </span>
              )}
            </p>
          </div>
        )}
        
        <Input
          label="Reason for Leave"
          id="reason"
          name="reason"
          value={formik.values.reason}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.reason && formik.errors.reason}
          placeholder="Please provide details for your leave request"
          required
          multiline
          rows={3}
        />
        
        <Input
          label="Contact Information During Leave"
          id="contactInfo"
          name="contactInfo"
          value={formik.values.contactInfo}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.contactInfo && formik.errors.contactInfo}
          placeholder="Phone number or email where you can be reached"
          required
        />
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supporting Documents (optional)
          </label>
          <input
            type="file"
            id="documents"
            name="documents"
            onChange={handleFileChange}
            multiple
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            Upload medical certificates or other relevant documents
          </p>
        </div>
        
        <div className="flex justify-end mt-6 space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            Submit Request
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default LeaveRequest;