import { useState, useCallback } from 'react';
import { stabilityAI } from '../services/stabilityApi';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const generateImage = useCallback(async (prompt, options = {}) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    try {
      // Validate prompt
      stabilityAI.validatePrompt(prompt);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      const result = await stabilityAI.generateImage(prompt, options);
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      // Small delay to show completion
      setTimeout(() => setGenerationProgress(0), 500);
      
      return result;
    } catch (error) {
      console.error('Image generation error:', error);
      setGenerationProgress(0);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const getStylePresets = useCallback(() => {
    return stabilityAI.getStylePresets();
  }, []);

  return {
    generateImage,
    isGenerating,
    generationProgress,
    getStylePresets,
  };
};