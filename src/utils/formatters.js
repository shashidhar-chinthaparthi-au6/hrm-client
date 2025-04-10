import { format, parseISO } from 'date-fns';

// Date formatting
export const formatDate = (date, formatStyle = 'dd MMM yyyy') => {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatStyle);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

export const formatDateTime = (date, formatStyle = 'dd MMM yyyy, hh:mm a') => {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatStyle);
  } catch (error) {
    console.error('DateTime formatting error:', error);
    return '';
  }
};

export const formatTime = (date, formatStyle = 'hh:mm a') => {
  if (!date) return '';
  
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatStyle);
  } catch (error) {
    console.error('Time formatting error:', error);
    return '';
  }
};

// Currency formatting
export const formatCurrency = (amount, currencyCode = 'INR', locale = 'en-IN') => {
  if (amount === null || amount === undefined) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return '';
  }
};

// Number formatting
export const formatNumber = (number, locale = 'en-IN') => {
  if (number === null || number === undefined) return '';
  
  try {
    return new Intl.NumberFormat(locale).format(number);
  } catch (error) {
    console.error('Number formatting error:', error);
    return '';
  }
};

// Percentage formatting
export const formatPercent = (value, locale = 'en-IN') => {
  if (value === null || value === undefined) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value / 100);
  } catch (error) {
    console.error('Percentage formatting error:', error);
    return '';
  }
};

// Name formatting
export const formatName = (firstName, lastName, middleName = '') => {
  const names = [firstName, middleName, lastName].filter(Boolean);
  return names.join(' ');
};

// Phone number formatting
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Basic Indian phone number formatting: +91 98765 43210
  if (phoneNumber.length === 10) {
    return `+91 ${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`;
  }
  
  return phoneNumber;
};

// Address formatting
export const formatAddress = (addressObj) => {
  if (!addressObj) return '';
  
  const {
    street, city, state, zipCode, country,
  } = addressObj;
  
  const addressParts = [street, city, state, zipCode, country].filter(Boolean);
  return addressParts.join(', ');
};

// Duration formatting (from minutes)
export const formatDuration = (minutes) => {
  if (minutes === null || minutes === undefined) return '';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min${mins !== 1 ? 's' : ''}`;
  }
  
  if (mins === 0) {
    return `${hours} hr${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hr${hours !== 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return '';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};