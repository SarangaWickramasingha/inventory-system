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
  saveStoredProfile
} from '../utils/storage';
import { getProducts as fetchProductsFromAPI } from '../services/productService';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState(getStoredProducts);
  const [categories, setCategories] = useState(getStoredCategories);
  const [activities, setActivities] = useState(getStoredActivities);
  const [notifications, setNotifications] = useState(getStoredNotifications);
  const [profile, setProfile] = useState(getStoredProfile);

  // URL path mapping dictionary
  const viewToPathMap = {
    'landing': '/',
    'login': '/login',
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
  const [editingProductId, setEditingProductId] = useState(null);
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

  // Fetch products from backend API with fallback
  const loadProducts = async (filters = {}) => {
    setLoadingProducts(true);
    try {
      const response = await fetchProductsFromAPI(filters);
      if (response && response.success && Array.isArray(response.data?.items)) {
        setProducts(response.data.items);
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

  // Sync state with browser URL path and history
  const setCurrentView = (view) => {
    setCurrentViewState(view);
    const targetPath = viewToPathMap[view] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ view }, '', targetPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
      const targetView = pathToViewMap[path] || 'landing';
      setCurrentViewState(targetView);
    };

    window.addEventListener('popstate', handlePopState);
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
      user: profile.name || 'Alex Mercer',
      userInitials: (profile.name || 'Alex Mercer').split(' ').map(n => n[0]).join(''),
      userAvatar: profile.avatar,
      time: 'Just now',
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newLog, ...prev.slice(0, 19)]);
  };

  const addProduct = (productData) => {
    // Determine status automatically based on quantity
    let status = 'In Stock';
    const qty = Number(productData.quantity || 0);
    const reorder = Number(productData.reorderPoint || 30);
    if (qty === 0) status = 'Out of Stock';
    else if (qty <= reorder) status = 'Low Stock';

    const newProd = {
      id: `prod-${Date.now()}`,
      ...productData,
      quantity: qty,
      buyingPrice: Number(productData.buyingPrice || 0),
      sellingPrice: Number(productData.sellingPrice || 0),
      status,
      isActive: productData.isActive !== false,
      trackInventory: productData.trackInventory !== false,
      image: productData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      additionalImages: productData.additionalImages || []
    };

    setProducts(prev => [newProd, ...prev]);
    addActivityLog(newProd.name, 'Added');
    showToast(`Product "${newProd.name}" added successfully!`);

    // Update category count
    setCategories(prev => prev.map(cat => {
      if (cat.name.toLowerCase() === newProd.category.toLowerCase()) {
        return { ...cat, productCount: cat.productCount + 1 };
      }
      return cat;
    }));

    setCurrentView('inventory');
  };

  const updateProduct = (id, updatedData) => {
    setProducts(prev => prev.map(prod => {
      if (prod.id === id) {
        const qty = updatedData.quantity !== undefined ? Number(updatedData.quantity) : prod.quantity;
        const reorder = updatedData.reorderPoint !== undefined ? Number(updatedData.reorderPoint) : (prod.reorderPoint || 30);
        let status = 'In Stock';
        if (qty === 0) status = 'Out of Stock';
        else if (qty <= reorder) status = 'Low Stock';

        const updated = {
          ...prod,
          ...updatedData,
          quantity: qty,
          buyingPrice: updatedData.buyingPrice !== undefined ? Number(updatedData.buyingPrice) : prod.buyingPrice,
          sellingPrice: updatedData.sellingPrice !== undefined ? Number(updatedData.sellingPrice) : prod.sellingPrice,
          status
        };
        addActivityLog(updated.name, 'Updated');
        return updated;
      }
      return prod;
    }));
    showToast('Product details updated successfully!');
    setCurrentView('inventory');
  };

  const deleteProduct = (id) => {
    const target = products.find(p => p.id === id);
    if (target) {
      setProducts(prev => prev.filter(p => p.id !== id));
      addActivityLog(target.name, 'Removed');
      showToast(`Product "${target.name}" removed`, 'warning');
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

  const updateProfile = (newProfile) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
    showToast('Profile settings updated successfully!');
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

    const reorderPoint = Number(targetProduct.reorderPoint || 30);
    let status = 'In Stock';
    if (newQty === 0) status = 'Out of Stock';
    else if (newQty <= reorderPoint) status = 'Low Stock';

    // Update Product State
    setProducts(prev => prev.map(prod => {
      if (prod.id === productId) {
        return { ...prod, quantity: newQty, status };
      }
      return prod;
    }));

    // Generate Stock Log Record
    const qtyChangeStr = type === 'IN' ? `+${amount}` : type === 'OUT' ? `-${amount}` : `Set to ${amount}`;
    const newLog = {
      id: `log-${Date.now()}`,
      productId: targetProduct.id,
      productName: targetProduct.name,
      sku: targetProduct.sku,
      category: targetProduct.category,
      type, // 'IN', 'OUT', 'ADJUSTMENT'
      quantityChanged: qtyChangeStr,
      previousQuantity: prevQty,
      newQuantity: newQty,
      notes: notes || (type === 'IN' ? 'Stock received' : type === 'OUT' ? 'Stock dispatched' : 'Stock level adjusted'),
      user: profile.name || 'Alex Mercer',
      userRole: profile.role || 'Staff',
      userInitials: (profile.name || 'Alex Mercer').split(' ').map(n => n[0]).join(''),
      userAvatar: profile.avatar,
      time: 'Just now',
      timestamp: new Date().toISOString()
    };

    setStockLogs(prev => [newLog, ...prev]);

    // Also sync to general activity feed
    addActivityLog(targetProduct.name, type === 'IN' ? 'Restocked' : type === 'OUT' ? 'Dispatched' : 'Adjusted');

    const msg = type === 'IN'
      ? `Stock IN logged for "${targetProduct.name}" (+${amount} pcs). New total: ${newQty}`
      : type === 'OUT'
      ? `Stock OUT logged for "${targetProduct.name}" (-${amount} pcs). New total: ${newQty}`
      : `Stock level for "${targetProduct.name}" adjusted to ${newQty} pcs.`;

    showToast(msg, type === 'OUT' && newQty === 0 ? 'warning' : 'success');

    return { success: true, newQty };
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
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
      currentView,
      setCurrentView,
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
