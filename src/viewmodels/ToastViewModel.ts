import { computed } from 'vue'
import { useToastStore } from '@/stores/toast.store'
import { ToastModel } from '@/models/ToastModel'
import type { ToastMessage } from '@/models/types/toast-types'

/**
 * トースト表示のViewModel
 * トーストの表示制御、UI ロジックを担当
 */
export class ToastViewModel {
  private toastStore = useToastStore()
  private toastModel = new ToastModel()

  /** トーストメッセージ一覧 */
  public readonly toastMessages = computed(() => this.toastStore.toastMessages)

  /** トーストが存在するかどうか */
  public readonly hasToasts = computed(() => this.toastMessages.value.length > 0)

  /** トーストの数 */
  public readonly toastCount = computed(() => this.toastMessages.value.length)

  /**
   * トーストを削除
   * @param id - 削除するトーストのID
   */
  removeToast(id: string): void {
    this.toastStore.removeToast(id)
  }

  /**
   * 全てのトーストをクリア
   */
  clearAllToasts(): void {
    this.toastStore.clearAllToasts()
  }

  /**
   * トーストタイプに応じたアイコンタイプを取得
   * @param type - トーストメッセージのタイプ
   * @returns 対応するアイコンタイプ
   */
  getIconType(
    type: ToastMessage['type'],
  ): 'success' | 'error' | 'warning' | 'info' | 'music' | 'close' {
    return this.toastModel.getIconType(type)
  }

  /**
   * トーストメッセージのバリデーション
   * @param toast - バリデーション対象のトーストメッセージ
   * @returns バリデーション結果
   */
  isValidToast(toast: ToastMessage): boolean {
    return this.toastModel.validateToast(toast)
  }
}
