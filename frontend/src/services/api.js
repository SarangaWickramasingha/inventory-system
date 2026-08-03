/**
 * API Service Client
 * Base URL configuration and request helper functions for RESTful endpoints.
 * Owner: Saranga (Lead Infrastructure)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('stockflow_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response.json();
};
