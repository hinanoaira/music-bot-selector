// src/composables/useQueueViewModel.ts
import { onMounted, onUnmounted } from 'vue'
import { QueueViewModel } from '@/viewmodels/QueueViewModel'
import { useToastStore } from '@/stores/toast'
import { useGuildParam } from '@/composables/useGuildParam'

/**
 * キュー関連のComposable（ViewModelのラッパー）
 */
export function useQueueViewModel() {
  const { guildId } = useGuildParam()
  const { showSuccess, showError } = useToastStore()

  // ViewModelインスタンスを作成
  const queueViewModel = new QueueViewModel()

  // コールバック設定
  queueViewModel.onSkipSuccess = (message: string) => showSuccess(message)
  queueViewModel.onSkipError = (message: string) => showError(message)

  // スキップ処理
  const skipTrack = async () => {
    if (guildId.value) {
      await queueViewModel.skipCurrentTrack(guildId.value)
    }
  }

  // ライフサイクル
  onMounted(() => {
    if (guildId.value) {
      queueViewModel.connect(guildId.value)
    }
  })

  onUnmounted(() => {
    queueViewModel.disconnect()
  })

  return {
    // 状態
    queueItems: queueViewModel.queueItems,
    isOpen: queueViewModel.isOpen,
    isSkipping: queueViewModel.isSkipping,
    currentTrackCount: queueViewModel.currentTrackCount,
    isConnected: queueViewModel.isConnected,

    // 計算プロパティ
    currentTrack: queueViewModel.currentTrack,
    pendingTrackCount: queueViewModel.pendingTrackCount,
    isEmpty: queueViewModel.isEmpty,

    // メソッド
    togglePanel: queueViewModel.togglePanel.bind(queueViewModel),
    skipTrack,
    getAlbumCoverUrl: queueViewModel.getAlbumCoverUrl.bind(queueViewModel),
  }
}
