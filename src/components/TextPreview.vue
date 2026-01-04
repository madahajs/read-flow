<script setup lang="ts">
import { useAudioStore } from '@/stores/audio';
import { Pencil, AlignLeft } from 'lucide-vue-next';

const store = useAudioStore();
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- Removed header to rely on parent container context -->
    
    <div class="flex-1 relative">
      <textarea
        v-model="store.extractedText"
        class="w-full h-full p-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all resize-none text-gray-700 leading-relaxed custom-scrollbar shadow-sm"
        placeholder="Text will appear here..."
      ></textarea>
      
      <div class="absolute bottom-4 right-4 text-xs text-gray-400 font-medium bg-white/80 px-2 py-1 rounded-full border border-gray-100 backdrop-blur-sm">
        {{ store.extractedText.length }} chars
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}
</style>
