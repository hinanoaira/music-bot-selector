import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CollectionUtils } from '@/utils/collection.utils'
import type { ToastMessage } from '@/models/types/toast-types'

export const useToastStore = defineStore('toast', () => {
  const toastMessages = ref<ToastMessage[]>([])
  const timers = new Map<string, number>()

  const createToast = (type: ToastMessage['type'], message: string): ToastMessage => {
    return {
      id: crypto.randomUUID(),
      type,
      message,
      timestamp: Date.now(),
    }
  }

  const addToast = (type: ToastMessage['type'], message: string) => {
    const toast = createToast(type, message)
    toastMessages.value.push(toast)

    const timerId = window.setTimeout(() => {
      removeToast(toast.id)
    }, 5000)

    timers.set(toast.id, timerId)
  }

  const removeToast = (id: string) => {
    const toast = CollectionUtils.findFirst(toastMessages.value, (t) => t.id === id)
    if (toast) {
      const index = toastMessages.value.indexOf(toast)
      toastMessages.value.splice(index, 1)

      const timerId = timers.get(id)
      if (timerId) {
        clearTimeout(timerId)
        timers.delete(id)
      }
    }
  }

  const clearAllToasts = () => {
    timers.forEach((timerId) => clearTimeout(timerId))
    timers.clear()
    toastMessages.value.length = 0
  }

  const showSuccessToast = (message: string) => {
    addToast('success', message)
  }

  const showErrorToast = (message: string) => {
    addToast('error', message)
  }

  const showWarningToast = (message: string) => {
    addToast('warning', message)
  }

  const showInfoToast = (message: string) => {
    addToast('info', message)
  }

  /**
   * トーストタイプに応じたアイコンタイプを取得
   */
  const getIconType = (
    type: ToastMessage['type'],
  ): 'success' | 'error' | 'warning' | 'info' | 'music' | 'close' => {
    const iconMap: Record<
      ToastMessage['type'],
      'success' | 'error' | 'warning' | 'info' | 'music' | 'close'
    > = {
      success: 'success',
      error: 'error',
      warning: 'warning',
      info: 'info',
    }
    return iconMap[type]
  }

  /**
   * トーストメッセージのバリデーション
   */
  const validateToast = (toast: ToastMessage): boolean => {
    return !!(toast.id && toast.message && toast.type && typeof toast.timestamp === 'number')
  }

  return {
    toastMessages,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    getIconType,
    validateToast,
  }
})
