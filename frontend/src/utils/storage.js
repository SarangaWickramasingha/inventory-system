import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_ACTIVITIES, INITIAL_NOTIFICATIONS, USER_PROFILE } from './mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'stockflow_products_v2',
  CATEGORIES: 'stockflow_categories_v2',
  ACTIVITIES: 'stockflow_activities_v2',
  NOTIFICATIONS: 'stockflow_notifications_v2',
  PROFILE: 'stockflow_profile_v2'
};

export const getStoredProducts = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : INITIAL_PRODUCTS;
  } catch (e) {
    console.error('Failed to parse stored products', e);
    return INITIAL_PRODUCTS;
  }
};

export const saveStoredProducts = (products) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products to localStorage', e);
  }
};

export const getStoredCategories = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : INITIAL_CATEGORIES;
  } catch (e) {
    console.error('Failed to parse stored categories', e);
    return INITIAL_CATEGORIES;
  }
};

export const saveStoredCategories = (categories) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories to localStorage', e);
  }
};

export const getStoredActivities = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return data ? JSON.parse(data) : INITIAL_ACTIVITIES;
  } catch (e) {
    console.error('Failed to parse stored activities', e);
    return INITIAL_ACTIVITIES;
  }
};

export const saveStoredActivities = (activities) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch (e) {
    console.error('Failed to save activities to localStorage', e);
  }
};

export const getStoredNotifications = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
  } catch (e) {
    return INITIAL_NOTIFICATIONS;
  }
};

export const saveStoredNotifications = (notifications) => {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
};

export const getStoredProfile = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : USER_PROFILE;
  } catch (e) {
    return USER_PROFILE;
  }
};

export const saveStoredProfile = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
};
