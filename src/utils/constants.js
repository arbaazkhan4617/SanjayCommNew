export const COLORS = {
  primary: '#FF6B35',
  secondary: '#004E89',
  background: '#FFFFFF',
  text: '#333333',
  textLight: '#666666',
  border: '#E0E0E0',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
};

// Services (Main Categories)
export const SERVICES = [
  {
    id: '1',
    name: 'CCTV',
    icon: 'videocam',
    description: 'Surveillance systems for security',
  },
  {
    id: '2',
    name: 'Fire Alarms',
    icon: 'flame',
    description: 'Fire detection and alarm systems',
  },
  {
    id: '3',
    name: 'Biometrics',
    icon: 'finger-print',
    description: 'Biometric access control systems',
  },
  {
    id: '4',
    name: 'Video Door Phones',
    icon: 'call',
    description: 'Video door phone systems',
  },
  {
    id: '5',
    name: 'Electronic Locks',
    icon: 'lock-closed',
    description: 'Smart electronic locking systems',
  },
  {
    id: '6',
    name: 'Solar Power',
    icon: 'sunny',
    description: 'Solar power plant solutions',
  },
  {
    id: '7',
    name: 'Access Controls',
    icon: 'shield-checkmark',
    description: 'Access control systems',
  },
  {
    id: '8',
    name: 'Interactive Panels',
    icon: 'tablet-portrait',
    description: 'Interactive display panels',
  },
  {
    id: '9',
    name: 'Smart Classroom',
    icon: 'school',
    description: 'Smart classroom solutions',
  },
  {
    id: '10',
    name: 'Audio Video',
    icon: 'musical-notes',
    description: 'Audio video solutions',
  },
  {
    id: '11',
    name: 'EPABX & Intercom',
    icon: 'call',
    description: 'EPABX and intercom systems',
  },
  {
    id: '12',
    name: 'Networking',
    icon: 'wifi',
    description: 'Networking solutions',
  },
  {
    id: '13',
    name: 'Computers',
    icon: 'laptop',
    description: 'Computer systems and accessories',
  },
];

// Product Categories under Services
export const PRODUCT_CATEGORIES = {
  '1': [ // CCTV
    { id: '1-1', name: 'IP Cameras', serviceId: '1' },
    { id: '1-2', name: 'Analog Cameras', serviceId: '1' },
    { id: '1-3', name: 'DVR/NVR Systems', serviceId: '1' },
    { id: '1-4', name: 'CCTV Accessories', serviceId: '1' },
  ],
  '2': [ // Fire Alarms
    { id: '2-1', name: 'Smoke Detectors', serviceId: '2' },
    { id: '2-2', name: 'Heat Detectors', serviceId: '2' },
    { id: '2-3', name: 'Fire Alarm Panels', serviceId: '2' },
    { id: '2-4', name: 'Fire Alarm Accessories', serviceId: '2' },
  ],
  '3': [ // Biometrics
    { id: '3-1', name: 'Fingerprint Scanners', serviceId: '3' },
    { id: '3-2', name: 'Face Recognition', serviceId: '3' },
    { id: '3-3', name: 'Biometric Access Control', serviceId: '3' },
    { id: '3-4', name: 'Attendance Systems', serviceId: '3' },
  ],
  '4': [ // Video Door Phones
    { id: '4-1', name: 'Wired Video Door Phones', serviceId: '4' },
    { id: '4-2', name: 'Wireless Video Door Phones', serviceId: '4' },
    { id: '4-3', name: 'Smart Video Door Phones', serviceId: '4' },
  ],
  '5': [ // Electronic Locks
    { id: '5-1', name: 'Smart Locks', serviceId: '5' },
    { id: '5-2', name: 'Electronic Deadbolts', serviceId: '5' },
    { id: '5-3', name: 'Access Control Locks', serviceId: '5' },
  ],
  '6': [ // Solar Power
    { id: '6-1', name: 'Solar Panels', serviceId: '6' },
    { id: '6-2', name: 'Solar Inverters', serviceId: '6' },
    { id: '6-3', name: 'Solar Batteries', serviceId: '6' },
    { id: '6-4', name: 'Solar Power Plants', serviceId: '6' },
  ],
};

// Brands under Product Categories
export const BRANDS = {
  '1-1': [ // IP Cameras
    { id: '1-1-1', name: 'Hikvision', categoryId: '1-1' },
    { id: '1-1-2', name: 'Dahua', categoryId: '1-1' },
    { id: '1-1-3', name: 'CP Plus', categoryId: '1-1' },
    { id: '1-1-4', name: 'Samsung', categoryId: '1-1' },
  ],
  '1-2': [ // Analog Cameras
    { id: '1-2-1', name: 'Hikvision', categoryId: '1-2' },
    { id: '1-2-2', name: 'Dahua', categoryId: '1-2' },
    { id: '1-2-3', name: 'CP Plus', categoryId: '1-2' },
  ],
  '2-1': [ // Smoke Detectors
    { id: '2-1-1', name: 'Honeywell', categoryId: '2-1' },
    { id: '2-1-2', name: 'Bosch', categoryId: '2-1' },
    { id: '2-1-3', name: 'Notifier', categoryId: '2-1' },
  ],
  '3-1': [ // Fingerprint Scanners
    { id: '3-1-1', name: 'ZKTeco', categoryId: '3-1' },
    { id: '3-1-2', name: 'Suprema', categoryId: '3-1' },
    { id: '3-1-3', name: 'Mantra', categoryId: '3-1' },
  ],
  '6-1': [ // Solar Panels
    { id: '6-1-1', name: 'Luminous', categoryId: '6-1' },
    { id: '6-1-2', name: 'Adani', categoryId: '6-1' },
    { id: '6-1-3', name: 'Waaree', categoryId: '6-1' },
  ],
};

