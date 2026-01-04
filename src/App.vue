<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'
import { LogOut, User } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (authStore.isAuthenticated && !authStore.user) {
    authStore.fetchProfile()
  }
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white font-sans">
    <!-- White Navigation Bar (Speechify Style) -->
    <header class="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div class="container mx-auto px-6 h-16 flex items-center justify-between">
        <!-- Logo / Brand -->
        <div class="flex items-center space-x-2">
          <!-- Wave Icon -->
          <svg class="w-7 h-7 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </svg>
          <span class="text-xl font-bold text-gray-900 tracking-tight"> Read Flow </span>
        </div>

        <!-- Navigation Links (Center) -->
        <nav class="hidden md:flex items-center space-x-6">
          <RouterLink
            to="/convert"
            class="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            转换
          </RouterLink>
          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/history"
            class="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            历史记录
          </RouterLink>
        </nav>

        <!-- Right Side Buttons -->
        <div class="flex items-center space-x-3">
          <!-- Not Authenticated: Show Login/Register -->
          <template v-if="!authStore.isAuthenticated">
            <RouterLink
              to="/login"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              登录
            </RouterLink>
            <RouterLink
              to="/register"
              class="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
            >
              注册
            </RouterLink>
          </template>

          <!-- Authenticated: Show User Info and Logout -->
          <template v-else>
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-full">
                <User class="w-4 h-4 text-blue-600" />
                <span class="text-sm font-medium text-gray-700">
                  {{ authStore.user?.nickname || authStore.user?.username || '用户' }}
                </span>
              </div>
              <button
                @click="handleLogout"
                class="flex items-center space-x-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut class="w-4 h-4" />
                <span>退出</span>
              </button>
            </div>
          </template>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 w-full">
      <RouterView />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #ffffff;
}
</style>
