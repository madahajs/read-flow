<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  errorMsg.value = ''
  isLoading.value = true
  try {
    const success = await authStore.login({
      email: email.value,
      password: password.value,
    })
    if (success) {
      router.push('/convert')
    } else {
      errorMsg.value = '登录失败，请检查您的凭证。'
    }
  } catch (e: any) {
    errorMsg.value = e.response?.data?.message || '登录遇到问题，请稍后重试。'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-64px)] bg-white flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- Header Section -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h1>
        <p class="text-gray-500">登录您的账户以继续使用 Read Flow</p>
      </div>

      <!-- Form Section -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">邮箱地址</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-colors"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label for="password" class="block text-sm font-medium text-gray-700">密码</label>
            <a href="#" class="text-sm text-blue-600 hover:text-blue-700">忘记密码？</a>
          </div>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-colors"
            placeholder="请输入密码"
          />
        </div>

        <div v-if="errorMsg" class="p-4 rounded-xl bg-red-50 text-red-600 text-sm">
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors focus:ring-4 focus:ring-blue-100 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <div
            v-if="isLoading"
            class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
          ></div>
          {{ isLoading ? '登录中...' : '登 录' }}
        </button>
      </form>

      <!-- Footer Section -->
      <p class="mt-8 text-center text-sm text-gray-500">
        还没有账户？
        <router-link to="/register" class="font-semibold text-blue-600 hover:text-blue-700">
          立即注册
        </router-link>
      </p>
    </div>
  </div>
</template>