// Models under Brands
export const MODELS = {
  '1-1-1': [ // Hikvision IP Cameras
    {
      id: '1-1-1-1',
      name: 'DS-2CD2043G0-I',
      brandId: '1-1-1',
      image: 'https://via.placeholder.com/300x300?text=Hikvision+4MP',
    },
    {
      id: '1-1-1-2',
      name: 'DS-2CD2143G0-IS',
      brandId: '1-1-1',
      image: 'https://via.placeholder.com/300x300?text=Hikvision+4MP+Varifocal',
    },
    {
      id: '1-1-1-3',
      name: 'DS-2CD2385G1-I',
      brandId: '1-1-1',
      image: 'https://via.placeholder.com/300x300?text=Hikvision+8MP',
    },
  ],
  '2-1-1': [ // Honeywell Smoke Detectors
    {
      id: '2-1-1-1',
      name: 'XLS100',
      brandId: '2-1-1',
      image: 'https://via.placeholder.com/300x300?text=Honeywell+XLS100',
    },
    {
      id: '2-1-1-2',
      name: 'XLS200',
      brandId: '2-1-1',
      image: 'https://via.placeholder.com/300x300?text=Honeywell+XLS200',
    },
  ],
  '3-1-1': [ // ZKTeco Fingerprint Scanners
    {
      id: '3-1-1-1',
      name: 'K40',
      brandId: '3-1-1',
      image: 'https://via.placeholder.com/300x300?text=ZKTeco+K40',
    },
    {
      id: '3-1-1-2',
      name: 'K50',
      brandId: '3-1-1',
      image: 'https://via.placeholder.com/300x300?text=ZKTeco+K50',
    },
  ],
};

// Specifications and Prices for Models
export const PRODUCTS = {
  '1-1-1-1': { // Hikvision DS-2CD2043G0-I
    id: '1-1-1-1',
    modelId: '1-1-1-1',
    name: 'Hikvision DS-2CD2043G0-I',
    specifications: {
      'Resolution': '4MP (2688 × 1520)',
      'Lens': '2.8mm Fixed',
      'Night Vision': 'Up to 30m IR Range',
      'Weatherproof': 'IP67',
      'Power Supply': '12VDC / PoE',
      'Compression': 'H.265+/H.265/H.264+',
      'Warranty': '3 Years',
    },
    price: 8500,
    originalPrice: 10000,
    inStock: true,
    rating: 4.5,
    reviews: 120,
    description: 'High-resolution 4MP CCTV camera with night vision and motion detection.',
  },
  '1-1-1-2': { // Hikvision DS-2CD2143G0-IS
    id: '1-1-1-2',
    modelId: '1-1-1-2',
    name: 'Hikvision DS-2CD2143G0-IS',
    specifications: {
      'Resolution': '4MP (2688 × 1520)',
      'Lens': '2.8-12mm Varifocal',
      'Night Vision': 'Up to 30m IR Range',
      'Weatherproof': 'IP67',
      'Power Supply': '12VDC / PoE',
      'Compression': 'H.265+/H.265/H.264+',
      'Warranty': '3 Years',
    },
    price: 12000,
    originalPrice: 15000,
    inStock: true,
    rating: 4.6,
    reviews: 95,
    description: '4MP Varifocal IP camera with adjustable lens for flexible installation.',
  },
  '2-1-1-1': { // Honeywell XLS100
    id: '2-1-1-1',
    modelId: '2-1-1-1',
    name: 'Honeywell XLS100 Smoke Detector',
    specifications: {
      'Type': 'Photoelectric Smoke Detector',
      'Voltage': '12VDC',
      'Current': '45µA',
      'Operating Temperature': '-10°C to +55°C',
      'Humidity': '0-95% RH',
      'Warranty': '2 Years',
    },
    price: 2500,
    originalPrice: 3000,
    inStock: true,
    rating: 4.7,
    reviews: 85,
    description: 'Advanced photoelectric smoke detector with reliable detection.',
  },
  '3-1-1-1': { // ZKTeco K40
    id: '3-1-1-1',
    modelId: '3-1-1-1',
    name: 'ZKTeco K40 Fingerprint Scanner',
    specifications: {
      'Capacity': '3000 Fingerprints, 10000 Cards',
      'Display': '2.8" Color LCD',
      'Communication': 'TCP/IP, USB Host',
      'Power Supply': '12VDC',
      'Operating Temperature': '0°C to +45°C',
      'Warranty': '2 Years',
    },
    price: 15000,
    originalPrice: 18000,
    inStock: true,
    rating: 4.6,
    reviews: 200,
    description: 'Fingerprint-based attendance system with cloud sync.',
  },
};

// Helper functions
export const getProductCategoriesByService = (serviceId) => {
  return PRODUCT_CATEGORIES[serviceId] || [];
};

export const getBrandsByCategory = (categoryId) => {
  return BRANDS[categoryId] || [];
};

export const getModelsByBrand = (brandId) => {
  return MODELS[brandId] || [];
};

export const getProductByModel = (modelId) => {
  return PRODUCTS[modelId];
};

// Legacy support (for backward compatibility)
export const CATEGORIES = SERVICES;
export const SAMPLE_PRODUCTS = Object.values(PRODUCTS);
