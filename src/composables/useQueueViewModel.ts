// src/composables/useQueueViewModel.ts
import { onMounted, onUnmounted, computed } from 'vue'
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

  // 時間をフォーマット（秒 -> mm:ss）
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // 計算プロパティ
  const currentTrack = computed(() => {
    return queueViewModel.queueItems.value.find((item) => item.isCurrent) || null
  })

  const pendingTrackCount = computed(() => {
    return queueViewModel.queueItems.value.filter((item) => !item.isCurrent).length
  })

  const isEmpty = computed(() => {
    return queueViewModel.queueItems.value.length === 0
  })

  const formattedCurrentTime = computed(() => {
    if (!queueViewModel.playbackStatus.value) return '0:00'
    return formatTime(queueViewModel.playbackStatus.value.currentTime)
  })

  const formattedTotalTime = computed(() => {
    if (!queueViewModel.playbackStatus.value) return '0:00'
    return formatTime(queueViewModel.playbackStatus.value.totalTime)
  })

  const playbackProgress = computed(() => {
    if (!queueViewModel.playbackStatus.value || queueViewModel.playbackStatus.value.totalTime === 0)
      return 0
    return (
      (queueViewModel.playbackStatus.value.currentTime /
        queueViewModel.playbackStatus.value.totalTime) *
      100
    )
  })

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
    playbackStatus: queueViewModel.playbackStatus,

    // 計算プロパティ
    currentTrack,
    pendingTrackCount,
    isEmpty,
    formattedCurrentTime,
    formattedTotalTime,
    playbackProgress,

    // メソッド
    togglePanel: queueViewModel.togglePanel.bind(queueViewModel),
    skipTrack,
    getAlbumCoverUrl: queueViewModel.getAlbumCoverUrl.bind(queueViewModel),
  }
}
