import React, { createContext, useState, useEffect, useContext } from 'react';
import { getLocalStorageItem, setLocalStorageItem, STORAGE_KEYS } from '../utils/storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#1890ff');
  const [fontSize, setFontSize] = useState('normal');
  const [compactMode, setCompactMode] = useState(false);

  // Load theme preferences from localStorage on initial render
  useEffect(() => {
    const savedTheme = getLocalStorageItem(STORAGE_KEYS.THEME);
    if (savedTheme) {
      setDarkMode(savedTheme.darkMode);
      setPrimaryColor(savedTheme.primaryColor);
      setFontSize(savedTheme.fontSize);
      setCompactMode(savedTheme.compactMode);
    }
  }, []);

  // Save theme preferences to localStorage whenever they change
  useEffect(() => {
    const themeData = {
      darkMode,
      primaryColor,
      fontSize,
      compactMode
    };
    setLocalStorageItem(STORAGE_KEYS.THEME, themeData);
  }, [darkMode, primaryColor, fontSize, compactMode]);

  const getFontSizeValue = (size) => {
    switch (size) {
      case 'small':
        return '14px';
      case 'normal':
        return '16px';
      case 'large':
        return '18px';
      default:
        return '16px';
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const changePrimaryColor = (color) => {
    setPrimaryColor(color);
  };

  const changeFontSize = (size) => {
    setFontSize(size);
  };

  const toggleCompactMode = () => {
    setCompactMode(!compactMode);
  };

  const saveThemePreference = (themeData) => {
    setLocalStorageItem(STORAGE_KEYS.THEME, themeData);
  };

  const resetToDefaults = () => {
    setDarkMode(false);
    setPrimaryColor('#1890ff');
    setFontSize('normal');
    setCompactMode(false);
  };

  const value = {
    darkMode,
    primaryColor,
    fontSize,
    compactMode,
    toggleDarkMode,
    changePrimaryColor,
    changeFontSize,
    toggleCompactMode,
    saveThemePreference,
    resetToDefaults,
    getFontSizeValue
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;