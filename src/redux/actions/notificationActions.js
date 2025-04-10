// src/redux/actions/notificationActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../../services/notificationService';
import errorHandler from '../../utils/errorHandler';

// Fetch all notifications for current user
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.getNotifications();
      return response.data;
    } catch (error) {
      return rejectWithValue(errorHandler.processApiError(error));
    }
  }
);

// Mark a notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      return { id: notificationId, ...response.data };
    } catch (error) {
      return rejectWithValue(errorHandler.processApiError(error));
    }
  }
);

// Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.markAllAsRead();
      return response.data;
    } catch (error) {
      return rejectWithValue(errorHandler.processApiError(error));
    }
  }
);

// Delete a notification
export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationService.deleteNotification(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue(errorHandler.processApiError(error));
    }
  }
);

// Create a new notification (admin only)
export const createNotification = createAsyncThunk(
  'notifications/create',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await notificationService.createNotification(notificationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(errorHandler.processApiError(error));
    }
  }
);