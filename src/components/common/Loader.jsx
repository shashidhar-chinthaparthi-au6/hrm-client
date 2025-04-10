// src/components/common/Loader.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './Loader.css';

/**
 * Loader component for displaying loading states
 * 
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the loader ('small', 'medium', 'large')
 * @param {string} props.type - Type of loader ('spinner', 'dots', 'pulse', 'linear')
 * @param {string} props.color - Color of the loader ('primary', 'secondary', 'success', 'danger', 'warning', 'info')
 * @param {boolean} props.fullScreen - Whether the loader should cover the full screen
 * @param {boolean} props.overlay - Whether to show a background overlay
 * @param {string} props.text - Optional loading text to display
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactNode} Loader component
 */
const Loader = ({
  size = 'medium',
  type = 'spinner',
  color = 'primary',
  fullScreen = false,
  overlay = false,
  text = '',
  className = '',
}) => {
  const containerClasses = `loader-container ${fullScreen ? 'loader-fullscreen' : ''} ${
    overlay ? 'loader-overlay' : ''
  } ${className}`;

  const loaderClasses = `loader loader-${size} loader-${type} loader-${color}`;
  
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={loaderClasses}>
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
          </div>
        );
      case 'pulse':
        return <div className={loaderClasses}></div>;
      case 'linear':
        return <div className={`${loaderClasses} loader-linear-container`}><div className="loader-linear-bar"></div></div>;
      case 'spinner':
      default:
        return <div className={loaderClasses}></div>;
    }
  };

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      {renderLoader()}
      {text && <p className="loader-text">{text}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  type: PropTypes.oneOf(['spinner', 'dots', 'pulse', 'linear']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info']),
  fullScreen: PropTypes.bool,
  overlay: PropTypes.bool,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default Loader;