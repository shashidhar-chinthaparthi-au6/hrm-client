import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
// import './Input.css';

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  name,
  error,
  helperText,
  disabled = false,
  required = false,
  prefix,
  suffix,
  className = '',
  ...rest
}, ref) => {
  const inputId = `input-${name}-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className={`input-wrapper ${disabled ? 'input-wrapper--disabled' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input__label">
          {label} {required && <span className="input__required">*</span>}
        </label>
      )}
      
      <div className={`input__container ${error ? 'input__container--error' : ''}`}>
        {prefix && <div className="input__prefix">{prefix}</div>}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="input__field"
          {...rest}
        />
        
        {suffix && <div className="input__suffix">{suffix}</div>}
      </div>
      
      {(error || helperText) && (
        <div className={`input__helper-text ${error ? 'input__helper-text--error' : ''}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  className: PropTypes.string,
};

Input.displayName = 'Input';

export default Input;