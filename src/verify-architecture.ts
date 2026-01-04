
// Minimal polyfill for File/Blob if needed in Node 18 (though Node 18.20 should have it)
import { defineStore, createPinia, setActivePinia } from 'pinia';
import { useAudioStore } from './stores/audio';

// Mock File if not present (Node < 20 might need this, or if environment is strict)
if (typeof globalThis.File === 'undefined') {
  console.log('Polyfilling File...');
  class MockFile {
    name: string;
    type: string;
    constructor(chunks: any[], name: string, options: any) {
      this.name = name;
      this.type = options?.type || '';
    }
  }
  (globalThis as any).File = MockFile;
}

async function verify() {
  console.log('--- Verifying Architecture ---');
  
  // Setup Pinia
  const pinia = createPinia();
  setActivePinia(pinia);
  const store = useAudioStore();

  console.log('1. Initial State Check');
  if (store.ocrStatus !== 'idle') throw new Error('Initial status wrong');

  console.log('2. Testing File Upload (Mock OCR)');
  const file = new File(['test'], 'doc.txt', { type: 'text/plain' });
  
  const uploadPromise = store.handleFileUpload(file);
  if (store.ocrStatus !== 'processing') throw new Error('Status not processing');
  
  await uploadPromise;
  
  console.log('   OCR Text:', store.extractedText.substring(0, 30) + '...');
  if (store.ocrStatus !== 'success') throw new Error('OCR failed');
  if (!store.extractedText) throw new Error('No text extracted');

  console.log('3. Testing Audio Gen (Mock TTS)');
  const genPromise = store.generateSpeech();
  if (store.ttsStatus !== 'processing') throw new Error('TTS status not processing');
  
  await genPromise;
  
  console.log('   Audio URL:', store.audioUrl);
  console.log('   Subtitles:', store.subtitles.length);
  
  if (store.ttsStatus !== 'success') throw new Error('TTS failed');
  if (!store.audioUrl) throw new Error('No Audio URL');

  console.log('--- Verification SUCCESS ---');
}

verify().catch(e => {
  console.error('FAILED:', e);
  process.exit(1);
});
