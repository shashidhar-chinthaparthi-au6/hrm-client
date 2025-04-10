import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import errorHandler from '../utils/errorHandler';

const useFetch = (initialUrl = null, initialOptions = {}) => {
  const [url, setUrl] = useState(initialUrl);
  const [options, setOptions] = useState(initialOptions);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refetchIndex, setRefetchIndex] = useState(0);
  const navigate = useNavigate();

  const fetchData = useCallback(async (urlToFetch = url, fetchOptions = options) => {
    if (!urlToFetch) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(urlToFetch, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized (redirect to login)
          navigate('/login');
          throw new Error('Your session has expired. Please log in again.');
        }
        
        const errorData = await response.json().catch(() => {
          // If response is not JSON, use status text
          return { message: response.statusText };
        });
        
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
      return responseData;
    } catch (err) {
      const handledError = errorHandler(err);
      setError(handledError);
      throw handledError;
    } finally {
      setIsLoading(false);
    }
  }, [url, options, navigate]);

  // Auto fetch when url/options change or refetchIndex is incremented
  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url, refetchIndex, fetchData]);

  const refetch = useCallback(() => {
    setRefetchIndex(prev => prev + 1);
  }, []);

  const updateUrl = useCallback((newUrl) => {
    setUrl(newUrl);
  }, []);

  const updateOptions = useCallback((newOptions) => {
    setOptions(prevOptions => ({
      ...prevOptions,
      ...newOptions
    }));
  }, []);

  // For manual fetching with different URL/options without changing the stored state
  const fetchWithConfig = useCallback((configUrl, configOptions = {}) => {
    return fetchData(configUrl, {
      ...options,
      ...configOptions
    });
  }, [fetchData, options]);

  return {
    data,
    isLoading,
    error,
    refetch,
    updateUrl,
    updateOptions,
    fetchWithConfig,
    setData, // Exposing this to allow manual updates
  };
};

export default useFetch;