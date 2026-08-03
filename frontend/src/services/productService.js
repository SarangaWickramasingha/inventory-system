import { fetchAPI } from './api';

/**
 * Product API Service
 * Handles product listing, searching, filtering, and detail lookups.
 * Owner: Ashan (Product Core & Information Display)
 */

/**
 * Fetch paginated list of products with optional search, category, and status filters.
 * @param {Object} filters - Query parameters
 * @param {string} [filters.search] - Search term for SKU, name, or description
 * @param {number|string} [filters.category_id] - Category filter ID
 * @param {string} [filters.status] - Stock status filter ('in_stock', 'low_stock', 'out_of_stock')
 * @param {number} [filters.page=1] - Current page number
 * @param {number} [filters.per_page=10] - Items per page
 */
export const getProducts = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  if (filters.search) queryParams.append('search', filters.search);
  if (filters.category_id) queryParams.append('category_id', filters.category_id);
  if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
  if (filters.page) queryParams.append('page', filters.page);
  if (filters.per_page) queryParams.append('per_page', filters.per_page);

  const queryString = queryParams.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

  return fetchAPI(endpoint, {
    method: 'GET',
  });
};

/**
 * Fetch single product details by ID.
 * @param {number|string} id - Product ID
 */
export const getProductById = async (id) => {
  return fetchAPI(`/products/${id}`, {
    method: 'GET',
  });
};
