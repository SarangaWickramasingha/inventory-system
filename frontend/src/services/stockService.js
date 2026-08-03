import { fetchAPI } from './api';

export const getStockLogs = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.type && params.type !== 'ALL') queryParams.append('type', params.type);
  if (params.search) queryParams.append('search', params.search);
  const queryString = queryParams.toString();
  return fetchAPI(`/stock-logs${queryString ? `?${queryString}` : ''}`);
};

export const createStockLog = async (logData) => {
  return fetchAPI('/stock-logs', {
    method: 'POST',
    body: JSON.stringify(logData),
  });
};
