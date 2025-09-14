// API service for backend communication
const API_BASE_URL = import.meta.env.DEV
 ? "https://logoimage-ai.onrender.com/api"
  : "https://logoimage-ai.onrender.com/api";

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, options = {}) {

    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }

    try {
  
      const response = await fetch(url, config);

      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error in try! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed in error auth token:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (!response.user || !response.token) {
      throw new Error('Invalid credentials');
    }
    
    return response;
  }

  async signup(userData) {

    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    

    if (!response.user ) {
      throw new Error('Registration failed');
    }
    
    return response;
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Image generation endpoints
 async generateImage(prompt, chatId, options = {}) {
  const bodyData = {
    prompt,
    width: options.width || 1024,
    height: options.height || 1024,
    samples: options.samples || 1,
    steps: options.steps || 30,
    cfg_scale: options.cfg_scale || 7,
    ...options,
  };

  // Only include id if it is truthy
  if (chatId) bodyData.chatId = chatId;

  return this.request('/images/generate', {
    method: 'POST',
    body: JSON.stringify(bodyData),
  });
}

  // Chat session endpoints
  async getSessions() {
    return this.request('/sessions');
  }

  async createSession(sessionData) {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateSession(sessionId, updates) {
    return this.request(`/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteSession(sessionId) {
    return this.request(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  // User profile endpoints
  async getProfile() {
    return this.request('/user/profile');
  }

  async updateProfile(profileData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }
async getPreviousChat(chatId) {
  return this.request(`/prevChat/${chatId}`, {
    method: 'GET',
  });
}

}

export const apiService = new ApiService();