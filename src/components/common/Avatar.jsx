import React from 'react';
import PropTypes from 'prop-types';
// import './Avatar.css';

const Avatar = ({
  src,
  alt = 'User avatar',
  name,
  size = 'medium',
  shape = 'circle',
  status,
  className = '',
  onClick,
}) => {
  // Extract initials from name
  const getInitials = () => {
    if (!name) return '';
    
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (
      nameParts[0].charAt(0).toUpperCase() + 
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  // Generate background color based on name
  const generateColor = () => {
    if (!name) return '#6c757d'; // Default color
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate a hue between 0 and 360
    const hue = hash % 360;
    // Use a fixed saturation and lightness for better visibility
    return `hsl(${hue}, 65%, 55%)`;
  };

  // Size classes
  const sizeClasses = {
    tiny: 'avatar-tiny',
    small: 'avatar-small',
    medium: 'avatar-medium',
    large: 'avatar-large',
    xlarge: 'avatar-xlarge',
  };

  // Shape classes
  const shapeClasses = {
    circle: 'avatar-circle',
    square: 'avatar-square',
    rounded: 'avatar-rounded',
  };

  // Status classes
  const statusClasses = {
    online: 'status-online',
    away: 'status-away',
    busy: 'status-busy',
    offline: 'status-offline',
  };

  const avatarSizeClass = sizeClasses[size] || sizeClasses.medium;
  const avatarShapeClass = shapeClasses[shape] || shapeClasses.circle;
  
  return (
    <div 
      className={`avatar-container ${avatarSizeClass} ${avatarShapeClass} ${className}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="avatar-image" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.parentNode.classList.add('avatar-fallback');
            e.target.parentNode.setAttribute('data-initials', getInitials());
            e.target.parentNode.style.backgroundColor = generateColor();
          }}
        />
      ) : (
        <div 
          className="avatar-fallback"
          data-initials={getInitials()}
          style={{ backgroundColor: generateColor() }}
        />
      )}
      
      {status && (
        <span className={`avatar-status ${statusClasses[status] || ''}`} />
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'xlarge']),
  shape: PropTypes.oneOf(['circle', 'square', 'rounded']),
  status: PropTypes.oneOf(['online', 'away', 'busy', 'offline']),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Avatar;