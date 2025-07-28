import type { ToastMessage } from '@/models/types/toast-types'

/**
 * トースト通知のModel
 * トーストメッセージの管理、タイマー処理を担当
 */
export class ToastModel {
  private timers = new Map<string, number>()

  /**
   * トーストメッセージを作成
   */
  createToast(type: ToastMessage['type'], message: string): ToastMessage {
    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      timestamp: Date.now(),
    }
  }

  /**
   * 自動削除タイマーを設定
   */
  setAutoRemoveTimer(toast: ToastMessage, onRemove: (id: string) => void): void {
    this.clearTimer(toast.id)

    const duration = this.getDisplayDuration(toast.type)

    const timer = window.setTimeout(() => {
      onRemove(toast.id)
      this.timers.delete(toast.id)
    }, duration)

    this.timers.set(toast.id, timer)
  }

  /**
   * タイマーをクリア
   */
  clearTimer(id: string): void {
    if (this.timers.has(id)) {
      window.clearTimeout(this.timers.get(id)!)
      this.timers.delete(id)
    }
  }

  /**
   * 全てのタイマーをクリア
   */
  clearAllTimers(): void {
    this.timers.forEach((timer) => window.clearTimeout(timer))
    this.timers.clear()
  }

  /**
   * アクティブなタイマー数を取得
   */
  getActiveTimerCount(): number {
    return this.timers.size
  }

  /**
   * トーストタイプに応じた表示時間を取得
   */
  getDisplayDuration(type: ToastMessage['type']): number {
    switch (type) {
      case 'error':
        return 5000
      case 'warning':
        return 4000
      case 'success':
        return 3000
      case 'info':
        return 3000
      default:
        return 3000
    }
  }

  /**
   * トーストタイプに応じたアイコンタイプを取得
   */
  getIconType(
    type: ToastMessage['type'],
  ): 'success' | 'error' | 'warning' | 'info' | 'music' | 'close' {
    switch (type) {
      case 'success':
        return 'success'
      case 'error':
        return 'error'
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
      default:
        return 'info'
    }
  }

  /**
   * 新しいトーストを検出
   */
  detectNewToasts(currentToasts: ToastMessage[], previousCount: number): ToastMessage[] {
    if (currentToasts.length > previousCount) {
      return currentToasts.slice(previousCount)
    }
    return []
  }

  /**
   * トーストメッセージのバリデーション
   */
  validateToast(toast: ToastMessage): boolean {
    return !!(toast.id && toast.type && toast.message && typeof toast.timestamp === 'number')
  }
}
