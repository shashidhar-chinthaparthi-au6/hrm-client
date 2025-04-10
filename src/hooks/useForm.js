import { useState, useEffect, useCallback } from 'react';
import validators from '../utils/validators';

const useForm = (initialValues = {}, validationSchema = {}, onSubmit = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Update form when initialValues change (e.g., when editing)
  useEffect(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setDirty(false);
  }, [initialValues]);

  // Validate the entire form
  const validateForm = useCallback(() => {
    const newErrors = {};
    let formIsValid = true;

    Object.keys(validationSchema).forEach(field => {
      const value = values[field];
      const fieldRules = validationSchema[field];
      
      if (fieldRules) {
        for (const rule of fieldRules) {
          // Execute validator function
          const validator = validators[rule.type];
          const isValid = validator ? validator(value, rule.params) : true;
          
          if (!isValid) {
            newErrors[field] = rule.message || `Invalid ${field}`;
            formIsValid = false;
            break;
          }
        }
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [values, validationSchema]);

  // Update isValid when values or errors change
  useEffect(() => {
    if (dirty) {
      validateForm();
    }
  }, [values, dirty, validateForm]);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: finalValue
    }));
    
    setDirty(true);
    
    // Mark as touched
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
  }, [touched]);

  // Set a single field value programmatically
  const setFieldValue = useCallback((field, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [field]: value
    }));
    setDirty(true);
  }, []);

  // Set multiple values programmatically
  const setMultipleValues = useCallback((newValues) => {
    setValues(prevValues => ({
      ...prevValues,
      ...newValues
    }));
    setDirty(true);
  }, []);

  // Handle field blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  // Reset the form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setDirty(false);
    setIsSubmitting(false);
  }, [initialValues]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = Object.keys(validationSchema).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    const formIsValid = validateForm();
    
    if (formIsValid && onSubmit) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
  }, [values, onSubmit, validateForm, validationSchema]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setMultipleValues,
    resetForm,
    setErrors // Useful for setting API errors
  };
};

export default useForm;