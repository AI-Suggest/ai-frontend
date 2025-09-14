// Local storage utilities for offline functionality

const STORAGE_KEYS = {
  USER: 'ai_studio_user',
  SESSIONS: 'ai_studio_sessions',
  SETTINGS: 'ai_studio_settings',
};

export const storage = {
  // User storage
  getUser() {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  },

  setUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  removeUser() {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Sessions storage
  getSessions() {
    const sessionsData = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!sessionsData) return [];
    
    return JSON.parse(sessionsData).map((session) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      messages: session.messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  },

  setSessions(sessions) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },

  addSession(session) {
    const sessions = this.getSessions();
    sessions.unshift(session);
    this.setSessions(sessions);
  },

  updateSession(sessionId, updates) {
    const sessions = this.getSessions();
    const index = sessions.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      sessions[index] = { ...sessions[index], ...updates };
      this.setSessions(sessions);
    }
  },

  removeSession(sessionId) {
    const sessions = this.getSessions();
    const filtered = sessions.filter(s => s.id !== sessionId);
    this.setSessions(filtered);
  },

  // Settings storage
  getSettings() {
    const settingsData = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settingsData ? JSON.parse(settingsData) : {
      theme: 'dark',
      autoSave: true,
      imageQuality: 'high',
      defaultStyle: 'enhance',
    };
  },

  setSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Clear all data
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};