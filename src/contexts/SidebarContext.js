import React, { createContext, useState, useContext, useEffect } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');
  const [activeSubmenu, setActiveSubmenu] = useState('');
  const [pinnedItems, setPinnedItems] = useState([]);

  // Load pinned items from localStorage on initial render
  useEffect(() => {
    const savedPins = localStorage.getItem('pinnedMenuItems');
    if (savedPins) {
      setPinnedItems(JSON.parse(savedPins));
    }
    
    // Check screen size for initial collapsed state
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1024);
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  const setCurrentPath = (path) => {
    // Extract menu and submenu from path
    const pathSegments = path.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      setActiveMenu(pathSegments[0]);
      if (pathSegments.length > 1) {
        setActiveSubmenu(pathSegments[1]);
      } else {
        setActiveSubmenu('');
      }
    } else {
      setActiveMenu('dashboard');
      setActiveSubmenu('');
    }
  };

  const togglePinnedItem = (itemKey) => {
    let updatedPins;
    if (pinnedItems.includes(itemKey)) {
      updatedPins = pinnedItems.filter(item => item !== itemKey);
    } else {
      updatedPins = [...pinnedItems, itemKey];
    }
    setPinnedItems(updatedPins);
    localStorage.setItem('pinnedMenuItems', JSON.stringify(updatedPins));
  };

  return (
    <SidebarContext.Provider value={{
      collapsed,
      mobileOpen,
      activeMenu,
      activeSubmenu,
      pinnedItems,
      toggleSidebar,
      toggleMobileSidebar,
      closeMobileSidebar,
      setCurrentPath,
      togglePinnedItem
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);

export default SidebarContext;