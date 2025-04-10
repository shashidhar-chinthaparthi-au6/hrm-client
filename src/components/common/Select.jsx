import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
// import './Select.css';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  loading = false,
  clearable = false,
  searchable = false,
  multiple = false,
  label,
  error,
  required = false,
  className = '',
  dropdownClassName = '',
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const selectRef = useRef(null);
  const inputRef = useRef(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input on dropdown open
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Filter options based on search value
  const filteredOptions = searchable && searchValue
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchValue.toLowerCase()))
    : options;

  // Handle selecting an option
  const handleOptionSelect = (option) => {
    if (disabled) return;
    
    if (multiple) {
      const selectedValues = Array.isArray(value) ? value : [];
      const isSelected = selectedValues.some(val => val === option.value);
      
      if (isSelected) {
        onChange(selectedValues.filter(val => val !== option.value));
      } else {
        onChange([...selectedValues, option.value]);
      }
    } else {
      onChange(option.value);
      setIsOpen(false);
    }
    
    if (searchable && !multiple) {
      setSearchValue('');
    }
  };

  // Clear selection
  const handleClear = (e) => {
    e.stopPropagation();
    onChange(multiple ? [] : null);
    setSearchValue('');
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Get selected option label(s)
  const getSelectedLabel = () => {
    if (multiple) {
      if (!Array.isArray(value) || value.length === 0) return '';
      
      return options
        .filter(option => value.includes(option.value))
        .map(option => option.label)
        .join(', ');
    } else {
      const selectedOption = options.find(option => option.value === value);
      return selectedOption ? selectedOption.label : '';
    }
  };

  // Determine if there is a selected value
  const hasValue = multiple 
    ? Array.isArray(value) && value.length > 0 
    : value !== null && value !== undefined;

  return (
    <div className={`select-wrapper ${className}`}>
      {label && (
        <label className="select__label">
          {label} {required && <span className="select__required">*</span>}
        </label>
      )}
      
      <div 
        ref={selectRef}
        className={`
          select 
          ${isOpen ? 'select--open' : ''} 
          ${disabled ? 'select--disabled' : ''} 
          ${loading ? 'select--loading' : ''} 
          ${error ? 'select--error' : ''}
        `}
        onClick={toggleDropdown}
        {...rest}
      >
        <div className="select__control">
          {searchable && isOpen ? (
            <input 
              ref={inputRef}
              type="text"
              className="select__search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder={placeholder}
            />
          ) : (
            <div className="select__value">
              {hasValue ? getSelectedLabel() : (
                <span className="select__placeholder">{placeholder}</span>
              )}
            </div>
          )}
          
          <div className="select__indicators">
            {loading && <div className="select__loading-indicator" />}
            
            {clearable && hasValue && !disabled && (
              <button 
                type="button"
                className="select__clear-indicator"
                onClick={handleClear}
                aria-label="Clear selection"
              >
                &times;
              </button>
            )}
            
            <div className="select__dropdown-indicator">
              <svg viewBox="0 0 20 20" width="16" height="16">
                <path d="M5 8l5 5 5-5z" />
              </svg>
            </div>
          </div>
        </div>
        
        {isOpen && (
          <div className={`select__menu ${dropdownClassName}`}>
            {filteredOptions.length === 0 ? (
              <div className="select__no-options">No options</div>
            ) : (
              filteredOptions.map(option => {
                const isSelected = multiple
                  ? Array.isArray(value) && value.includes(option.value)
                  : value === option.value;
                  
                return (
                  <div
                    key={option.value}
                    className={`select__option ${isSelected ? 'select__option--selected' : ''}`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {multiple && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="select__option-checkbox"
                      />
                    )}
                    <span className="select__option-label">{option.label}</span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      
      {error && <div className="select__error">{error}</div>}
    </div>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  clearable: PropTypes.bool,
  searchable: PropTypes.bool,
  multiple: PropTypes.bool,
  label: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  dropdownClassName: PropTypes.string,
};

export default Select;