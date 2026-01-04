import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAudioStore } from '../audio';

describe('Audio Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with default state', () => {
    const store = useAudioStore();
    expect(store.ocrStatus).toBe('idle');
    expect(store.extractedText).toBe('');
    expect(store.subtitles).toHaveLength(0);
  });

  it('handleFileUpload updates state and calls OCR', async () => {
    const store = useAudioStore();
    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    
    // Trigger upload
    const promise = store.handleFileUpload(file);
    
    expect(store.ocrStatus).toBe('processing');
    expect(store.file).toBe(file);
    
    await promise;
    
    expect(store.ocrStatus).toBe('success');
    expect(store.extractedText).toContain('Mock Text Extraction');
  });

  it('generateSpeech updates state and calls TTS', async () => {
    const store = useAudioStore();
    store.extractedText = 'Hello Test';
    
    const promise = store.generateSpeech();
    
    expect(store.ttsStatus).toBe('processing');
    
    await promise;
    
    expect(store.ttsStatus).toBe('success');
    expect(store.audioUrl).toBeTruthy();
    expect(store.subtitles.length).toBeGreaterThan(0);
  });
});
