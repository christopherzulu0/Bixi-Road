// Mock API client to replace base44Client

// Mock storage for in-memory data
const mockStorage = {
  users: [],
  products: [],
  transactions: [],
  reviews: [],
  newsArticles: [],
  inquiries: [],
  notifications: []
};

// Map entity names to storage keys
const getStorageKey = (entityName) => {
  const mapping = {
    'product': 'products',
    'transaction': 'transactions',
    'review': 'reviews',
    'newsarticle': 'newsArticles',
    'inquiry': 'inquiries',
    'notification': 'notifications',
    'user': 'users'
  };
  return mapping[entityName.toLowerCase()] || entityName.toLowerCase() + 's';
};

// Mock entity implementations
const createMockEntity = (entityName) => {
  const storageKey = getStorageKey(entityName);
  
  return {
    // Filter method
    filter: async (query = {}, sortBy = '-created_date', limit = 100) => {
      let items = [...mockStorage[storageKey]];
      
      // Apply filters
      if (Object.keys(query).length > 0) {
        items = items.filter(item => {
          return Object.keys(query).every(key => {
            if (query[key] === undefined || query[key] === null) return true;
            return item[key] === query[key];
          });
        });
      }
      
      // Apply sorting
      if (sortBy.startsWith('-')) {
        const field = sortBy.substring(1);
        items.sort((a, b) => {
          if (typeof a[field] === 'number' && typeof b[field] === 'number') {
            return b[field] - a[field];
          }
          return String(b[field] || '').localeCompare(String(a[field] || ''));
        });
      } else {
        items.sort((a, b) => {
          if (typeof a[sortBy] === 'number' && typeof b[sortBy] === 'number') {
            return a[sortBy] - b[sortBy];
          }
          return String(a[sortBy] || '').localeCompare(String(b[sortBy] || ''));
        });
      }
      
      return items.slice(0, limit);
    },
    
    // List method
    list: async (sortBy = '-created_date', limit = 100) => {
      return createMockEntity(entityName).filter({}, sortBy, limit);
    },
    
    // Get by ID
    get: async (id) => {
      const items = mockStorage[storageKey];
      return items.find(item => item.id === id) || null;
    },
    
    // Create method
    create: async (data) => {
      const items = mockStorage[storageKey];
      const newItem = {
        id: `${entityName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...data,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString()
      };
      items.push(newItem);
      return newItem;
    },
    
    // Update method
    update: async (id, data) => {
      const items = mockStorage[storageKey];
      const index = items.findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error(`${entityName} with id ${id} not found`);
      }
      items[index] = {
        ...items[index],
        ...data,
        updated_date: new Date().toISOString()
      };
      return items[index];
    },
    
    // Delete method
    delete: async (id) => {
      const items = mockStorage[storageKey];
      const index = items.findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error(`${entityName} with id ${id} not found`);
      }
      items.splice(index, 1);
      return { success: true };
    }
  };
};

// Mock auth implementation
const mockAuth = {
  me: async () => {
    // Return null (not logged in) or you can return a mock user
    const users = mockStorage.users;
    if (users.length > 0) {
      return users[0];
    }
    return null;
  },
  
  login: async (email, password) => {
    // Mock login - create user if not exists
    let user = mockStorage.users.find(u => u.email === email);
    if (!user) {
      user = {
        id: `user_${Date.now()}`,
        email: email,
        full_name: email.split('@')[0],
        role: 'buyer',
        is_verified_miner: false,
        verification_status: 'none',
        created_date: new Date().toISOString()
      };
      mockStorage.users.push(user);
    }
    return user;
  },
  
  logout: () => {
    // Clear current user (in a real app, this would clear tokens)
    console.log('Logged out');
  },
  
  redirectToLogin: (returnUrl) => {
    console.log('Redirecting to login', returnUrl);
    // In a real app, this would redirect to login page
  },
  
  register: async (userData) => {
    const user = {
      id: `user_${Date.now()}`,
      ...userData,
      role: userData.role || 'buyer',
      is_verified_miner: false,
      verification_status: 'none',
      created_date: new Date().toISOString()
    };
    mockStorage.users.push(user);
    return user;
  }
};

// Mock integrations
const mockIntegrations = {
  Core: {
    InvokeLLM: async (params) => {
      console.log('Mock LLM invocation:', params);
      return { response: 'Mock LLM response' };
    },
    
    SendEmail: async (params) => {
      console.log('Mock email send:', params);
      return { success: true, message_id: `email_${Date.now()}` };
    },
    
    UploadFile: async ({ file }) => {
      console.log('Mock file upload:', file?.name);
      // Return a mock URL
      const fileUrl = `https://mock-storage.example.com/files/${Date.now()}_${file?.name || 'file'}`;
      return { file_url: fileUrl };
    },
    
    GenerateImage: async (params) => {
      console.log('Mock image generation:', params);
      return { image_url: `https://mock-storage.example.com/images/${Date.now()}.png` };
    },
    
    ExtractDataFromUploadedFile: async (params) => {
      console.log('Mock data extraction:', params);
      return { extracted_data: {} };
    },
    
    CreateFileSignedUrl: async (params) => {
      console.log('Mock signed URL creation:', params);
      return { signed_url: `https://mock-storage.example.com/signed/${Date.now()}` };
    },
    
    UploadPrivateFile: async (params) => {
      console.log('Mock private file upload:', params);
      return { file_url: `https://mock-storage.example.com/private/${Date.now()}_${params?.file?.name || 'file'}` };
    }
  }
};

// Export mock client similar to base44 structure
export const mockClient = {
  entities: {
    Product: createMockEntity('Product'),
    Transaction: createMockEntity('Transaction'),
    Review: createMockEntity('Review'),
    NewsArticle: createMockEntity('NewsArticle'),
    Inquiry: createMockEntity('Inquiry'),
    Notification: createMockEntity('Notification'),
    User: createMockEntity('User')
  },
  auth: mockAuth,
  integrations: mockIntegrations
};

// Helper to initialize with some mock data
export const initializeMockData = () => {
  if (mockStorage.users.length === 0) {
    mockStorage.users.push({
      id: 'user_1',
      email: 'admin@example.com',
      full_name: 'Admin User',
      role: 'admin',
      is_verified_miner: false,
      verification_status: 'approved',
      country: 'Ghana',
      created_date: new Date().toISOString()
    });
  }
};

