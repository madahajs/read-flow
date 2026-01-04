import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { extractText } from '../services/ocrService'
import { generateAudio, type SubtitleBase } from '../services/ttsService'

export const useAudioStore = defineStore('audio', () => {
  // State
  const file = ref<File | null>(null)
  const ocrStatus = ref<'idle' | 'processing' | 'success' | 'error'>('idle')
  const extractedText = ref('')

  const selectedVoiceId = ref('zh-CN-XiaoxiaoNeural')
  const playbackSpeed = ref(1.0)
  const ttsStatus = ref<'idle' | 'processing' | 'success' | 'error'>('idle')

  const audioUrl = ref<string | null>(null)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const subtitles = ref<SubtitleBase[]>([])

  // Voice State
  const voices = ref<any[]>([])
  const isLoadingVoices = ref(false)

  // Actions
  const fetchVoices = async () => {
    isLoadingVoices.value = true
    try {
      const { getVoices } = await import('../services/voiceService')
      const voiceList = await getVoices()
      voices.value = voiceList
      // Set default if none selected or invalid
      if (voiceList.length > 0 && !voiceList.find((v) => v.id === selectedVoiceId.value)) {
        selectedVoiceId.value = voiceList[0].id
      }
    } catch (error) {
      console.error('Failed to fetch voices:', error)
    } finally {
      isLoadingVoices.value = false
    }
  }

  const handleFileUpload = async (uploadedFile: File) => {
    file.value = uploadedFile
    ocrStatus.value = 'processing'
    extractedText.value = ''

    try {
      const text = await extractText(uploadedFile)
      extractedText.value = text
      ocrStatus.value = 'success'
    } catch (error) {
      console.error('OCR Error:', error)
      ocrStatus.value = 'error'
    }
  }

  const updateText = (text: string) => {
    extractedText.value = text
  }

  const generateSpeech = async () => {
    if (!extractedText.value) return

    ttsStatus.value = 'processing'
    try {
      const result = await generateAudio(
        extractedText.value,
        selectedVoiceId.value,
        playbackSpeed.value,
      )
      audioUrl.value = result.audioUrl
      subtitles.value = result.subtitles
      ttsStatus.value = 'success'
    } catch (error) {
      console.error('TTS Error:', error)
      ttsStatus.value = 'error'
    }
  }

  return {
    file,
    ocrStatus,
    extractedText,
    selectedVoiceId,
    playbackSpeed,
    ttsStatus,
    audioUrl,
    isPlaying,
    currentTime,
    duration,
    subtitles,
    voices,
    isLoadingVoices,
    fetchVoices,
    handleFileUpload,
    updateText,
    generateSpeech,
  }
})
