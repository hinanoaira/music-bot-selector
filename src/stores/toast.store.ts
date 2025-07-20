import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastMessage[]>([])

  function showToast(message: string, type: ToastMessage['type'] = 'info', duration = 5000) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const toast: ToastMessage = {
      id,
      message,
      type,
      duration,
    }

    toasts.value.push(toast)

    // 自動削除
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }

  function removeToast(id: string) {
    const index = toasts.value.findIndex((toast) => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function showSuccess(message: string, duration?: number) {
    showToast(message, 'success', duration)
  }

  function showError(message: string, duration?: number) {
    showToast(message, 'error', duration)
  }

  function showWarning(message: string, duration?: number) {
    showToast(message, 'warning', duration)
  }

  function showInfo(message: string, duration?: number) {
    showToast(message, 'info', duration)
  }

  return {
    toasts,
    showToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
})
