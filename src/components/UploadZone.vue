<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAudioStore } from '@/stores/audio'
import { useAuthStore } from '@/stores/auth'
import { UploadCloud, Loader2 } from 'lucide-vue-next'

const store = useAudioStore()
const authStore = useAuthStore()
const router = useRouter()
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const onDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = true
}

const onDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  if (e.dataTransfer?.files.length) {
    handleFile(e.dataTransfer.files[0])
  }
}

const onFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    handleFile(target.files[0])
  }
}

const handleUploadClick = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  fileInput.value?.click()
}

const handleFile = (file: File) => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  store.handleFileUpload(file)
}
</script>

<template>
  <!-- Upload Button Style (Not a large zone, just a button) -->
  <button
    @click="handleUploadClick"
    :disabled="store.ocrStatus === 'processing'"
    class="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all transform active:scale-95 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
  >
    <Loader2 v-if="store.ocrStatus === 'processing'" class="w-5 h-5 animate-spin" />
    <UploadCloud v-else class="w-5 h-5" />
    <span v-if="store.ocrStatus === 'processing'">识别中...</span>
    <span v-else>开始使用</span>
  </button>

  <input
    ref="fileInput"
    type="file"
    class="hidden"
    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
    @change="onFileSelect"
  />

  <!-- Hidden drag zone (still functional) -->
  <div
    v-if="false"
    class="hidden"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  ></div>
</template>
