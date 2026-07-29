export const INITIAL_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Electronics',
    description: 'Consumer tech, gadgets, and accessories.',
    productCount: 1248,
    icon: 'Laptop',
    color: '#3B82F6',
    bgColor: '#EFF6FF'
  },
  {
    id: 'cat-2',
    name: 'Furniture',
    description: 'Office and home furnishings.',
    productCount: 432,
    icon: 'Armchair',
    color: '#10B981',
    bgColor: '#ECFDF5'
  },
  {
    id: 'cat-3',
    name: 'Apparel',
    description: 'Clothing, shoes, and wearable items.',
    productCount: 3890,
    icon: 'Shirt',
    color: '#D97706',
    bgColor: '#FEF3C7'
  },
  {
    id: 'cat-4',
    name: 'Home & Garden',
    description: 'Home decor, outdoor equipment, and kitchenware.',
    productCount: 520,
    icon: 'Home',
    color: '#8B5CF6',
    bgColor: '#F3E8FF'
  },
  {
    id: 'cat-5',
    name: 'Office Supplies',
    description: 'Paper, stationery, desk organizers, and craft supplies.',
    productCount: 810,
    icon: 'Folder',
    color: '#EC4899',
    bgColor: '#FCE7F3'
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Quantum Noise-Cancelling Headphones',
    sku: 'SKU-QNC-001',
    category: 'Electronics',
    brand: 'AudioTech',
    supplier: 'SoundWave Global',
    quantity: 145,
    reorderPoint: 50,
    buyingPrice: 85.00,
    sellingPrice: 199.99,
    barcode: '84392011234',
    status: 'In Stock',
    isActive: true,
    trackInventory: true,
    description: 'High-precision optical sensor with adjustable DPI. Ergonomic design reduces wrist strain during prolonged use. Includes USB-C receiver and Bluetooth connectivity.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80'
    ]
  },
  {
    id: 'prod-2',
    name: 'HydroSmart Stainless Bottle',
    sku: 'SKU-HSB-042',
    category: 'Home & Garden',
    brand: 'HydroLife',
    supplier: 'Apex Eco Supplies',
    quantity: 12,
    reorderPoint: 30,
    buyingPrice: 15.50,
    sellingPrice: 34.99,
    barcode: '71930288102',
    status: 'Low Stock',
    isActive: true,
    trackInventory: true,
    description: 'Vacuum insulated stainless steel water bottle keeps drinks cold for 24 hours or hot for 12 hours.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
    additionalImages: []
  },
  {
    id: 'prod-3',
    name: 'ErgoMesh Office Chair',
    sku: 'FUR-CH-001',
    category: 'Furniture',
    brand: 'ErgoDesign',
    supplier: 'Modern Office Furniture Co',
    quantity: 0,
    reorderPoint: 15,
    buyingPrice: 110.00,
    sellingPrice: 249.00,
    barcode: '91823049102',
    status: 'Out of Stock',
    isActive: true,
    trackInventory: true,
    description: 'Breathable mesh back ergonomic chair with lumbar support, adjustable headrest, and 3D armrests.',
    image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=400&q=80',
    additionalImages: []
  },
  {
    id: 'prod-4',
    name: 'Essential Cotton T-Shirt',
    sku: 'SKU-ECT-NAV-M',
    category: 'Apparel',
    brand: 'UrbanWear',
    supplier: 'Textile Central Inc',
    quantity: 890,
    reorderPoint: 100,
    buyingPrice: 4.20,
    sellingPrice: 18.00,
    barcode: '40192837465',
    status: 'In Stock',
    isActive: true,
    trackInventory: true,
    description: '100% organic combed cotton t-shirt with premium stitching and relaxed fit.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80',
    additionalImages: []
  },
  {
    id: 'prod-5',
    name: 'Ergonomic Wireless Mouse Pro',
    sku: 'SKU-WM902',
    category: 'Electronics',
    brand: 'LogiTech',
    supplier: 'Global Components Ltd',
    quantity: 142,
    reorderPoint: 40,
    buyingPrice: 24.50,
    sellingPrice: 59.99,
    barcode: '84392011234',
    status: 'In Stock',
    isActive: true,
    trackInventory: true,
    description: 'High-precision optical sensor with adjustable DPI. Ergonomic design reduces wrist strain during prolonged use. Includes USB-C receiver and Bluetooth connectivity.',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80',
      'https://images.unsplash.com/photo-1613141411244-0e4ac259d217?w=400&q=80'
    ]
  },
  {
    id: 'prod-6',
    name: 'USB-C Hub (7-in-1)',
    sku: 'EL-201-X',
    category: 'Electronics',
    brand: 'TechGear',
    supplier: 'Silicon Supply Co',
    quantity: 5,
    reorderPoint: 40,
    buyingPrice: 18.00,
    sellingPrice: 42.50,
    barcode: '60192837411',
    status: 'Low Stock',
    isActive: true,
    trackInventory: true,
    description: 'Multi-port USB-C adapter with 4K HDMI, 100W Power Delivery, SD/TF card reader, and 3x USB 3.0 ports.',
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=400&q=80',
    additionalImages: []
  },
  {
    id: 'prod-7',
    name: 'Ceramic Coffee Mug Set',
    sku: 'HG-405-C',
    category: 'Home & Garden',
    brand: 'CraftHome',
    supplier: 'Artisan Goods Direct',
    quantity: 28,
    reorderPoint: 30,
    buyingPrice: 12.00,
    sellingPrice: 28.00,
    barcode: '50192837422',
    status: 'Low Stock',
    isActive: true,
    trackInventory: true,
    description: 'Handcrafted ceramic mug set of 4 with heat resistant matte finish.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80',
    additionalImages: []
  }
];

export const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    productName: 'Ergonomic Office Chair V2',
    action: 'Added',
    user: 'John Doe',
    userInitials: 'JD',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    time: '10 mins ago',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString()
  },
  {
    id: 'act-2',
    productName: 'Wireless Noise-Canceling Headphones',
    action: 'Updated',
    user: 'Alice Smith',
    userInitials: 'AS',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    time: '1 hour ago',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString()
  },
  {
    id: 'act-3',
    productName: 'Mechanical Keyboard (Brown Switches)',
    action: 'Removed',
    user: 'John Doe',
    userInitials: 'JD',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    time: '3 hours ago',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString()
  },
  {
    id: 'act-4',
    productName: 'USB-C Hub (7-in-1)',
    action: 'Added',
    user: 'Mike Johnson',
    userInitials: 'MJ',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80',
    time: 'Yesterday',
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString()
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Low Stock Alert',
    message: 'USB-C Hub (7-in-1) is running low (5 remaining).',
    time: '15m ago',
    type: 'warning',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Out of Stock Alert',
    message: 'ErgoMesh Office Chair is out of stock!',
    time: '1h ago',
    type: 'error',
    read: false
  },
  {
    id: 'notif-3',
    title: 'System Update',
    message: 'StockFlow Enterprise ERP updated to v2.4.0.',
    time: '5h ago',
    type: 'info',
    read: true
  }
];

export const USER_PROFILE = {
  name: 'Alex Mercer',
  role: 'Senior Inventory Manager',
  email: 'alex.mercer@stockflow.com',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80'
};
