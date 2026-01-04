<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAudioStore } from '@/stores/audio'
import { useAuthStore } from '@/stores/auth'
import { Play, Download, CheckCircle2, ChevronDown, Loader2 } from 'lucide-vue-next'

const store = useAudioStore()
const authStore = useAuthStore()
const router = useRouter()

// Language menu state
const showLanguageMenu = ref(false)
const selectedLanguage = ref('zh-CN')
const languageOptions = [
  { code: 'zh-CN', name: '中文 (中国)', flag: '🇨🇳' },
  { code: 'zh-TW', name: '中文 (台湾)', flag: '🇹🇼' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'all', name: '全部语言', flag: '🌍' },
]

const currentLanguage = computed(() => {
  return languageOptions.find((l) => l.code === selectedLanguage.value) || languageOptions[0]
})

const filteredVoices = computed(() => {
  if (selectedLanguage.value === 'all') {
    return store.voices
  }
  return store.voices.filter((v) => v.language === selectedLanguage.value)
})

const selectLanguage = (code: string) => {
  selectedLanguage.value = code
  showLanguageMenu.value = false
}

// Speed menu state
const showSpeedMenu = ref(false)
const speedOptions = [0.5, 0.8, 1.0, 1.2, 1.5, 2.0]

const selectSpeed = (speed: number) => {
  store.playbackSpeed = speed
  showSpeedMenu.value = false
}

// Close menu when clicking outside
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.dropdown-menu')) {
    showSpeedMenu.value = false
    showLanguageMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (store.voices.length === 0) {
    store.fetchVoices()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleGenerate = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  store.generateSpeech()
}

const handleDownload = () => {
  if (store.audioUrl) {
    const a = document.createElement('a')
    a.href = store.audioUrl
    a.download = `read-flow-audio-${Date.now()}.mp3`
    a.click()
  }
}
</script>

<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Top Controls: Language & Speed -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <!-- Language Dropdown -->
      <div class="relative dropdown-menu flex-1 mr-2">
        <button
          @click="showLanguageMenu = !showLanguageMenu"
          class="w-full flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
        >
          <span class="text-lg">{{ currentLanguage.flag }}</span>
          <span class="text-sm font-medium text-gray-700">{{ currentLanguage.name }}</span>
          <ChevronDown class="w-4 h-4 text-gray-400 ml-auto" />
        </button>
        <!-- Language Menu -->
        <div
          v-if="showLanguageMenu"
          class="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-full max-h-[200px] overflow-y-auto"
        >
          <button
            v-for="lang in languageOptions"
            :key="lang.code"
            @click="selectLanguage(lang.code)"
            class="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors flex items-center space-x-2"
            :class="
              selectedLanguage === lang.code
                ? 'text-blue-600 font-bold bg-blue-50'
                : 'text-gray-700'
            "
          >
            <span>{{ lang.flag }}</span>
            <span>{{ lang.name }}</span>
          </button>
        </div>
      </div>

      <!-- Speed Dropdown -->
      <div class="relative dropdown-menu">
        <button
          @click="showSpeedMenu = !showSpeedMenu"
          class="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
        >
          <span class="text-sm font-medium text-gray-700">速度: {{ store.playbackSpeed }}x</span>
          <ChevronDown class="w-4 h-4 text-gray-400" />
        </button>
        <!-- Speed Menu -->
        <div
          v-if="showSpeedMenu"
          class="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]"
        >
          <button
            v-for="speed in speedOptions"
            :key="speed"
            @click="selectSpeed(speed)"
            class="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
            :class="
              store.playbackSpeed === speed ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-700'
            "
          >
            {{ speed }}x
          </button>
        </div>
      </div>
    </div>

    <!-- Voice Avatar Grid -->
    <div class="flex-1 min-h-0 overflow-y-auto p-6">
      <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">推荐声音</h3>

      <div v-if="store.isLoadingVoices" class="flex items-center justify-center p-8">
        <Loader2 class="w-8 h-8 text-blue-500 animate-spin" />
      </div>
      <div v-else class="grid grid-cols-3 gap-4">
        <button
          v-for="voice in filteredVoices"
          :key="voice.id"
          @click="store.selectedVoiceId = voice.id"
          class="relative flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-200 group"
          :class="
            store.selectedVoiceId === voice.id
              ? 'bg-white shadow-sm scale-105'
              : 'hover:bg-white/60'
          "
        >
          <!-- Avatar Wrapper -->
          <div
            class="relative rounded-full p-0.5 transition-all duration-200"
            :class="
              store.selectedVoiceId === voice.id
                ? 'bg-blue-500 ring-2 ring-blue-100'
                : 'bg-transparent group-hover:ring-2 group-hover:ring-slate-200'
            "
          >
            <img
              :src="voice.avatarUrl"
              :alt="voice.name"
              class="w-14 h-14 rounded-full bg-slate-200 object-cover border-2 border-white"
            />

            <!-- Selected Checkmark -->
            <div
              v-if="store.selectedVoiceId === voice.id"
              class="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white shadow-sm"
            >
              <CheckCircle2 class="w-3 h-3" stroke-width="3" />
            </div>
          </div>

          <!-- Name & Info -->
          <div class="text-center">
            <div
              class="text-sm font-bold leading-tight"
              :class="store.selectedVoiceId === voice.id ? 'text-blue-600' : 'text-slate-700'"
            >
              {{ voice.name }}
            </div>
            <div
              class="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center justify-center gap-1"
            >
              <span>{{ voice.gender === 'Female' ? '♀' : '♂' }}</span>
              <span>{{ voice.region }}</span>
            </div>
            <!-- Tags -->
            <div v-if="voice.tags?.length" class="flex flex-wrap justify-center gap-1 mt-1">
              <span
                v-for="tag in voice.tags.slice(0, 2)"
                :key="tag"
                class="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Bottom Action Bar -->
    <div class="px-6 py-5 border-t border-gray-100 flex items-center space-x-4">
      <!-- Download Button -->
      <button
        @click="handleDownload"
        :disabled="!store.audioUrl"
        class="flex items-center space-x-2 px-5 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download class="w-5 h-5" />
        <span class="text-sm font-medium">下载</span>
      </button>

      <!-- Generate Button -->
      <button
        @click="handleGenerate"
        :disabled="store.ttsStatus === 'processing' || !store.extractedText"
        class="flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-bold text-white transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        :class="store.ttsStatus === 'processing' ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'"
      >
        <Play class="w-5 h-5 fill-white" />
        <span v-if="store.ttsStatus === 'processing'">生成中...</span>
        <span v-else>生成语音</span>
      </button>
    </div>
  </div>
</template>
