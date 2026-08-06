import { fetchAPI } from './api';

export const getCategories = async () => {
  return await fetchAPI('/categories');
};

export const createCategory = async (categoryData) => {
  return await fetchAPI('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
};

export const deleteCategoryApi = async (id) => {
  return await fetchAPI(`/categories/${id}`, {
    method: 'DELETE',
  });
};
