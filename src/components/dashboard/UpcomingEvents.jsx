import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
// import './UpcomingEvents.css';

const UpcomingEvents = ({ 
  events = [], 
  maxItems = 5, 
  showViewAll = true,
  onEventClick,
  loading = false,
  className = ''
}) => {
  const [displayEvents, setDisplayEvents] = useState([]);
  
  useEffect(() => {
    // Sort events by date and limit to maxItems
    const sortedEvents = [...events]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .filter(event => new Date(event.date) >= new Date())
      .slice(0, maxItems);
    
    setDisplayEvents(sortedEvents);
  }, [events, maxItems]);

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time to readable format
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get event type icon
  const getEventIcon = (type) => {
    switch (type) {
      case 'meeting':
        return (
          <svg viewBox="0 0 24 24" className="event-icon meeting">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 11h-3v3c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5v-3h-3c-.83 0-1.5-.67-1.5-1.5S6.67 10 7.5 10h3V7c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v3h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
          </svg>
        );
      case 'holiday':
        return (
          <svg viewBox="0 0 24 24" className="event-icon holiday">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1z" />
          </svg>
        );
      case 'birthday':
        return (
          <svg viewBox="0 0 24 24" className="event-icon birthday">
            <path d="M12 6c1.11 0 2-.9 2-2 0-.38-.1-.73-.29-1.03L12 0l-1.71 2.97c-.19.3-.29.65-.29 1.03 0 1.1.9 2 2 2zm4.6 9.99l-1.07-1.07-1.08 1.07c-1.3 1.3-3.58 1.31-4.89 0l-1.07-1.07-1.09 1.07C6.75 16.64 5.88 17 4.96 17c-.73 0-1.4-.23-1.96-.61V21c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-4.61c-.56.38-1.23.61-1.96.61-.92 0-1.79-.36-2.44-1.01zM18 9h-5V7h-2v2H6c-1.66 0-3 1.34-3 3v1.54c0 1.08.88 1.96 1.96 1.96.52 0 1.02-.2 1.38-.57l2.14-2.13 2.13 2.13c.74.74 2.03.74 2.77 0l2.14-2.13 2.13 2.13c.37.37.86.57 1.38.57 1.08 0 1.96-.88 1.96-1.96V12C21 10.34 19.66 9 18 9z" />
          </svg>
        );
      case 'deadline':
        return (
          <svg viewBox="0 0 24 24" className="event-icon deadline">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" className="event-icon default">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z" />
          </svg>
        );
    }
  };

  // Calculate days remaining
  const getDaysRemaining = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventDate = new Date(dateString);
    eventDate.setHours(0, 0, 0, 0);
    
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  return (
    <Card 
      title="Upcoming Events" 
      className={`upcoming-events-card ${className}`}
      headerAction={showViewAll && (
        <Link to="/calendar" className="view-all-link">
          View all
        </Link>
      )}
    >
      {loading ? (
        <div className="events-loading">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : displayEvents.length > 0 ? (
        <div className="events-list">
          {displayEvents.map((event) => (
            <div 
              key={event.id} 
              className={`event-item ${event.priority}`}
              onClick={() => onEventClick && onEventClick(event)}
            >
              <div className="event-date-container">
                {getEventIcon(event.type)}
                <div className="event-date">
                  {formatDate(event.date)}
                </div>
              </div>
              
              <div className="event-details">
                <div className="event-title">{event.title}</div>
                <div className="event-meta">
                  {event.time && (
                    <span className="event-time">
                      <svg viewBox="0 0 24 24" width="14" height="14">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                      </svg>
                      {formatTime(event.date)}
                    </span>
                  )}
                  
                  {event.location && (
                    <span className="event-location">
                      <svg viewBox="0 0 24 24" width="14" height="14">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      {event.location}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="event-status">
                <span className={`days-remaining ${event.priority}`}>
                  {getDaysRemaining(event.date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-events">
          <svg viewBox="0 0 24 24" width="48" height="48">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
          </svg>
          <p>No upcoming events</p>
        </div>
      )}
    </Card>
  );
};

UpcomingEvents.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      time: PropTypes.string,
      type: PropTypes.oneOf(['meeting', 'holiday', 'birthday', 'deadline', 'other']),
      location: PropTypes.string,
      priority: PropTypes.oneOf(['high', 'medium', 'low']),
    })
  ),
  maxItems: PropTypes.number,
  showViewAll: PropTypes.bool,
  onEventClick: PropTypes.func,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default UpcomingEvents;