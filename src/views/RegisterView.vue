<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UserPlus } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const username = ref('')
const password = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  errorMsg.value = ''
  isLoading.value = true
  try {
    const success = await authStore.register({
      email: email.value,
      password: password.value,
      username: username.value,
    })
    if (success) {
      router.push('/')
    } else {
      errorMsg.value = '注册失败，请稍后重试。'
    }
  } catch (e: any) {
    errorMsg.value = e.response?.data?.message || '注册遇到问题，请稍后重试。'
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
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-6">
          <UserPlus class="w-8 h-8 text-blue-600" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">创建账户</h1>
        <p class="text-gray-500">加入 Read Flow，开启您的语音体验</p>
      </div>

      <!-- Form Section -->
      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">用户名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-colors"
            placeholder="您的昵称"
          />
        </div>

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
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2"
            >设置密码</label
          >
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="8"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-colors"
            placeholder="至少 8 位字符"
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
          {{ isLoading ? '注册中...' : '立即注册' }}
        </button>
      </form>

      <!-- Footer Section -->
      <p class="mt-8 text-center text-sm text-gray-500">
        已有账户？
        <router-link to="/login" class="font-semibold text-blue-600 hover:text-blue-700">
          直接登录
        </router-link>
      </p>
    </div>
  </div>
</template>
