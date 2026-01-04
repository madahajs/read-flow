<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getHistory, deleteHistory, type HistoryItem } from '@/services/historyService'
import { Clock, Trash2, FileText, Music, Calendar, Download } from 'lucide-vue-next'

const historyList = ref<HistoryItem[]>([])
const loading = ref(false)
const error = ref('')

const fetchHistory = async () => {
  loading.value = true
  try {
    const result = await getHistory()
    historyList.value = result.list
  } catch (e) {
    error.value = '无法加载历史记录'
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: string) => {
  if (!confirm('确定要删除这条记录吗？')) return
  try {
    const success = await deleteHistory(id)
    if (success) {
      historyList.value = historyList.value.filter((item) => item.id !== id)
    }
  } catch (e) {
    alert('删除失败')
  }
}

onMounted(() => {
  fetchHistory()
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const handleDownload = (item: HistoryItem) => {
  if (item.audioUrl) {
    const a = document.createElement('a')
    a.href = item.audioUrl
    a.download = `${item.title || 'audio'}.mp3`
    a.click()
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-64px)] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Clock class="w-6 h-6 text-blue-600" />
          转换历史
        </h1>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-500">加载中...</p>
      </div>

      <div v-else-if="error" class="text-center py-12 text-red-600 bg-white rounded-xl shadow-sm">
        {{ error }}
      </div>

      <div
        v-else-if="historyList.length === 0"
        class="text-center py-16 bg-white rounded-xl shadow-sm"
      >
        <div
          class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <FileText class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-medium text-gray-900">暂无记录</h3>
        <p class="text-gray-500 mt-1">您还没有进行过任何转换操作</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="item in historyList"
          :key="item.id"
          class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex items-center justify-between"
        >
          <div class="flex items-start gap-4">
            <div
              class="p-3 rounded-lg"
              :class="
                item.type === 'upload' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
              "
            >
              <FileText v-if="item.type === 'upload'" class="w-6 h-6" />
              <Music v-else class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-medium text-gray-900">{{ item.title }}</h3>
              <div class="flex items-center gap-4 mt-1 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <Calendar class="w-3.5 h-3.5" />
                  {{ formatDate(item.createdAt) }}
                </span>
                <span v-if="item.audioDuration" class="flex items-center gap-1">
                  <Clock class="w-3.5 h-3.5" />
                  {{ item.audioDuration }}s
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="item.audioUrl"
              @click="handleDownload(item)"
              class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="下载音频"
            >
              <Download class="w-5 h-5" />
            </button>
            <button
              @click="handleDelete(item.id)"
              class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="删除"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
