import { useContext, useCallback } from 'react';
import NotificationContext from '../contexts/NotificationContext';

const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  const { 
    notifications, 
    unreadCount, 
    addNotification, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications, 
    refreshNotifications 
  } = context;

  // Helper to create a success notification
  const showSuccess = useCallback((message, options = {}) => {
    addNotification({
      type: 'success',
      message,
      title: options.title || 'Success',
      duration: options.duration || 3000,
      ...options
    });
  }, [addNotification]);

  // Helper to create an error notification
  const showError = useCallback((message, options = {}) => {
    addNotification({
      type: 'error',
      message,
      title: options.title || 'Error',
      duration: options.duration || 5000,
      ...options
    });
  }, [addNotification]);

  // Helper to create an info notification
  const showInfo = useCallback((message, options = {}) => {
    addNotification({
      type: 'info',
      message,
      title: options.title || 'Information',
      duration: options.duration || 4000,
      ...options
    });
  }, [addNotification]);

  // Helper to create a warning notification
  const showWarning = useCallback((message, options = {}) => {
    addNotification({
      type: 'warning',
      message,
      title: options.title || 'Warning',
      duration: options.duration || 4000,
      ...options
    });
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    refreshNotifications
  };
};

export default useNotifications;