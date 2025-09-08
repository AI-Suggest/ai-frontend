// Stability AI API integration service
// This service handles all communication with your backend API

class StabilityAIService {
  constructor() {
    this.baseUrl = import.meta.env.DEV
  ? "http://localhost:3000/api"
  : "import.meta.env.VITE_API_URL";
  }

  async generateImage(prompt, options = {}) {
    const requestBody = {
      prompt,
      width: options.width || 1024,
      height: options.height || 1024,
      samples: options.samples || 1,
      steps: options.steps || 30,
      cfg_scale: options.cfg_scale || 7,
      style_preset: options.style_preset || 'enhance',
      ...options,
    };

    try {
      const response = await fetch(`${this.baseUrl}/images/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Generation failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        imageUrl: data.imageUrl,
        seed: data.seed,
        prompt: prompt,
      };
    } catch (error) {
      console.error('Stability AI generation error:', error);
      throw error;
    }
  }

  async getGenerationHistory(limit = 50) {
    try {
      const response = await fetch(`${this.baseUrl}/images/history?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch generation history');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get generation history:', error);
      throw error;
    }
  }

  async getGenerationAllHistory(limit = 50) {
    try {
      const response = await fetch(`${this.baseUrl}/allHistory`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch generation history');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get generation history:', error);
      throw error;
    }
  }
  async deleteGeneration(generationId) {
    try {
      const response = await fetch(`${this.baseUrl}/deleteChat/${generationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete generation');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to delete generation:', error);
      throw error;
    }
  }

  getAuthToken() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token || '';
  }

  // Utility method to validate prompts
  validatePrompt(prompt) {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }
    
    if (prompt.length > 1000) {
      throw new Error('Prompt is too long. Please keep it under 1000 characters.');
    }

    // Check for potentially harmful content
    const bannedWords = ['nsfw', 'explicit', 'violence'];
    const lowerPrompt = prompt.toLowerCase();
    
    for (const word of bannedWords) {
      if (lowerPrompt.includes(word)) {
        throw new Error('Prompt contains inappropriate content. Please modify your request.');
      }
    }

    return true;
  }

  // Get available style presets
  getStylePresets() {
    return [
      { id: 'enhance', name: 'Enhanced', description: 'Enhanced details and clarity' },
      { id: 'anime', name: 'Anime', description: 'Anime and manga style' },
      { id: 'photographic', name: 'Photographic', description: 'Realistic photography' },
      { id: 'digital-art', name: 'Digital Art', description: 'Digital artwork style' },
      { id: 'comic-book', name: 'Comic Book', description: 'Comic book illustration' },
      { id: 'fantasy-art', name: 'Fantasy Art', description: 'Fantasy and magical themes' },
      { id: 'line-art', name: 'Line Art', description: 'Clean line drawings' },
      { id: 'analog-film', name: 'Analog Film', description: 'Vintage film aesthetic' },
      { id: 'neon-punk', name: 'Neon Punk', description: 'Cyberpunk neon style' },
      { id: 'isometric', name: 'Isometric', description: '3D isometric perspective' },
    ];
  }
}

export const stabilityAI = new StabilityAIService();