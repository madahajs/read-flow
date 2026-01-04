<script setup lang="ts">
import { ref } from 'vue'
import { useAudioStore } from '@/stores/audio'
import UploadZone from '@/components/UploadZone.vue'
import TextPreview from '@/components/TextPreview.vue'
import VoiceConfig from '@/components/VoiceConfig.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'
import { FileText, Upload } from 'lucide-vue-next'

const store = useAudioStore()
const activeTab = ref<'text' | 'upload'>('upload')
</script>

<template>
  <div class="min-h-[calc(100vh-64px)] bg-white">
    <!-- Main Two-Column Layout -->
    <div class="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
      <!-- LEFT COLUMN: Main Content Area (~65%) -->
      <div class="flex-1 lg:border-r border-gray-100 flex flex-col order-2 lg:order-1">
        <!-- Tabs Row -->
        <div class="flex border-b border-gray-100 overflow-x-auto">
          <button
            @click="activeTab = 'text'"
            class="px-8 py-5 flex items-center space-x-2 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap"
            :class="
              activeTab === 'text'
                ? 'border-blue-600 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            "
          >
            <FileText class="w-4 h-4" />
            <span>文字转语音</span>
          </button>
          <button
            @click="activeTab = 'upload'"
            class="px-8 py-5 flex items-center space-x-2 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap"
            :class="
              activeTab === 'upload'
                ? 'border-blue-600 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            "
          >
            <Upload class="w-4 h-4" />
            <span>上传文件</span>
          </button>
        </div>

        <!-- Content Area -->
        <div class="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-white">
          <!-- Audio Player (If ready) -->
          <div v-if="store.ttsStatus === 'success'" class="w-full px-4 lg:px-8">
            <div class="mb-6 flex items-center justify-between">
              <h3 class="text-xl font-bold text-gray-800">音频已就绪</h3>
              <button
                @click="store.ttsStatus = 'idle'"
                class="text-sm text-blue-600 hover:underline"
              >
                重新开始
              </button>
            </div>
            <AudioPlayer />
          </div>

          <!-- Input Modes -->
          <div v-else class="w-full px-4 lg:px-8 flex flex-col flex-1 py-8">
            <!-- Upload Mode -->
            <template v-if="activeTab === 'upload'">
              <div v-if="store.ocrStatus === 'success'" class="w-full h-full flex flex-col">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="font-semibold text-gray-700">提取的内容</h3>
                  <button
                    @click="store.ocrStatus = 'idle'"
                    class="text-xs text-gray-400 hover:text-blue-600"
                  >
                    重新上传
                  </button>
                </div>
                <TextPreview class="flex-1 min-h-[400px]" />
              </div>
              <div
                v-else
                class="w-full h-full flex flex-col items-center justify-center text-center"
              >
                <!-- Illustration (Blue Bubbles) -->
                <div class="relative w-48 h-48 lg:w-64 lg:h-64 mb-8">
                  <!-- Background circles -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-36 h-36 lg:w-48 lg:h-48 rounded-full bg-blue-50 opacity-60"></div>
                  </div>
                  <div class="absolute top-4 left-8 w-8 h-8 rounded-full bg-blue-100"></div>
                  <div class="absolute top-12 right-6 w-6 h-6 rounded-full bg-blue-200"></div>
                  <div class="absolute bottom-8 left-4 w-5 h-5 rounded-full bg-blue-300"></div>
                  <div class="absolute bottom-16 right-12 w-4 h-4 rounded-full bg-blue-200"></div>
                  <div
                    class="absolute top-20 left-16 w-3 h-3 rounded-full bg-blue-400 opacity-50"
                  ></div>
                  <!-- Smiley faces -->
                  <div
                    class="absolute top-6 left-20 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-400 text-lg"
                  >
                    😊
                  </div>
                  <div
                    class="absolute top-16 right-16 w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-500 text-sm"
                  >
                    😊
                  </div>
                  <div
                    class="absolute bottom-20 left-12 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-400 text-xs"
                  >
                    😊
                  </div>
                  <!-- Center Icon -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-200"
                    >
                      <svg
                        class="w-8 h-8 lg:w-10 lg:h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">快完成了！</h2>
                <p class="text-gray-500 mb-8 max-w-sm">
                  打开应用程序，在几秒钟内将您的文档转换为语音
                </p>

                <UploadZone class="w-full max-w-xl mx-auto" />
              </div>
            </template>

            <!-- Text Mode -->
            <template v-if="activeTab === 'text'">
              <div class="w-full h-full flex flex-col">
                <textarea
                  v-model="store.extractedText"
                  class="flex-1 w-full p-4 lg:p-6 text-base lg:text-lg text-gray-700 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none placeholder-gray-400"
                  placeholder="在此输入或粘贴文本..."
                ></textarea>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: Voice Settings (~35%) -->
      <div
        class="w-full lg:w-[400px] flex-shrink-0 bg-white flex flex-col border-b lg:border-b-0 lg:border-l border-gray-100 order-1 lg:order-2 h-[400px] lg:h-[calc(100vh-64px)] lg:sticky lg:top-16"
      >
        <VoiceConfig />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure proper height calculation */
</style>
