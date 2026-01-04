<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { useAudioStore } from '@/stores/audio'
import { Play, Pause, RotateCcw, Download } from 'lucide-vue-next'

const store = useAudioStore()
const audioRef = ref<HTMLAudioElement | null>(null)
const lyricsContainerRef = ref<HTMLDivElement | null>(null)

const togglePlay = () => {
  if (!audioRef.value) return
  if (store.isPlaying) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
}

const onTimeUpdate = () => {
  if (audioRef.value) {
    store.currentTime = audioRef.value.currentTime
  }
}

const onEnded = () => {
  store.isPlaying = false
}

const onPlay = () => (store.isPlaying = true)
const onPause = () => (store.isPlaying = false)
const onLoadedMetadata = () => {
  if (audioRef.value) {
    store.duration = audioRef.value.duration
    // Apply playback speed when audio loads
    audioRef.value.playbackRate = store.playbackSpeed
  }
}

// Sync speed when changed
watch(
  () => store.playbackSpeed,
  (newSpeed) => {
    if (audioRef.value) {
      audioRef.value.playbackRate = newSpeed
    }
  },
  { immediate: true },
)

// Split mixed language subtitle (e.g., "早上好 Time to wake up" -> ["早上好", "Time to wake up"])
const splitSubtitleText = (text: string): string[] => {
  // Match Chinese characters group and non-Chinese group
  const chineseMatch = text.match(/[\u4e00-\u9fa5，。！？、：；""''（）]+/g)
  const englishMatch = text.match(/[a-zA-Z][a-zA-Z0-9\s',!?.;:()-]*/g)

  const parts: string[] = []
  if (chineseMatch) {
    parts.push(...chineseMatch.map((s) => s.trim()).filter((s) => s.length > 0))
  }
  if (englishMatch) {
    parts.push(...englishMatch.map((s) => s.trim()).filter((s) => s.length > 1))
  }

  // If splitting didn't work well, return original
  if (parts.length === 0) return [text]

  // Sort to put English first, then Chinese (for bilingual display)
  const english = parts.filter((p) => /^[a-zA-Z]/.test(p))
  const chinese = parts.filter((p) => /^[\u4e00-\u9fa5]/.test(p))
  return [...english, ...chinese]
}

// Show all subtitles (no filtering - bilingual content)
const filteredSubtitles = computed(() => store.subtitles)

// Find current active subtitle index
const activeSubtitleIndex = computed(() => {
  return filteredSubtitles.value.findIndex(
    (sub) => store.currentTime >= sub.startTime && store.currentTime < sub.endTime,
  )
})

// Auto-scroll to active subtitle
watch(activeSubtitleIndex, (newIndex) => {
  if (newIndex >= 0 && lyricsContainerRef.value) {
    nextTick(() => {
      const activeElement = lyricsContainerRef.value?.querySelector(`[data-index="${newIndex}"]`)
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }
})

// Format time
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

// Seek
const seek = (e: Event) => {
  const target = e.target as HTMLInputElement
  const time = parseFloat(target.value)
  if (audioRef.value) {
    audioRef.value.currentTime = time
  }
}

const downloadAudio = () => {
  if (store.audioUrl) {
    const a = document.createElement('a')
    a.href = store.audioUrl
    a.download = `read-flow-audio-${Date.now()}.mp3`
    a.click()
  }
}

const downloadText = () => {
  const blob = new Blob([store.extractedText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `read-flow-text-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

const resetPlayback = () => {
  store.currentTime = 0
  if (audioRef.value) {
    audioRef.value.currentTime = 0
  }
}

// Click subtitle to seek
const seekToSubtitle = (startTime: number) => {
  if (audioRef.value) {
    audioRef.value.currentTime = startTime
    store.currentTime = startTime
  }
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
    <!-- Lyrics Display Area -->
    <div
      ref="lyricsContainerRef"
      class="bg-gradient-to-b from-gray-900 to-gray-800 h-[320px] overflow-y-auto scroll-smooth"
    >
      <!-- Empty state -->
      <div v-if="filteredSubtitles.length === 0" class="h-full flex items-center justify-center">
        <p class="text-gray-400 text-lg">点击播放开始收听</p>
      </div>

      <!-- Lyrics list -->
      <div v-else class="py-20 px-6">
        <div
          v-for="(sub, index) in filteredSubtitles"
          :key="sub.id"
          :data-index="index"
          @click="seekToSubtitle(sub.startTime)"
          class="py-2 px-4 text-center cursor-pointer transition-all duration-300 rounded-lg"
          :class="{
            'bg-white/10 scale-105': activeSubtitleIndex === index,
            'hover:text-gray-300': activeSubtitleIndex !== index,
          }"
        >
          <div
            v-for="(line, lineIndex) in splitSubtitleText(sub.text)"
            :key="lineIndex"
            class="transition-all duration-300"
            :class="{
              'text-white text-xl font-bold': activeSubtitleIndex === index,
              'text-gray-500 text-base': activeSubtitleIndex !== index,
            }"
          >
            {{ line }}
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="p-6 bg-white">
      <!-- Progress Bar -->
      <div class="mb-4">
        <input
          type="range"
          :value="store.currentTime"
          :max="store.duration || 100"
          @input="seek"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>{{ formatTime(store.currentTime) }}</span>
          <span>{{ formatTime(store.duration) }}</span>
        </div>
      </div>

      <!-- Button Controls -->
      <div class="flex items-center justify-between">
        <div class="flex space-x-4">
          <button @click="resetPlayback" class="p-2 text-gray-400 hover:text-gray-600 transition">
            <RotateCcw class="w-5 h-5" />
          </button>
        </div>

        <button
          @click="togglePlay"
          class="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 shadow-lg transition-transform transform active:scale-95"
        >
          <Pause v-if="store.isPlaying" class="w-6 h-6 fill-current" />
          <Play v-else class="w-6 h-6 fill-current ml-1" />
        </button>

        <div class="flex space-x-4 items-center">
          <div class="relative group">
            <button
              class="p-2 text-gray-400 hover:text-gray-600 transition flex items-center space-x-1"
            >
              <span class="text-sm font-bold">{{ store.playbackSpeed }}x</span>
            </button>
          </div>

          <div class="flex space-x-2">
            <button
              @click="downloadText"
              class="p-2 text-gray-400 hover:text-blue-600 transition"
              title="下载文本"
            >
              <span class="text-sm font-bold">T</span>
            </button>
            <button
              @click="downloadAudio"
              class="p-2 text-gray-400 hover:text-blue-600 transition"
              title="下载音频"
            >
              <Download class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <audio
      ref="audioRef"
      :src="store.audioUrl || ''"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      class="hidden"
    ></audio>
  </div>
</template>

<style scoped>
/* Hide scrollbar but keep functionality */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}
</style>
