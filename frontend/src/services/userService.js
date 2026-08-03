import { fetchAPI } from './api';

export const getMe = async () => {
  return fetchAPI('/auth/me');
};

export const updateProfileApi = async (profileData) => {
  return fetchAPI('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};

export const updatePasswordApi = async (passwordData) => {
  return fetchAPI('/auth/password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  });
};
