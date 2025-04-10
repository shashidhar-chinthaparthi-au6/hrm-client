/**
 * validators.js - Input validation utilities for the HR application
 */

// Email validation
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  // Password validation (min 8 chars, at least 1 number, 1 uppercase, 1 lowercase)
  export const isValidPassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return regex.test(password);
  };
  
  // Phone number validation
  export const isValidPhone = (phone) => {
    const regex = /^\+?[0-9]{10,15}$/;
    return regex.test(phone);
  };
  
  // URL validation
  export const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Required field validation
  export const isRequired = (value) => {
    if (value === null || value === undefined) return false;
    return String(value).trim().length > 0;
  };
  
  // Min/Max length validation
  export const hasMinLength = (value, min) => String(value).length >= min;
  export const hasMaxLength = (value, max) => String(value).length <= max;
  
  // Number range validation
  export const isInRange = (value, min, max) => {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
  };
  
  // Date validation
  export const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };
  
  // Future date validation
  export const isFutureDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isNaN(date.getTime()) && date >= today;
  };
  
  // Past date validation
  export const isPastDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isNaN(date.getTime()) && date < today;
  };
  
  // File size validation (in MB)
  export const isValidFileSize = (file, maxSizeMB) => {
    return file.size <= maxSizeMB * 1024 * 1024;
  };
  
  // File type validation
  export const isValidFileType = (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
  };
  
  // Form validation helper
  export const validateForm = (values, validationRules) => {
    const errors = {};
    
    Object.keys(validationRules).forEach(field => {
      const fieldRules = validationRules[field];
      
      // Check required
      if (fieldRules.required && !isRequired(values[field])) {
        errors[field] = fieldRules.requiredMessage || 'This field is required';
        return;
      }
      
      // Skip other validations if field is empty and not required
      if (!isRequired(values[field]) && !fieldRules.required) {
        return;
      }
      
      // Check min length
      if (fieldRules.minLength && !hasMinLength(values[field], fieldRules.minLength)) {
        errors[field] = `Must be at least ${fieldRules.minLength} characters`;
      }
      
      // Check max length
      if (fieldRules.maxLength && !hasMaxLength(values[field], fieldRules.maxLength)) {
        errors[field] = `Must not exceed ${fieldRules.maxLength} characters`;
      }
      
      // Check email format
      if (fieldRules.isEmail && !isValidEmail(values[field])) {
        errors[field] = 'Please enter a valid email address';
      }
      
      // Check password strength
      if (fieldRules.isPassword && !isValidPassword(values[field])) {
        errors[field] = 'Password must be at least 8 characters and include uppercase, lowercase and number';
      }
      
      // Check phone format
      if (fieldRules.isPhone && !isValidPhone(values[field])) {
        errors[field] = 'Please enter a valid phone number';
      }
      
      // Custom validation
      if (fieldRules.custom && typeof fieldRules.custom === 'function') {
        const customError = fieldRules.custom(values[field], values);
        if (customError) {
          errors[field] = customError;
        }
      }
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };