import apiClient from './api'

export interface SubtitleBase {
  id: number
  startTime: number
  endTime: number
  text: string
}

export const generateAudio = async (
  text: string,
  voiceId: string,
  speed: number,
): Promise<{ audioUrl: string; subtitles: SubtitleBase[] }> => {
  const response = await apiClient.post('/tts/generate', {
    text,
    voiceId,
    speed,
  })

  // Assuming response structure: { code: 200, data: { audioUrl: "...", subtitles: [...] } }
  if (response.data.code === 200) {
    return response.data.data
  }
  throw new Error(response.data.message || 'TTS generation failed')
}
