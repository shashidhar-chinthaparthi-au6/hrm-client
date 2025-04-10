// dateUtils.js - Date manipulation utilities

import { format, parseISO, differenceInDays, differenceInMonths, 
    differenceInYears, addDays, addMonths, isAfter, isBefore, 
    isEqual, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
  
  /**
   * Format date to display string
   * @param {Date|string} date - Date to format
   * @param {string} formatStr - Format string (default: 'dd MMM yyyy')
   * @returns {string} Formatted date string
   */
  export const formatDate = (date, formatStr = 'dd MMM yyyy') => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  };
  
  /**
   * Format time to display string
   * @param {Date|string} date - Date to format
   * @returns {string} Formatted time string (HH:mm)
   */
  export const formatTime = (date) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'HH:mm');
  };
  
  /**
   * Format date and time to display string
   * @param {Date|string} date - Date to format
   * @returns {string} Formatted date and time string
   */
  export const formatDateTime = (date) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'dd MMM yyyy, HH:mm');
  };
  
  /**
   * Get days difference between two dates
   * @param {Date|string} startDate - Start date
   * @param {Date|string} endDate - End date
   * @returns {number} Number of days
   */
  export const getDaysDifference = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    return differenceInDays(end, start);
  };
  
  /**
   * Get months difference between two dates
   * @param {Date|string} startDate - Start date
   * @param {Date|string} endDate - End date
   * @returns {number} Number of months
   */
  export const getMonthsDifference = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    return differenceInMonths(end, start);
  };
  
  /**
   * Get years difference between two dates
   * @param {Date|string} startDate - Start date
   * @param {Date|string} endDate - End date
   * @returns {number} Number of years
   */
  export const getYearsDifference = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    return differenceInYears(end, start);
  };
  
  /**
   * Add days to a date
   * @param {Date|string} date - Date to add days to
   * @param {number} days - Number of days to add
   * @returns {Date} Resulting date
   */
  export const addDaysToDate = (date, days) => {
    if (!date) return new Date();
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return addDays(dateObj, days);
  };
  
  /**
   * Add months to a date
   * @param {Date|string} date - Date to add months to
   * @param {number} months - Number of months to add
   * @returns {Date} Resulting date
   */
  export const addMonthsToDate = (date, months) => {
    if (!date) return new Date();
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return addMonths(dateObj, months);
  };
  
  /**
   * Check if a date is after another date
   * @param {Date|string} date - Date to check
   * @param {Date|string} dateToCompare - Date to compare against
   * @returns {boolean} True if date is after dateToCompare
   */
  export const isDateAfter = (date, dateToCompare) => {
    if (!date || !dateToCompare) return false;
    
    const d1 = typeof date === 'string' ? parseISO(date) : date;
    const d2 = typeof dateToCompare === 'string' ? parseISO(dateToCompare) : dateToCompare;
    
    return isAfter(d1, d2);
  };
  
  /**
   * Check if a date is before another date
   * @param {Date|string} date - Date to check
   * @param {Date|string} dateToCompare - Date to compare against
   * @returns {boolean} True if date is before dateToCompare
   */
  export const isDateBefore = (date, dateToCompare) => {
    if (!date || !dateToCompare) return false;
    
    const d1 = typeof date === 'string' ? parseISO(date) : date;
    const d2 = typeof dateToCompare === 'string' ? parseISO(dateToCompare) : dateToCompare;
    
    return isBefore(d1, d2);
  };
  
  /**
   * Check if two dates are equal
   * @param {Date|string} date1 - First date
   * @param {Date|string} date2 - Second date
   * @returns {boolean} True if dates are equal
   */
  export const areDatesEqual = (date1, date2) => {
    if (!date1 || !date2) return false;
    
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    
    return isEqual(d1, d2);
  };
  
  /**
   * Get all days in a month
   * @param {Date|string} date - Date in the month
   * @returns {Date[]} Array of all days in the month
   */
  export const getDaysInMonth = (date) => {
    if (!date) return [];
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const start = startOfMonth(dateObj);
    const end = endOfMonth(dateObj);
    
    return eachDayOfInterval({ start, end });
  };
  
  /**
   * Get formatted duration string from minutes
   * @param {number} minutes - Duration in minutes
   * @returns {string} Formatted duration (e.g. "8h 30m")
   */
  export const formatDuration = (minutes) => {
    if (!minutes || isNaN(minutes)) return '0h 0m';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return `${hours}h ${mins}m`;
  };
  
  /**
   * Get fiscal year range based on current date
   * @param {Date} [currentDate=new Date()] - Current date
   * @param {number} [fiscalYearStartMonth=3] - Month when fiscal year starts (0-11)
   * @returns {Object} Fiscal year start and end dates
   */
  export const getFiscalYearRange = (currentDate = new Date(), fiscalYearStartMonth = 3) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    let fiscalYearStart;
    let fiscalYearEnd;
    
    if (month >= fiscalYearStartMonth) {
      // Current fiscal year
      fiscalYearStart = new Date(year, fiscalYearStartMonth, 1);
      fiscalYearEnd = new Date(year + 1, fiscalYearStartMonth, 0);
    } else {
      // Previous fiscal year
      fiscalYearStart = new Date(year - 1, fiscalYearStartMonth, 1);
      fiscalYearEnd = new Date(year, fiscalYearStartMonth, 0);
    }
    
    return { fiscalYearStart, fiscalYearEnd };
  };
  
  export default {
    formatDate,
    formatTime,
    formatDateTime,
    getDaysDifference,
    getMonthsDifference,
    getYearsDifference,
    addDaysToDate,
    addMonthsToDate,
    isDateAfter,
    isDateBefore,
    areDatesEqual,
    getDaysInMonth,
    formatDuration,
    getFiscalYearRange
  };