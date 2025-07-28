import { ref, computed } from 'vue'
import { QueueModel } from '@/models/QueueModel'
import { useToastStore } from '@/stores/toast.store'
import type { QueueItem, PlaybackStatus } from '@/models/types/music-types'

/**
 * キュー画面のViewModel
 * キューの表示制御、UI ロジックを担当
 */
export class QueueViewModel {
  private queueModel = new QueueModel()
  private toastStore = useToastStore()

  private _queueItems = ref<QueueItem[]>([])
  private _isQueueOpen = ref(false)
  private _isSkipping = ref(false)
  private _skipError = ref<string | null>(null)
  private _isConnected = ref(false)
  private _playbackStatus = ref<PlaybackStatus | null>(null)

  private queueUpdateHandler = (items: QueueItem[]) => {
    this._queueItems.value = items
  }

  private playbackStatusHandler = (status: PlaybackStatus) => {
    this._playbackStatus.value = status
  }

  constructor() {
    this.setupWebSocketHandlers()
  }

  /** キューアイテム一覧 */
  public readonly queueItems = computed(() => this._queueItems.value)

  /** キューパネルが開いているかどうか */
  public readonly isQueueOpen = computed(() => this._isQueueOpen.value)

  /** スキップ処理中かどうか */
  public readonly isSkipping = computed(() => this._isSkipping.value)

  /** スキップエラー */
  public readonly skipError = computed(() => this._skipError.value)

  /** WebSocket接続状態 */
  public readonly isConnected = computed(() => this._isConnected.value)

  /** 再生状態 */
  public readonly playbackStatus = computed(() => this._playbackStatus.value)

  /** 現在再生中のトラック */
  public readonly currentTrack = computed(() =>
    this.queueModel.getCurrentTrack(this._queueItems.value),
  )

  /** 現在のトラック数 */
  public readonly currentTrackCount = computed(() =>
    this.queueModel.getCurrentTrackCount(this._queueItems.value),
  )

  /** 待機中のトラック数 */
  public readonly pendingTrackCount = computed(() =>
    this.queueModel.getPendingTrackCount(this._queueItems.value),
  )

  /** キューが空かどうか */
  public readonly isEmpty = computed(() => this.queueModel.isQueueEmpty(this._queueItems.value))

  /** フォーマット済み現在時間 */
  public readonly formattedCurrentTime = computed(() => {
    if (!this._playbackStatus.value) return '0:00'
    return this.queueModel.formatTime(this._playbackStatus.value.currentTime)
  })

  /** フォーマット済み総時間 */
  public readonly formattedTotalTime = computed(() => {
    if (!this._playbackStatus.value) return '0:00'
    return this.queueModel.formatTime(this._playbackStatus.value.totalTime)
  })

  /** 再生進捗（パーセンテージ） */
  public readonly playbackProgress = computed(() => {
    if (!this._playbackStatus.value) return 0
    return this.queueModel.calculateProgress(
      this._playbackStatus.value.currentTime,
      this._playbackStatus.value.totalTime,
    )
  })

  /**
   * WebSocketイベントハンドラーの設定
   */
  private setupWebSocketHandlers(): void {
    this.queueModel.addQueueListener(this.queueUpdateHandler)
    this.queueModel.addPlaybackStatusListener(this.playbackStatusHandler)
  }

  /**
   * キューサーバーに接続
   */
  public async connect(guildId: string): Promise<void> {
    try {
      this.queueModel.connectWebSocket(guildId)
      this._isConnected.value = true
    } catch (error) {
      throw error
    }
  }

  /**
   * キューサーバーから切断
   */
  public disconnect(): void {
    this.queueModel.disconnectWebSocket()
    this.queueModel.removeQueueListener(this.queueUpdateHandler)
    this.queueModel.removePlaybackStatusListener(this.playbackStatusHandler)
    this._isConnected.value = false
  }

  /**
   * キューパネルの表示/非表示を切り替え
   */
  public toggleQueuePanel(): void {
    this._isQueueOpen.value = !this._isQueueOpen.value
  }

  /**
   * 現在の曲をスキップ
   */
  public async skipCurrentTrack(guildId: string): Promise<void> {
    if (this.isEmpty.value) {
      this.toastStore.showErrorToast('スキップできない状態です')
      return
    }

    try {
      this._isSkipping.value = true
      this._skipError.value = null

      await this.queueModel.skipTrack(guildId)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'スキップに失敗しました'
      this._skipError.value = errorMessage
      this.toastStore.showErrorToast(errorMessage)
      throw error
    } finally {
      this._isSkipping.value = false
    }
  }

  /**
   * アルバムカバー画像のURLを取得
   */
  public getQueueAlbumCoverUrl(albumArtist: string, album: string): string {
    return this.queueModel.getAlbumCoverUrl(albumArtist, album)
  }
}
