import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
// import './RecentActivities.css';

const RecentActivities = ({ 
  activities = [], 
  loading = false, 
  maxItems = 5, 
  showViewAll = true,
  onViewAll,
  className = '' 
}) => {
  const [visibleActivities, setVisibleActivities] = useState([]);
  
  useEffect(() => {
    // Limit the number of activities displayed
    setVisibleActivities(activities.slice(0, maxItems));
  }, [activities, maxItems]);

  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'leave':
        return (
          <div className="activity-icon leave">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
            </svg>
          </div>
        );
      case 'checkin':
        return (
          <div className="activity-icon checkin">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M11 7l-3.2 3.2 1.4 1.4L11 9.8V17h2V9.8l1.8 1.8 1.4-1.4L13 7l-1-1-1 1zM17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 20H7V3h10v18z" />
            </svg>
          </div>
        );
      case 'checkout':
        return (
          <div className="activity-icon checkout">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M13 7l-3.2 3.2 1.4 1.4L13 9.8V17h2V9.8l1.8 1.8 1.4-1.4L16 7l-1-1-1 1zM17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 20H7V3h10v18z" transform="rotate(180 12 12)" />
            </svg>
          </div>
        );
      case 'task':
        return (
          <div className="activity-icon task">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
          </div>
        );
      case 'approval':
        return (
          <div className="activity-icon approval">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </div>
        );
      case 'rejection':
        return (
          <div className="activity-icon rejection">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </div>
        );
      case 'feedback':
        return (
          <div className="activity-icon feedback">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="activity-icon default">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
          </div>
        );
    }
  };

  // Format timestamp to relative time
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - activityTime) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      // Format date for older activities
      const options = { month: 'short', day: 'numeric' };
      return activityTime.toLocaleDateString(undefined, options);
    }
  };

  return (
    <Card className={`recent-activities ${className}`}>
      <div className="activities-header">
        <h3 className="activities-title">Recent Activities</h3>
        {showViewAll && (
          <button 
            className="view-all-button"
            onClick={onViewAll}
          >
            View All
          </button>
        )}
      </div>
      
      <div className="activities-content">
        {loading ? (
          <div className="activities-loading">
            <div className="loading-spinner"></div>
            <p>Loading activities...</p>
          </div>
        ) : visibleActivities.length > 0 ? (
          <ul className="activities-list">
            {visibleActivities.map((activity) => (
              <li key={activity.id} className="activity-item">
                {getActivityIcon(activity.type)}
                
                <div className="activity-details">
                  <div className="activity-user">
                    <Avatar 
                      src={activity.user?.avatar} 
                      name={activity.user?.name} 
                      size="small" 
                    />
                    <span className="user-name">{activity.user?.name}</span>
                  </div>
                  
                  <div className="activity-description">
                    {activity.description}
                  </div>
                  
                  <div className="activity-time">
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-activities">
            <svg viewBox="0 0 24 24" width="48" height="48">
              <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z" />
            </svg>
            <p>No recent activities</p>
          </div>
        )}
      </div>
    </Card>
  );
};

RecentActivities.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['leave', 'checkin', 'checkout', 'task', 'approval', 'rejection', 'feedback', 'other']),
      description: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string,
      }),
    })
  ),
  loading: PropTypes.bool,
  maxItems: PropTypes.number,
  showViewAll: PropTypes.bool,
  onViewAll: PropTypes.func,
  className: PropTypes.string,
};

export default RecentActivities;