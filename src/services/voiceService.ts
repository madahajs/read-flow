import apiClient from './api'

export interface Voice {
  id: string
  name: string
  region: string
  language: string
  gender: string
  avatarUrl: string
  tags: string[]
}

export const getVoices = async (): Promise<Voice[]> => {
  const response = await apiClient.get('/voices')

  if (response.data.code === 200) {
    return response.data.data
  }
  return []
}
