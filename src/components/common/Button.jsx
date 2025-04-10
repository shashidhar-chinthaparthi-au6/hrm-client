import React from 'react';
import PropTypes from 'prop-types';
// import './Button.css';

const Button = ({
  children,
  type = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  fullWidth = false,
  icon,
  loading = false,
  className = '',
  ...rest
}) => {
  const buttonClasses = `
    button 
    button--${type} 
    button--${size}
    ${fullWidth ? 'button--full-width' : ''}
    ${disabled ? 'button--disabled' : ''}
    ${loading ? 'button--loading' : ''}
    ${className}
  `;

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className="button__loader"></span>}
      {icon && !loading && <span className="button__icon">{icon}</span>}
      <span className="button__text">{children}</span>
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'link', 'ghost']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;