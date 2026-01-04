import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/authService'
import type { LoginParams, RegisterParams, User } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(authService.getToken())

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials: LoginParams) {
    try {
      const response = await authService.login(credentials)
      if (response.code === 200) {
        token.value = response.data.token
        user.value = response.data.user
        authService.setToken(response.data.token)
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  async function register(data: RegisterParams) {
    try {
      const response = await authService.register(data)
      if (response.code === 200) {
        token.value = response.data.token
        user.value = response.data.user
        authService.setToken(response.data.token)
        return true
      }
      return false
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  async function logout() {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout API call failed:', error)
    }
    token.value = null
    user.value = null
    authService.removeToken()
  }

  async function fetchProfile() {
    if (!token.value) return
    try {
      const response = await authService.getProfile()
      // Assuming response structure, adjustment might be needed based on exact API return for profile
      // The service returns the whole payload, checking if it needs unwrapping
      // The service definition returns { data: User }, so...
      if (response && response.data) {
        // This assumes the profile endpoint returns { data: User } similar to others
        // If strictly following the documented getProfile:
        // existing doc says: GET /user/profile
        // It doesn't explicitly show the response wrapper in the snippet I saw, but usually it follows standard { code, data }
        // I'll assume standard wrapper.
        // Actually, let's look at the type def in authService. It says Promise<{data: User}>.
        // Let's assume the API returns standard response structure.
        // Wait, authService.getProfile returns `response.data`.
        user.value = response.data
      }
    } catch (error) {
      console.error('Fetch profile failed:', error)
      logout()
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchProfile,
  }
})
