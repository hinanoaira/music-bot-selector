// src/viewmodels/QueueViewModel.ts
import { ref, onUnmounted } from 'vue'
import { QueueService } from '@/models/services/QueueService'
import { MusicService } from '@/models/services/MusicService'
import type { QueueItem } from '@/models/musicTypes'

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

  // コールバック
  public onSkipSuccess: ((message: string) => void) | null = null
  public onSkipError: ((message: string) => void) | null = null

  constructor() {
    this.queueService = QueueService.getInstance()
    this.musicService = MusicService.getInstance()
    this.setupQueueListener()
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
   * 現在再生中のトラックを取得
   */
  get currentTrack(): QueueItem | null {
    return this.queueItems.value.find((item) => item.isCurrent) || null
  }

  /**
   * 待機中のトラック数を取得
   */
  get pendingTrackCount(): number {
    return this.queueItems.value.filter((item) => !item.isCurrent).length
  }

  /**
   * キューが空かどうか
   */
  get isEmpty(): boolean {
    return this.queueItems.value.length === 0
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
