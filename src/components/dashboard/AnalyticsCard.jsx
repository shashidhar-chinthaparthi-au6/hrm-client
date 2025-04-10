import React from 'react';
import PropTypes from 'prop-types';
// import './AnalyticsCard.css';

const AnalyticsCard = ({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  changeTimeframe = 'vs last month',
  footer,
  loading = false,
  onClick,
  variant = 'default',
  className = '',
}) => {
  // Determine change icon and class
  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" className="change-icon positive">
            <path d="M7 14l5-5 5 5z" />
          </svg>
        );
      case 'negative':
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" className="change-icon negative">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" width="16" height="16" className="change-icon neutral">
            <path d="M22 12l-4-4v3H3v2h15v3z" />
          </svg>
        );
    }
  };

  return (
    <div 
      className={`analytics-card ${variant} ${className} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      {loading ? (
        <div className="analytics-card-skeleton">
          <div className="skeleton-title"></div>
          <div className="skeleton-value"></div>
          <div className="skeleton-footer"></div>
        </div>
      ) : (
        <>
          <div className="analytics-card-header">
            <h3 className="analytics-card-title">{title}</h3>
            {icon && <div className="analytics-card-icon">{icon}</div>}
          </div>
          
          <div className="analytics-card-value">{value}</div>
          
          {change !== undefined && (
            <div className={`analytics-card-change ${changeType}`}>
              {getChangeIcon()}
              <span className="change-value">{change}</span>
              {changeTimeframe && (
                <span className="change-timeframe">{changeTimeframe}</span>
              )}
            </div>
          )}
          
          {footer && (
            <div className="analytics-card-footer">{footer}</div>
          )}
        </>
      )}
    </div>
  );
};

AnalyticsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.node,
  change: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  changeType: PropTypes.oneOf(['positive', 'negative', 'neutral']),
  changeTimeframe: PropTypes.string,
  footer: PropTypes.node,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger', 'info']),
  className: PropTypes.string,
};

export default AnalyticsCard;