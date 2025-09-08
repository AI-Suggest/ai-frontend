// API configuration and endpoints

export const API_CONFIG = {
  // Base URL for your backend API
  BASE_URL: import.meta.env.VITE_API_URL|| 'http://localhost:3001/api',
  
  // Stability AI configuration
  STABILITY_AI: {
    BASE_URL: 'https://api.stability.ai/v1',
    MODEL: 'stable-diffusion-xl-1024-v1-0',
  },

  // Request timeouts
  TIMEOUTS: {
    DEFAULT: 30000, // 30 seconds
    IMAGE_GENERATION: 60000, // 60 seconds for image generation
    UPLOAD: 120000, // 2 minutes for uploads
  },

  // API endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      SIGNUP: '/auth/signup',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/profile',
    },
    
    // Image generation
    IMAGES: {
      GENERATE: '/images/generate',
      HISTORY: '/images/history',
      DELETE: '/images',
      DOWNLOAD: '/images/download',
    },
    
    // Chat sessions
    SESSIONS: {
      LIST: '/sessions',
      CREATE: '/sessions',
      UPDATE: '/sessions',
      DELETE: '/sessions',
    },
    
    // User management
    USER: {
      PROFILE: '/user/profile',
      SETTINGS: '/user/settings',
      USAGE: '/user/usage',
    },
  },
};

// Environment-specific configurations
export const getApiConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  const configs = {
    development: {
      ...API_CONFIG,
      BASE_URL: 'http://localhost:3001/api',
      DEBUG: true,
    },
    production: {
      ...API_CONFIG,
      BASE_URL: import.meta.env.VITE_API_URLL || 'https://your-api-domain.com/api',
      DEBUG: false,
    },
  };

  return configs[env] || configs.development;
};