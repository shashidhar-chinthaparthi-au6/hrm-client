import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
// import './DatePicker.css';

const DatePicker = ({
  selectedDate = new Date(),
  onChange,
  placeholder = 'Select date',
  format = 'MM/DD/YYYY',
  disabled = false,
  minDate,
  maxDate,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [internalDate, setInternalDate] = useState(selectedDate);
  const calendarRef = useRef(null);

  useEffect(() => {
    // Handle clicks outside the calendar to close it
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update internal state when prop changes
  useEffect(() => {
    if (selectedDate) {
      setInternalDate(new Date(selectedDate));
      setCurrentMonth(new Date(selectedDate));
    }
  }, [selectedDate]);

  const formatDate = (date) => {
    if (!date) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year);
  };

  const toggleCalendar = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleDateSelect = (date) => {
    setInternalDate(date);
    onChange(date);
    setIsOpen(false);
  };

  const changeMonth = (offset) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateInRange = (date) => {
    if (minDate && date < new Date(minDate)) {
      return false;
    }
    if (maxDate && date > new Date(maxDate)) {
      return false;
    }
    return true;
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    // Empty cells for days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = internalDate && 
        date.getDate() === internalDate.getDate() && 
        date.getMonth() === internalDate.getMonth() && 
        date.getFullYear() === internalDate.getFullYear();
        
      const isDisabled = !isDateInRange(date);
      
      days.push(
        <div 
          key={`day-${day}`}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
          onClick={() => !isDisabled && handleDateSelect(date)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className={`datepicker-container ${className}`} ref={calendarRef}>
      <div 
        className={`datepicker-input ${disabled ? 'disabled' : ''}`} 
        onClick={toggleCalendar}
      >
        {internalDate ? formatDate(internalDate) : placeholder}
        <svg className="calendar-icon" viewBox="0 0 24 24">
          <path d="M9 10h2v2H9v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-8 4h2v2H9v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM5 22h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2zM5 6h14v14H5V6z"/>
        </svg>
      </div>
      
      {isOpen && (
        <div className="calendar-dropdown">
          <div className="calendar-header">
            <button type="button" onClick={() => changeMonth(-1)}>&lt;</button>
            <div className="current-month">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button type="button" onClick={() => changeMonth(1)}>&gt;</button>
          </div>
          
          <div className="weekdays">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          
          <div className="calendar-days">
            {renderCalendar()}
          </div>
          
          <div className="calendar-footer">
            <button 
              type="button" 
              className="today-button" 
              onClick={() => {
                const today = new Date();
                setCurrentMonth(today);
                if (isDateInRange(today)) {
                  handleDateSelect(today);
                }
              }}
            >
              Today
            </button>
            <button 
              type="button" 
              className="close-button" 
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

DatePicker.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  format: PropTypes.string,
  disabled: PropTypes.bool,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  className: PropTypes.string,
};

export default DatePicker;