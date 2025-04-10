import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
// import './QuickActions.css';

const QuickActions = ({ 
  actions = [], 
  className = '',
  title = 'Quick Actions',
  columns = 3,
  onActionClick
}) => {
  // Default quick actions if none provided
  const defaultActions = [
    {
      id: 'attendance',
      name: 'Mark Attendance',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
        </svg>
      ),
      color: '#4caf50',
      link: '/attendance/checkin',
    },
    {
      id: 'leave',
      name: 'Apply Leave',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
        </svg>
      ),
      color: '#ff9800',
      link: '/leave/apply',
    },
    {
      id: 'payslip',
      name: 'View Payslip',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      ),
      color: '#2196f3',
      link: '/payroll/payslips',
    },
    {
      id: 'team',
      name: 'My Team',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      ),
      color: '#9c27b0',
      link: '/employee/team',
    },
    {
      id: 'tasks',
      name: 'My Tasks',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
        </svg>
      ),
      color: '#f44336',
      link: '/tasks',
    },
    {
      id: 'performance',
      name: 'Performance',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
        </svg>
      ),
      color: '#673ab7',
      link: '/performance',
    },
  ];

  const displayActions = actions.length > 0 ? actions : defaultActions;
  
  // Set grid-template-columns based on the columns prop
  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  return (
    <Card className={`quick-actions ${className}`}>
      <div className="quick-actions-header">
        <h3 className="quick-actions-title">{title}</h3>
      </div>
      
      <div className="quick-actions-grid" style={gridStyle}>
        {displayActions.map((action) => (
          <Link
            key={action.id}
            to={action.link}
            className="quick-action-item"
            onClick={(e) => {
              if (onActionClick) {
                e.preventDefault();
                onActionClick(action);
              }
            }}
          >
            <div 
              className="quick-action-icon" 
              style={{ backgroundColor: action.color }}
            >
              {action.icon}
            </div>
            <div className="quick-action-name">{action.name}</div>
          </Link>
        ))}
      </div>
    </Card>
  );
};

QuickActions.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      color: PropTypes.string,
      link: PropTypes.string.isRequired,
    })
  ),
  className: PropTypes.string,
  title: PropTypes.string,
  columns: PropTypes.number,
  onActionClick: PropTypes.func,
};

export default QuickActions;