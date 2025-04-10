import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Card from '../common/Card';
import './EmployeeCard.css';

const EmployeeCard = ({
  employee,
  onClick,
  showActions = true,
  showContactInfo = true,
  compact = false,
  className = '',
}) => {
  if (!employee) return null;

  const {
    id,
    firstName,
    lastName,
    email,
    phone,
    avatar,
    department,
    designation,
    employeeId,
    jobTitle,
    status = 'active',
    dateOfJoining,
  } = employee;

  const name = `${firstName} ${lastName}`;
  const formattedJoiningDate = dateOfJoining ? new Date(dateOfJoining).toLocaleDateString() : 'N/A';

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
      case 'on leave':
        return 'warning';
      case 'probation':
        return 'info';
      default:
        return 'default';
    }
  };

  const employeeCardClasses = `employee-card ${compact ? 'compact' : ''} ${className}`;

  return (
    <Card className={employeeCardClasses} onClick={onClick && (() => onClick(employee))}>
      <div className="employee-card-header">
        <div className="employee-avatar-container">
          <Avatar 
            src={avatar} 
            name={name} 
            size={compact ? 'medium' : 'large'} 
            className="employee-avatar"
          />
          {status && (
            <Badge 
              variant={getStatusVariant(status)} 
              className="employee-status-badge"
            >
              {status}
            </Badge>
          )}
        </div>
        
        <div className="employee-basic-info">
          <h3 className="employee-name">
            {onClick ? (
              <span className="clickable">{name}</span>
            ) : (
              <Link to={`/employees/${id}`}>{name}</Link>
            )}
          </h3>
          <p className="employee-title">{jobTitle || designation?.name || 'N/A'}</p>
          <p className="employee-department">{department?.name || 'N/A'}</p>
          <p className="employee-id">ID: {employeeId}</p>
        </div>
      </div>
      
      {!compact && showContactInfo && (
        <div className="employee-card-content">
          <div className="employee-contact-info">
            <div className="contact-item">
              <svg className="contact-icon email-icon" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <a href={`mailto:${email}`} className="contact-value">{email}</a>
            </div>
            
            <div className="contact-item">
              <svg className="contact-icon phone-icon" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.32.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              <a href={`tel:${phone}`} className="contact-value">{phone}</a>
            </div>
            
            <div className="contact-item">
              <svg className="contact-icon calendar-icon" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
              </svg>
              <span className="contact-value">Joined: {formattedJoiningDate}</span>
            </div>
          </div>
        </div>
      )}
      
      {showActions && (
        <div className="employee-card-actions">
          <Link to={`/employees/${id}`} className="card-action-btn view-btn">
            <svg className="action-icon" viewBox="0 0 24 24">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
            View
          </Link>
          <Link to={`/employees/${id}/edit`} className="card-action-btn edit-btn">
            <svg className="action-icon" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
            Edit
          </Link>
          <Link to={`/employees/${id}/performance`} className="card-action-btn performance-btn">
            <svg className="action-icon" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z" />
            </svg>
            Performance
          </Link>
        </div>
      )}
    </Card>
  );
};

EmployeeCard.propTypes = {
  employee: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string,
    phone: PropTypes.string,
    avatar: PropTypes.string,
    department: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    }),
    designation: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
    }),
    employeeId: PropTypes.string,
    jobTitle: PropTypes.string,
    status: PropTypes.string,
    dateOfJoining: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
  }).isRequired,
  onClick: PropTypes.func,
  showActions: PropTypes.bool,
  showContactInfo: PropTypes.bool,
  compact: PropTypes.bool,
  className: PropTypes.string,
};

export default EmployeeCard;