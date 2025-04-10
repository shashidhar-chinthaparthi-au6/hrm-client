import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
// import './Breadcrumbs.css';

const Breadcrumbs = ({
  routes = [],
  separator = '/',
  homePath = '/',
  homeLabel = 'Home',
  showHome = true,
  customLabels = {},
  className = '',
}) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // If custom routes are provided, use them instead of generating from path
  if (routes.length > 0) {
    return (
      <nav className={`breadcrumb-container ${className}`} aria-label="breadcrumb">
        <ol className="breadcrumb-list">
          {routes.map((route, index) => {
            const isLast = index === routes.length - 1;
            
            return (
              <li 
                key={`breadcrumb-${index}`}
                className={`breadcrumb-item ${isLast ? 'active' : ''}`}
              >
                {isLast ? (
                  <span className="breadcrumb-text current">{route.label}</span>
                ) : (
                  <Link to={route.path} className="breadcrumb-link">
                    {route.label}
                  </Link>
                )}
                
                {!isLast && (
                  <span className="breadcrumb-separator">{separator}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
  
  // Otherwise, generate breadcrumbs from current path
  return (
    <nav className={`breadcrumb-container ${className}`} aria-label="breadcrumb">
      <ol className="breadcrumb-list">
        {showHome && (
          <li className="breadcrumb-item">
            <Link to={homePath} className="breadcrumb-link">
              {homeLabel}
            </Link>
            {pathnames.length > 0 && (
              <span className="breadcrumb-separator">{separator}</span>
            )}
          </li>
        )}
        
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          // Use custom label if available, otherwise format the path segment
          const pathSegment = customLabels[name] || 
            name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
          
          return (
            <li 
              key={`breadcrumb-${name}-${index}`}
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
            >
              {isLast ? (
                <span className="breadcrumb-text current">{pathSegment}</span>
              ) : (
                <Link to={routeTo} className="breadcrumb-link">
                  {pathSegment}
                </Link>
              )}
              
              {!isLast && (
                <span className="breadcrumb-separator">{separator}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumbs.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  separator: PropTypes.node,
  homePath: PropTypes.string,
  homeLabel: PropTypes.string,
  showHome: PropTypes.bool,
  customLabels: PropTypes.object,
  className: PropTypes.string,
};

export default Breadcrumbs;