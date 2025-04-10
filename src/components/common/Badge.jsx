import React from 'react';
import PropTypes from 'prop-types';
// import './Badge.css';

const Badge = ({
  children,
  content,
  count,
  status,
  color,
  dot = false,
  maxCount = 99,
  showZero = false,
  offset = [0, 0],
  className = '',
  style = {},
  ...rest
}) => {
  // Determine if badge should be displayed
  const showBadge = () => {
    if (dot) return true;
    if (count === 0) return showZero;
    return !!content || count > 0 || !!status;
  };

  // Format the count with maxCount limit
  const formatCount = () => {
    if (count > maxCount) {
      return `${maxCount}+`;
    }
    return count;
  };

  // Calculate badge content
  const badgeContent = () => {
    if (dot) return null;
    if (content !== undefined) return content;
    if (count !== undefined) return formatCount();
    return null;
  };

  // Status preset colors
  const getStatusColor = () => {
    if (color) return color;
    
    switch (status) {
      case 'success': return '#52c41a';
      case 'processing': return '#1890ff';
      case 'default': return '#d9d9d9';
      case 'error': return '#ff4d4f';
      case 'warning': return '#faad14';
      default: return null;
    }
  };

  const badgeStyles = {
    ...style,
    backgroundColor: getStatusColor(),
    right: `${offset[0]}px`,
    top: `${offset[1]}px`,
  };

  const badgeClasses = `
    badge
    ${dot ? 'badge--dot' : ''}
    ${status ? `badge--${status}` : ''}
    ${!children ? 'badge--standalone' : ''}
    ${className}
  `;

  // Standalone badge or wrapper with badge
  if (!children) {
    return (
      <span className={badgeClasses} style={badgeStyles} {...rest}>
        {badgeContent()}
      </span>
    );
  }

  return (
    <span className="badge-wrapper" {...rest}>
      {children}
      {showBadge() && (
        <span className={badgeClasses} style={badgeStyles}>
          {badgeContent()}
        </span>
      )}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  content: PropTypes.node,
  count: PropTypes.number,
  status: PropTypes.oneOf(['success', 'processing', 'default', 'error', 'warning']),
  color: PropTypes.string,
  dot: PropTypes.bool,
  maxCount: PropTypes.number,
  showZero: PropTypes.bool,
  offset: PropTypes.arrayOf(PropTypes.number),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Badge;