// src/hooks/useToast.js
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addToast, removeToast } from '../redux/slices/toastSlice';

/**
 * Custom hook for displaying toast notifications
 * @returns {Object} Toast methods
 */
export const useToast = () => {
  const dispatch = useDispatch();
  
  /**
   * Default duration for toasts
   */
  const DEFAULT_DURATION = 5000;

  /**
   * Creates and displays a toast notification
   * @param {Object} options - Toast configuration options
   * @param {string} options.title - Toast title
   * @param {string} options.message - Toast message content
   * @param {string} options.type - Toast type ('success', 'error', 'warning', 'info')
   * @param {number} options.duration - Duration in ms before auto-dismiss (default: 5000)
   * @param {boolean} options.isClosable - Whether the toast can be closed manually (default: true)
   * @param {Function} options.onClose - Callback function when toast is closed
   * @returns {string} ID of the created toast
   */
  const showToast = useCallback(
    ({ 
      title = '', 
      message, 
      type = 'info', 
      duration = DEFAULT_DURATION, 
      isClosable = true,
      onClose = () => {} 
    }) => {
      const id = uuidv4();
      
      dispatch(
        addToast({
          id,
          title,
          message,
          type,
          isClosable,
          onClose
        })
      );

      if (duration !== 0) {
        setTimeout(() => {
          dispatch(removeToast(id));
          onClose();
        }, duration);
      }

      return id;
    },
    [dispatch]
  );

  /**
   * Manually dismiss a toast by ID
   * @param {string} id - Toast ID to dismiss
   */
  const closeToast = useCallback(
    (id) => {
      dispatch(removeToast(id));
    },
    [dispatch]
  );

  /**
   * Show a success toast
   * @param {Object} options - Toast options
   * @returns {string} Toast ID
   */
  const success = useCallback(
    (options) => showToast({ ...options, type: 'success' }),
    [showToast]
  );

  /**
   * Show an error toast
   * @param {Object} options - Toast options
   * @returns {string} Toast ID
   */
  const error = useCallback(
    (options) => showToast({ ...options, type: 'error' }),
    [showToast]
  );

  /**
   * Show a warning toast
   * @param {Object} options - Toast options
   * @returns {string} Toast ID
   */
  const warning = useCallback(
    (options) => showToast({ ...options, type: 'warning' }),
    [showToast]
  );

  /**
   * Show an info toast
   * @param {Object} options - Toast options
   * @returns {string} Toast ID
   */
  const info = useCallback(
    (options) => showToast({ ...options, type: 'info' }),
    [showToast]
  );

  return {
    showToast,
    closeToast,
    success,
    error,
    warning,
    info
  };
};