import apiClient from './api'

export interface HistoryItem {
  id: string
  title: string
  type: string
  createdAt: string
  status: string
  audioDuration?: number
  audioUrl?: string
}

export interface HistoryListResponse {
  list: HistoryItem[]
  total: number
}

export const getHistory = async (page = 1, pageSize = 20): Promise<HistoryListResponse> => {
  const response = await apiClient.get('/history', {
    params: { page, pageSize },
  })

  if (response.data.code === 200) {
    return response.data.data
  }
  return { list: [], total: 0 }
}

export const deleteHistory = async (id: string): Promise<boolean> => {
  const response = await apiClient.delete(`/history/${id}`)
  return response.data.code === 200
}
