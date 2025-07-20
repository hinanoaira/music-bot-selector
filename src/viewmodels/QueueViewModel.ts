// src/viewmodels/QueueViewModel.ts
import { ref, computed, onUnmounted } from 'vue'
import { QueueService } from '@/models/services/QueueService'
import { MusicService } from '@/models/services/MusicService'
import type { QueueItem, PlaybackStatus } from '@/models/musicTypes'

/**
 * キュー管理のViewModel
 */
export class QueueViewModel {
  private queueService: QueueService
  private musicService: MusicService

  // 状態
  public readonly queueItems = ref<QueueItem[]>([])
  public readonly isOpen = ref(false)
  public readonly isSkipping = ref(false)
  public readonly skipError = ref<string | null>(null)
  public readonly currentTrackCount = ref(0)
  public readonly isConnected = ref(false)
  public readonly playbackStatus = ref<PlaybackStatus | null>(null)

  // 計算プロパティ
  public readonly currentTrack = computed(
    () => this.queueItems.value.find((item) => item.isCurrent) || null,
  )

  public readonly pendingTrackCount = computed(
    () => this.queueItems.value.filter((item) => !item.isCurrent).length,
  )

  public readonly isEmpty = computed(() => this.queueItems.value.length === 0)

  public readonly formattedCurrentTime = computed(() => {
    if (!this.playbackStatus.value) return '0:00'
    return this.formatTime(this.playbackStatus.value.currentTime)
  })

  public readonly formattedTotalTime = computed(() => {
    if (!this.playbackStatus.value) return '0:00'
    return this.formatTime(this.playbackStatus.value.totalTime)
  })

  public readonly playbackProgress = computed(() => {
    if (!this.playbackStatus.value || this.playbackStatus.value.totalTime === 0) return 0
    return (this.playbackStatus.value.currentTime / this.playbackStatus.value.totalTime) * 100
  })

  // コールバック
  public onSkipSuccess: ((message: string) => void) | null = null
  public onSkipError: ((message: string) => void) | null = null

  constructor() {
    this.queueService = QueueService.getInstance()
    this.musicService = MusicService.getInstance()
    this.setupQueueListener()
    this.setupPlaybackStatusListener()
  }

  /**
   * 時間をフォーマット（秒 -> mm:ss）
   */
  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  /**
   * WebSocket接続を開始
   */
  connect(guildId: string): void {
    this.queueService.connect(guildId)
    this.isConnected.value = true
  }

  /**
   * WebSocket接続を切断
   */
  disconnect(): void {
    this.queueService.disconnect()
    this.isConnected.value = false
  }

  /**
   * パネルの開閉を切り替え
   */
  togglePanel(): void {
    this.isOpen.value = !this.isOpen.value
  }

  /**
   * 現在のトラックをスキップ
   */
  async skipCurrentTrack(guildId: string): Promise<void> {
    if (this.queueItems.value.length === 0) {
      this.handleSkipError('スキップできるトラックがありません')
      return
    }

    this.isSkipping.value = true
    this.skipError.value = null

    try {
      await this.musicService.skipTrack(guildId)
      this.handleSkipSuccess('トラックをスキップしました')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'スキップに失敗しました'
      this.handleSkipError(message)
    } finally {
      this.isSkipping.value = false
    }
  }

  /**
   * アルバムカバーURLを取得
   */
  getAlbumCoverUrl(albumArtist: string, album: string): string {
    return this.musicService.getAlbumCoverUrl(albumArtist, album)
  }

  /**
   * キューリスナーをセットアップ
   */
  private setupQueueListener(): void {
    const listener = (queue: QueueItem[]) => {
      this.queueItems.value = queue
      this.currentTrackCount.value = queue.filter((item) => !item.isCurrent).length
    }

    this.queueService.addQueueListener(listener)

    // クリーンアップ用にリスナーを保存
    onUnmounted(() => {
      this.queueService.removeQueueListener(listener)
    })
  }

  /**
   * 再生状態リスナーをセットアップ
   */
  private setupPlaybackStatusListener(): void {
    const listener = (status: PlaybackStatus) => {
      this.playbackStatus.value = status
    }

    this.queueService.addPlaybackStatusListener(listener)

    // クリーンアップ用にリスナーを保存
    onUnmounted(() => {
      this.queueService.removePlaybackStatusListener(listener)
    })
  }

  /**
   * スキップ成功時の処理
   */
  private handleSkipSuccess(message: string): void {
    if (this.onSkipSuccess) {
      this.onSkipSuccess(message)
    }
  }

  /**
   * スキップエラー時の処理
   */
  private handleSkipError(message: string): void {
    this.skipError.value = message
    if (this.onSkipError) {
      this.onSkipError(message)
    }
  }
}
