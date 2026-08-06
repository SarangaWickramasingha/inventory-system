import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStoredProducts,
  saveStoredProducts,
  getStoredCategories,
  saveStoredCategories,
  getStoredActivities,
  saveStoredActivities,
  getStoredNotifications,
  saveStoredNotifications,
  getStoredProfile,
  saveStoredProfile,
  getStoredThresholdSettings,
  saveStoredThresholdSettings
} from '../utils/storage';
import { getDiceBearAvatar } from '../utils/avatar';
import { 
  getProducts as fetchProductsFromAPI,
  createProduct as createProductApi,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi
} from '../services/productService';
import { getCategories as fetchCategoriesFromAPI } from '../services/categoryService';
import { getMe, updateProfileApi, updatePasswordApi } from '../services/userService';
import { getStockLogs, createStockLog } from '../services/stockService';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState(getStoredProducts);
  const [categories, setCategories] = useState(getStoredCategories);
  const [activities, setActivities] = useState(getStoredActivities);
  const [notifications, setNotifications] = useState(getStoredNotifications);
  const [profile, setProfile] = useState(getStoredProfile);
  const [thresholdSettings, setThresholdSettings] = useState(getStoredThresholdSettings);

  // URL path mapping dictionary
  const viewToPathMap = {
    'landing': '/',
    'login': '/login',
    'register': '/register',
    'features': '/features',
    'about': '/about',
    'contact': '/contact',
    'privacy': '/privacy',
    'terms': '/terms',
    'dashboard': '/dashboard',
    'inventory': '/inventory',
    'categories': '/categories',
    'users': '/users',
    'admin-users': '/admin/users',
    'staff-activity': '/staff-activity',
    'activity': '/staff-activity',
    'reports': '/reports',
    'settings': '/settings',
    'add-product': '/products/add',
    'edit-product': '/products/edit',
  };

  const pathToViewMap = {
    '/': 'landing',
    '/login': 'login',
    '/register': 'register',
    '/features': 'features',
    '/about': 'about',
    '/contact': 'contact',
    '/privacy': 'privacy',
    '/terms': 'terms',
    '/dashboard': 'dashboard',
    '/inventory': 'inventory',
    '/categories': 'categories',
    '/users': 'users',
    '/admin/users': 'users',
    '/staff-activity': 'staff-activity',
    '/activity': 'staff-activity',
    '/reports': 'reports',
    '/settings': 'settings',
    '/products/add': 'add-product',
    '/products/edit': 'edit-product',
  };

  const getInitialViewFromUrl = () => {
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    return pathToViewMap[path] || 'landing';
  };

  const [currentView, setCurrentViewState] = useState(getInitialViewFromUrl);
  const [previousView, setPreviousView] = useState('landing');

  // Sync state with browser URL path and history
  const setCurrentView = (view) => {
    setCurrentViewState(prev => {
      if (view === 'login' || view === 'register') {
        if (prev !== 'login' && prev !== 'register') {
          setPreviousView(prev);
        }
      }
      return view;
    });

    const targetPath = viewToPathMap[view] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ view }, '', targetPath);
    }
  };

  const closeAuthModal = () => {
    const target = previousView && previousView !== 'login' && previousView !== 'register' ? previousView : 'landing';
    setCurrentView(target);
  };

  const [authMode, setAuthMode] = useState('login');
  const [editingProductId, setEditingProductId] = useState(null);

  const navigateToAuth = (mode = 'login') => {
    setAuthMode(mode);
    setCurrentView('login');
  };
  const [viewingProductId, setViewingProductId] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All Categories');
  
  // Global Header Search Term
  const [searchTerm, setSearchTerm] = useState('');

  // API Loading & Pagination State
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [paginationMeta, setPaginationMeta] = useState({
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1
  });

  const normalizeProduct = (item) => {
    if (!item) return null;
    const priceVal = Number(item.sellingPrice ?? item.price ?? 0);
    const costVal = Number(item.buyingPrice ?? item.cost_price ?? 0);
    const qtyVal = Math.max(0, Number(item.quantity ?? 0));
    const alertVal = Number(item.reorderPoint ?? item.min_stock_alert ?? 5);
    const categoryVal = item.category || item.category_name || 'Uncategorized';

    return {
      ...item,
      id: item.id,
      sku: item.sku || '',
      name: item.name || '',
      category: categoryVal,
      category_name: categoryVal,
      price: priceVal,
      sellingPrice: priceVal,
      cost_price: costVal,
      buyingPrice: costVal,
      quantity: qtyVal,
      reorderPoint: alertVal,
      min_stock_alert: alertVal,
      unit: item.unit || 'pcs',
      description: item.description || '',
      status: item.status === 'in_stock' ? 'In Stock' : item.status === 'low_stock' ? 'Low Stock' : item.status === 'out_of_stock' ? 'Out of Stock' : (item.status || 'In Stock'),
      image: item.image_url || item.image || 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&q=80',
      image_url: item.image_url || item.image || 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&q=80',
      additionalImages: item.additionalImages || []
    };
  };

  // Fetch products from backend API with fallback
  const loadProducts = async (filters = {}) => {
    setLoadingProducts(true);
    try {
      const response = await fetchProductsFromAPI(filters);
      if (response && response.success && Array.isArray(response.data?.items)) {
        setProducts(response.data.items.map(normalizeProduct));
        if (response.data.pagination) {
          setPaginationMeta({
            currentPage: response.data.pagination.current_page || 1,
            perPage: response.data.pagination.per_page || 10,
            totalItems: response.data.pagination.total_items || 0,
            totalPages: response.data.pagination.total_pages || 1
          });
        }
      }
    } catch (err) {
      console.warn('Backend API unavailable, using local product state:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Toast Notification state
  const [toast, setToast] = useState(null);

  // Fetch categories dynamically from backend MySQL database
  const loadCategories = async () => {
    try {
      const response = await fetchCategoriesFromAPI();
      if (response && response.success && Array.isArray(response.data?.items)) {
        setCategories(response.data.items);
      }
    } catch (err) {
      console.warn('Backend categories API unavailable:', err);
    }
  };

  // Fetch authenticated user profile dynamically from backend MySQL database
  const loadProfile = async () => {
    try {
      const res = await getMe();
      if (res && res.success && res.data?.user) {
        const u = res.data.user;
        const normalizedProfile = {
          id: u.id,
          name: u.full_name || u.name || u.username,
          username: u.username,
          email: u.email,
          role: (u.role || 'admin').toUpperCase(),
          status: u.status,
          avatar: getDiceBearAvatar(u.full_name || u.name || u.username)
        };
        setProfile(normalizedProfile);
        saveStoredProfile(normalizedProfile);
      }
    } catch (err) {
      console.warn('Backend user profile API unavailable:', err);
    }
  };

  // Fetch stock movement audit logs dynamically from backend MySQL database
  const loadStockLogs = async () => {
    try {
      const res = await getStockLogs();
      if (res && res.success && Array.isArray(res.data?.logs)) {
        setStockLogs(res.data.logs);
      }
    } catch (err) {
      console.warn('Backend stock logs API unavailable:', err);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
      const targetView = pathToViewMap[path] || 'landing';
      setCurrentViewState(targetView);
    };

    window.addEventListener('popstate', handlePopState);
    loadProducts();
    loadCategories();
    loadProfile();
    loadStockLogs();
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  useEffect(() => {
    saveStoredCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveStoredActivities(activities);
  }, [activities]);

  useEffect(() => {
    saveStoredNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    saveStoredProfile(profile);
  }, [profile]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const addActivityLog = (productName, action) => {
    const newLog = {
      id: `act-${Date.now()}`,
      productName,
      action,
      user: profile.name || 'Saranga Wickramasingha',
      userInitials: (profile.name || 'Saranga Wickramasingha').split(' ').map(n => n[0]).join(''),
      userAvatar: getDiceBearAvatar(profile.name || 'Saranga Wickramasingha'),
      time: 'Just now',
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newLog, ...prev.slice(0, 19)]);
  };

  const addProduct = async (productData) => {
    const matchedCategory = (categories || []).find(c => (c.name || '').toLowerCase() === (productData.category || '').toLowerCase());
    const category_id = matchedCategory ? matchedCategory.id : null;

    const payload = {
      sku: productData.sku,
      name: productData.name,
      category_id: category_id,
      price: Number(productData.sellingPrice ?? productData.price ?? 0),
      cost_price: Number(productData.buyingPrice ?? productData.cost_price ?? 0),
      quantity: Number(productData.quantity || 0),
      min_stock_alert: Number(productData.reorderPoint ?? productData.min_stock_alert ?? 5),
      unit: productData.unit || 'pcs',
      description: productData.description || '',
      image_url: productData.image || productData.image_url || ''
    };

    try {
      const res = await createProductApi(payload);
      if (res && res.success) {
        addActivityLog(productData.name, 'Added');
        showToast(`Product "${productData.name}" added successfully!`);
        await loadProducts();
        await loadCategories();
        setCurrentView('inventory');
        return res;
      } else {
        showToast(res?.message || 'Failed to create product in database', 'error');
      }
    } catch (err) {
      console.warn('API error, adding locally:', err);
      const newProd = normalizeProduct({ id: Date.now(), ...payload, category: productData.category });
      setProducts(prev => [newProd, ...prev]);
      addActivityLog(productData.name, 'Added');
      showToast(`Product "${productData.name}" added!`);
      setCurrentView('inventory');
    }
  };

  const updateProduct = async (id, updatedData) => {
    const matchedCategory = (categories || []).find(c => (c.name || '').toLowerCase() === (updatedData.category || '').toLowerCase());
    const category_id = matchedCategory ? matchedCategory.id : null;

    const payload = {
      ...updatedData,
      category_id: category_id || updatedData.category_id,
      price: updatedData.sellingPrice !== undefined ? Number(updatedData.sellingPrice) : updatedData.price,
      cost_price: updatedData.buyingPrice !== undefined ? Number(updatedData.buyingPrice) : updatedData.cost_price,
      min_stock_alert: updatedData.reorderPoint !== undefined ? Number(updatedData.reorderPoint) : updatedData.min_stock_alert,
      image_url: updatedData.image || updatedData.image_url
    };

    try {
      const res = await updateProductApi(id, payload);
      if (res && res.success) {
        addActivityLog(updatedData.name || 'Product', 'Updated');
        showToast('Product updated successfully!');
        await loadProducts();
        await loadCategories();
        setCurrentView('inventory');
        return res;
      } else {
        showToast(res?.message || 'Failed to update product in database', 'error');
      }
    } catch (err) {
      console.warn('API error, updating locally:', err);
      setProducts(prev => prev.map(p => p.id === id ? normalizeProduct({ ...p, ...payload }) : p));
      showToast('Product updated!');
      setCurrentView('inventory');
    }
  };

  const deleteProduct = async (id) => {
    const target = products.find(p => p.id === id);
    try {
      const res = await deleteProductApi(id);
      if (res && res.success) {
        addActivityLog(target?.name || 'Item', 'Removed');
        showToast(`Product "${target?.name || 'Item'}" removed`, 'warning');
        await loadProducts();
        await loadCategories();
      } else {
        showToast(res?.message || 'Failed to delete product', 'error');
      }
    } catch (err) {
      console.warn('API error, deleting locally:', err);
      setProducts(prev => prev.filter(p => p.id !== id));
      addActivityLog(target?.name || 'Item', 'Removed');
      showToast(`Product "${target?.name || 'Item'}" removed`, 'warning');
    }
  };

  const addCategory = (categoryData) => {
    const newCat = {
      id: `cat-${Date.now()}`,
      name: categoryData.name,
      description: categoryData.description || 'Custom category hierarchy.',
      productCount: 0,
      icon: categoryData.icon || 'Folder',
      color: categoryData.color || '#2563EB',
      bgColor: '#EFF6FF'
    };
    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${newCat.name}" created!`);
  };

  const deleteCategory = (categoryId) => {
    const target = categories.find(c => c.id === categoryId || c.name === categoryId);
    setCategories(prev => prev.filter(c => c.id !== categoryId && c.name !== categoryId));
    showToast(`Category "${target?.name || 'Category'}" deleted!`, 'warning');
  };

  const bulkImportProducts = (importedList) => {
    if (!Array.isArray(importedList) || importedList.length === 0) return;
    setProducts(prev => [...importedList, ...prev]);
    addActivityLog(`${importedList.length} items`, 'Added');
    showToast(`Successfully imported ${importedList.length} products!`);
  };

  const navigateToEdit = (productId) => {
    setEditingProductId(productId);
    setCurrentView('edit-product');
  };

  const updateProfile = async (newProfile) => {
    try {
      const res = await updateProfileApi(newProfile);
      if (res && res.success) {
        await loadProfile();
        showToast('Profile settings updated successfully!');
        return res;
      } else {
        showToast(res?.message || 'Failed to update profile in database', 'error');
      }
    } catch (err) {
      console.warn('API profile error, saving locally:', err);
      setProfile(prev => ({ ...prev, ...newProfile }));
      showToast('Profile settings updated!');
    }
  };

  const [stockLogs, setStockLogs] = useState([]);

  const adjustStock = async (productId, type, qty, notes = '') => {
    const targetProduct = products.find(p => p.id === productId);
    if (!targetProduct) {
      showToast('Product not found for adjustment', 'error');
      return { success: false, message: 'Product not found' };
    }

    const prevQty = Number(targetProduct.quantity || 0);
    const amount = Math.max(0, Number(qty) || 0);
    let newQty = prevQty;

    if (type === 'IN') {
      newQty = prevQty + amount;
    } else if (type === 'OUT') {
      newQty = prevQty - amount;
      if (newQty < 0) {
        showToast(`Cannot deduct ${amount} items. Current stock is only ${prevQty}.`, 'error');
        return { success: false, message: `Insufficient stock level (${prevQty} pcs).` };
      }
    } else if (type === 'ADJUSTMENT') {
      newQty = amount;
    }

    newQty = Math.max(0, newQty);

    try {
      try {
        await createStockLog({
          product_id: productId,
          type: type,
          quantity: amount,
          notes: notes || `Stock ${type} adjustment for ${targetProduct.name}`
        });
      } catch (logErr) {
        console.warn('Could not post stock log entry:', logErr);
      }

      const res = await updateProductApi(productId, {
        quantity: newQty
      });

      if (res && res.success) {
        await loadProducts();
        await loadStockLogs();

        const msg = type === 'IN'
          ? `Stock IN logged for "${targetProduct.name}" (+${amount} pcs). New total: ${newQty}`
          : type === 'OUT'
          ? `Stock OUT logged for "${targetProduct.name}" (-${amount} pcs). New total: ${newQty}`
          : `Stock level for "${targetProduct.name}" adjusted to ${newQty} pcs.`;

        showToast(msg, type === 'OUT' && newQty === 0 ? 'warning' : 'success');
        addActivityLog(targetProduct.name, type === 'IN' ? 'Restocked' : type === 'OUT' ? 'Dispatched' : 'Adjusted');

        return { success: true, newQty };
      } else {
        showToast(res?.message || 'Failed to update stock quantity', 'error');
        return { success: false, message: res?.message || 'Failed to update stock in database' };
      }
    } catch (err) {
      console.warn('API adjustment error, updating locally:', err);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, quantity: newQty } : p));
      showToast(`Stock updated to ${newQty} pcs`);
      return { success: true, newQty };
    }
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const updateThresholdSettings = (newSettings) => {
    const updated = { ...thresholdSettings, ...newSettings };
    setThresholdSettings(updated);
    saveStoredThresholdSettings(updated);
    showToast('Low-stock threshold settings updated successfully!');
  };

  return (
    <InventoryContext.Provider value={{
      products,
      loadingProducts,
      paginationMeta,
      loadProducts,
      categories,
      activities,
      stockLogs,
      notifications,
      profile,
      thresholdSettings,
      updateThresholdSettings,
      currentView,
      setCurrentView,
      previousView,
      closeAuthModal,
      authMode,
      setAuthMode,
      navigateToAuth,
      editingProductId,
      setEditingProductId,
      viewingProductId,
      setViewingProductId,
      selectedCategoryFilter,
      setSelectedCategoryFilter,
      searchTerm,
      setSearchTerm,
      toast,
      showToast,
      addProduct,
      updateProduct,
      deleteProduct,
      adjustStock,
      addCategory,
      deleteCategory,
      bulkImportProducts,
      navigateToEdit,
      updateProfile,
      markNotificationRead
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
