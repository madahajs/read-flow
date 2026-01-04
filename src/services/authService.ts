import apiClient from './api'
import type { LoginParams, RegisterParams, AuthResponse, User } from '@/types/auth'

export default {
  async login(credentials: LoginParams): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  async register(data: RegisterParams): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  async getProfile(): Promise<{ data: User }> {
    const response = await apiClient.get('/user/profile')
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  setToken(token: string) {
    localStorage.setItem('token', token)
  },

  removeToken() {
    localStorage.removeItem('token')
  },

  getToken() {
    return localStorage.getItem('token')
  },
}
