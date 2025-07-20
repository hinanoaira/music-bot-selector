import { ref, computed } from 'vue'
import { QueueModel } from '@/models/QueueModel'
import type { QueueItem, PlaybackStatus } from '@/models/types/musicTypes'

/**
 * キュー管理のViewModel
 */
export class QueueViewModel {
  private queueModel: QueueModel

  public readonly queueItems = ref<QueueItem[]>([])
  public readonly isOpen = ref(false)
  public readonly isSkipping = ref(false)
  public readonly skipError = ref<string | null>(null)
  public readonly currentTrackCount = ref(0)
  public readonly isConnected = ref(false)
  public readonly playbackStatus = ref<PlaybackStatus | null>(null)

  private eventListeners: {
    skipSuccess: Array<(message: string) => void>
    skipError: Array<(message: string) => void>
  } = {
    skipSuccess: [],
    skipError: [],
  }

  public readonly currentTrack = computed(
    () => this.queueItems.value.find((item) => item.isCurrent) || null,
  )

  public readonly pendingTrackCount = computed(
    () => this.queueItems.value.filter((item) => !item.isCurrent).length,
  )

  public readonly isEmpty = computed(() => this.queueItems.value.length === 0)

  public readonly formattedCurrentTime = computed(() => {
    if (!this.playbackStatus.value) return '0:00'
    return this.queueModel.formatTime(this.playbackStatus.value.currentTime)
  })

  public readonly formattedTotalTime = computed(() => {
    if (!this.playbackStatus.value) return '0:00'
    return this.queueModel.formatTime(this.playbackStatus.value.totalTime)
  })

  public readonly playbackProgress = computed(() => {
    if (!this.playbackStatus.value || this.playbackStatus.value.totalTime === 0) return 0
    return (this.playbackStatus.value.currentTime / this.playbackStatus.value.totalTime) * 100
  })

  public onSkipSuccess: ((message: string) => void) | null = null
  public onSkipError: ((message: string) => void) | null = null

  constructor() {
    this.queueModel = QueueModel.getInstance()
    this.setupQueueListener()
    this.setupPlaybackStatusListener()
  }

  /**
   * イベントリスナーを追加
   */
  addEventListener<T extends keyof typeof this.eventListeners>(
    event: T,
    listener: (typeof this.eventListeners)[T][0],
  ): void {
    this.eventListeners[event].push(listener as never)
  }

  /**
   * イベントリスナーを削除
   */
  removeEventListener<T extends keyof typeof this.eventListeners>(
    event: T,
    listener: (typeof this.eventListeners)[T][0],
  ): void {
    const index = this.eventListeners[event].indexOf(listener as never)
    if (index > -1) {
      this.eventListeners[event].splice(index, 1)
    }
  }

  /**
   * イベントを発火
   */
  private emit<T extends keyof typeof this.eventListeners>(
    event: T,
    ...args: Parameters<(typeof this.eventListeners)[T][0]>
  ): void {
    this.eventListeners[event].forEach((listener) => {
      ;(listener as (...args: unknown[]) => void)(...args)
    })
  }

  /**
   * WebSocket接続を開始
   */
  connect(guildId: string): void {
    this.queueModel.connect(guildId)
    this.isConnected.value = true
  }

  /**
   * WebSocket接続を切断
   */
  disconnect(): void {
    this.queueModel.disconnect()
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
    if (!this.queueModel.canSkip(this.queueItems.value)) {
      this.handleSkipError('スキップできるトラックがありません')
      return
    }

    this.isSkipping.value = true
    this.skipError.value = null

    try {
      await this.queueModel.skipTrack(guildId)
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
    return this.queueModel.getAlbumCoverUrl(albumArtist, album)
  }

  /**
   * キューリスナーをセットアップ
   */
  private setupQueueListener(): void {
    const listener = (queue: QueueItem[]) => {
      this.queueItems.value = queue
      this.currentTrackCount.value = queue.filter((item) => !item.isCurrent).length
    }

    this.queueModel.onQueueUpdate(listener)
  }

  /**
   * 再生状態リスナーをセットアップ
   */
  private setupPlaybackStatusListener(): void {
    const listener = (status: PlaybackStatus) => {
      this.playbackStatus.value = status
    }

    this.queueModel.onPlaybackUpdate(listener)
  }

  /**
   * スキップ成功時の処理
   */
  private handleSkipSuccess(message: string): void {
    this.emit('skipSuccess', message)
  }

  /**
   * スキップエラー時の処理
   */
  private handleSkipError(message: string): void {
    this.skipError.value = message
    this.emit('skipError', message)
  }
}
