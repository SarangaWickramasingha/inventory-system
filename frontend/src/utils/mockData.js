export const INITIAL_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Computers & Laptops',
    description: 'Enterprise laptops, desktop workstations, developer rigs, and mini PCs.',
    productCount: 1450,
    icon: 'Laptop',
    color: '#3B82F6',
    bgColor: '#EFF6FF'
  },
  {
    id: 'cat-2',
    name: 'Servers & Storage',
    description: 'Rackmount servers, NAS storage arrays, enterprise NVMe SSDs, and SAN hardware.',
    productCount: 380,
    icon: 'Server',
    color: '#8B5CF6',
    bgColor: '#F3E8FF'
  },
  {
    id: 'cat-3',
    name: 'Networking & Telecom',
    description: 'Managed Gigabit switches, enterprise routers, Wi-Fi 6 access points, and patch panels.',
    productCount: 890,
    icon: 'Network',
    color: '#10B981',
    bgColor: '#ECFDF5'
  },
  {
    id: 'cat-4',
    name: 'Monitors & Displays',
    description: '4K UltraHD workstations, dual monitor arms, and interactive conference room displays.',
    productCount: 620,
    icon: 'Monitor',
    color: '#EC4899',
    bgColor: '#FCE7F3'
  },
  {
    id: 'cat-5',
    name: 'Peripherals & Components',
    description: 'Mechanical keyboards, ergonomic mice, USB-C docks, webcams, and GPUs.',
    productCount: 2150,
    icon: 'Cpu',
    color: '#D97706',
    bgColor: '#FEF3C7'
  },
  {
    id: 'cat-6',
    name: 'Power & Infrastructure',
    description: 'Smart UPS battery backups, PDU power strips, server rack enclosures, and cooling units.',
    productCount: 430,
    icon: 'Zap',
    color: '#6366F1',
    bgColor: '#EEF2FF'
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'MacBook Pro 16" (M3 Max, 36GB, 1TB)',
    sku: 'SKU-MBP-16M3',
    category: 'Computers & Laptops',
    brand: 'Apple',
    supplier: 'TechData Global',
    quantity: 45,
    reorderPoint: 15,
    buyingPrice: 2850.00,
    sellingPrice: 3499.00,
    barcode: '84392011234',
    status: 'In Stock',
    isActive: true,
    trackInventory: true,
    description: '16-inch Liquid Retina XDR display, M3 Max 14-core CPU, 30-core GPU, 36GB Unified Memory, 1TB SSD storage.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    additionalImages: []
  },
  {
    id: 'prod-2',
    name: 'Dell PowerEdge R760 Rack Server',
    sku: 'SKU-DEL-R760',
    category: 'Servers & Storage',
    brand: 'Dell Technologies',
    supplier: 'Enterprise Hardware Solutions',
    quantity: 8,
    reorderPoint: 10,
    buyingPrice: 4200.00,
    sellingPrice: 5890.00,
    barcode: '71930288102',
    status: 'Low Stock',
    isActive: true,
    trackInventory: true,
    description: '2U dual-socket rack server powered by 4th Gen Intel Xeon Scalable processors, 128GB DDR5 RAM, 4x 1.92TB NVMe SSDs.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80',
    additionalImages: []
  },
  {
    id: 'prod-3',
    name: 'Cisco Catalyst 9300 48-Port Switch',
    sku: 'SKU-CSC-C9300',
    category: 'Networking & Telecom',
    brand: 'Cisco Systems',
    supplier: 'NetworkDirect Ltd',
    quantity: 0,
    reorderPoint: 5,
    buyingPrice: 2100.00,
    sellingPrice: 3200.00,
    barcode: '91823049102',
    status: 'Out of Stock',
    isActive: true,
    trackInventory: true,
    description: 'Enterprise-grade 48-port PoE+ stackable switch with 4x 10G uplink module slots and Network Advantage license.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=80',
    additionalImages: []
  },
  {
    id: 'prod-4',
    name: 'LG UltraFine 32" 4K Ergo Monitor',
    sku: 'SKU-LG-32UN880',
    category: 'Monitors & Displays',
    brand: 'LG Electronics',
    supplier: 'Display Source Corp',
    quantity: 120,
    reorderPoint: 25,
    buyingPrice: 480.00,
    sellingPrice: 699.00,
    barcode: '40192837465',
    status: 'In Stock',
    isActive: true,
    trackInventory: true,
    description: '32-inch UHD 4K IPS display with Ergo Arm stand, USB-C 60W Power Delivery, DCI-P3 95% color gamut.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',
    additionalImages: []
  },
  {
    id: 'prod-5',
    name: 'Ergonomic Wireless Mouse Pro',
    sku: 'SKU-WM902',
    category: 'Peripherals & Components',
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
    description: 'High-precision optical sensor with adjustable DPI. Ergonomic design reduces wrist strain during prolonged use.',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80',
    additionalImages: []
  },
  {
    id: 'prod-6',
    name: 'USB-C Thunderbolt 4 Hub (7-in-1)',
    sku: 'EL-201-X',
    category: 'Peripherals & Components',
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
    name: 'APC Smart-UPS 1500VA LCD Rackmount',
    sku: 'SKU-APC-SU1500',
    category: 'Power & Infrastructure',
    brand: 'Schneider Electric',
    supplier: 'Power Infra Wholesale',
    quantity: 14,
    reorderPoint: 10,
    buyingPrice: 380.00,
    sellingPrice: 599.00,
    barcode: '50192837422',
    status: 'In Stock',
    isActive: true,
    trackInventory: true,
    description: '1500VA / 1000W Line-Interactive 2U Rackmount Uninterruptible Power Supply with LCD display and SmartConnect port.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
    additionalImages: []
  }
];

export const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    productName: 'Dell PowerEdge R760 Rack Server',
    action: 'Added',
    user: 'John Doe',
    userInitials: 'JD',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    time: '10 mins ago',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString()
  },
  {
    id: 'act-2',
    productName: 'MacBook Pro 16" (M3 Max)',
    action: 'Updated',
    user: 'Alice Smith',
    userInitials: 'AS',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    time: '1 hour ago',
    timestamp: new Date(Date.now() - 60 * 60000).toISOString()
  },
  {
    id: 'act-3',
    productName: 'Cisco Catalyst 9300 48-Port Switch',
    action: 'Removed',
    user: 'John Doe',
    userInitials: 'JD',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    time: '3 hours ago',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString()
  },
  {
    id: 'act-4',
    productName: 'USB-C Thunderbolt 4 Hub (7-in-1)',
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
    message: 'USB-C Thunderbolt 4 Hub is running low (5 remaining).',
    time: '15m ago',
    type: 'warning',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Out of Stock Alert',
    message: 'Cisco Catalyst 9300 Switch is out of stock!',
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
  role: 'Senior IT Asset Manager',
  email: 'alex.mercer@stockflow.com',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80'
};
