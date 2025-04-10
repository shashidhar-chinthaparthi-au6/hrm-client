import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
// import './Sidebar.css';

const Sidebar = ({
  isOpen = true,
  onToggle,
  menuItems = [],
  user,
  logo,
  appName = 'HR Management',
  className = '',
}) => {
  const [expandedMenus, setExpandedMenus] = useState({});
  const location = useLocation();

  // Determine which menus should be initially expanded based on current route
  useEffect(() => {
    const newExpandedMenus = {};
    
    menuItems.forEach(item => {
      if (item.subItems) {
        const isActive = item.subItems.some(
          subItem => subItem.to === location.pathname
        );
        if (isActive) {
          newExpandedMenus[item.id] = true;
        }
      }
    });
    
    setExpandedMenus(newExpandedMenus);
  }, [location.pathname, menuItems]);

  const toggleSubmenu = (itemId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderMenuItem = (item) => {
    // Item with submenu
    if (item.subItems && item.subItems.length > 0) {
      const isExpanded = expandedMenus[item.id];
      
      return (
        <li key={item.id} className="sidebar-item">
          <button 
            className={`sidebar-link has-submenu ${isExpanded ? 'expanded' : ''}`}
            onClick={() => toggleSubmenu(item.id)}
          >
            {item.icon && <span className="sidebar-icon">{item.icon}</span>}
            {isOpen && (
              <>
                <span className="sidebar-label">{item.label}</span>
                <span className="submenu-arrow">
                  <svg 
                    viewBox="0 0 24 24" 
                    width="16" 
                    height="16"
                    className={isExpanded ? 'rotate-180' : ''}
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </span>
              </>
            )}
          </button>
          
          {isExpanded && (
            <ul className="sidebar-submenu">
              {item.subItems.map(subItem => (
                <li key={subItem.id} className="submenu-item">
                  <NavLink 
                    to={subItem.to} 
                    className={({ isActive }) => 
                      `submenu-link ${isActive ? 'active' : ''}`
                    }
                  >
                    {subItem.icon && <span className="submenu-icon">{subItem.icon}</span>}
                    <span className="submenu-label">{subItem.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }
    
    // Regular menu item
    return (
      <li key={item.id} className="sidebar-item">
        <NavLink 
          to={item.to} 
          className={({ isActive }) => 
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          {item.icon && <span className="sidebar-icon">{item.icon}</span>}
          {isOpen && <span className="sidebar-label">{item.label}</span>}
        </NavLink>
      </li>
    );
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'} ${className}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo-container">
          {logo ? (
            <img src={logo} alt={`${appName} logo`} className="sidebar-logo" />
          ) : (
            <div className="sidebar-logo-placeholder">{appName.charAt(0)}</div>
          )}
          {isOpen && <span className="sidebar-title">{appName}</span>}
        </div>
        
        <button 
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d={isOpen ? 
              "M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" : 
              "M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"}
            />
          </svg>
        </button>
      </div>
      
      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map(item => renderMenuItem(item))}
          </ul>
        </nav>
      </div>
      
      {user && isOpen && (
        <div className="sidebar-footer">
          <div className="user-info">
            {user.avatar ? (
              <img src={user.avatar} alt="User avatar" className="user-avatar" />
            ) : (
              <div className="user-avatar-placeholder">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{user.role}</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
      icon: PropTypes.node,
      subItems: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          to: PropTypes.string.isRequired,
          icon: PropTypes.node,
        })
      ),
    })
  ),
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.string,
    avatar: PropTypes.string,
  }),
  logo: PropTypes.string,
  appName: PropTypes.string,
  className: PropTypes.string,
};

export default Sidebar;