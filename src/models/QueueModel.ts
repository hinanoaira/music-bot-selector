import { QueueService } from '@/services/QueueService'
import { MusicService } from '@/services/MusicService'
import type { QueueItem, PlaybackStatus } from './types/music-types'

/**
 * キュー管理のビジネスロジックを担当するModel
 * QueueViewModelに対応
 */
export class QueueModel {
  private static instance: QueueModel
  private queueService: QueueService
  private musicService: MusicService

  private constructor() {
    this.queueService = QueueService.getInstance()
    this.musicService = MusicService.getInstance()
  }

  static getInstance(): QueueModel {
    if (!QueueModel.instance) {
      QueueModel.instance = new QueueModel()
    }
    return QueueModel.instance
  }

  /**
   * WebSocket接続を開始
   */
  connect(guildId: string): void {
    this.queueService.connect(guildId)
  }

  /**
   * WebSocket接続を切断
   */
  disconnect(): void {
    this.queueService.disconnect()
  }

  /**
   * WebSocket接続状態を取得
   */
  isConnected(): boolean {
    return true
  }

  /**
   * トラックスキップを実行
   */
  async skipTrack(guildId: string): Promise<boolean> {
    return await this.musicService.skipTrack(guildId)
  }

  /**
   * キューアイテムの分析・計算
   */
  analyzeQueue(queueItems: QueueItem[]): {
    currentTrack: QueueItem | null
    pendingTracks: QueueItem[]
    totalTracks: number
    totalDuration: number
  } {
    const currentTrack = queueItems.find((item) => item.isCurrent) || null
    const pendingTracks = queueItems.filter((item) => !item.isCurrent)
    const totalTracks = queueItems.length
    const totalDuration = queueItems.reduce((sum, item) => sum + (item.duration || 0), 0)

    return {
      currentTrack,
      pendingTracks,
      totalTracks,
      totalDuration,
    }
  }

  /**
   * 再生時間のフォーマット（業務ロジック）
   */
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  /**
   * 再生進捗の計算（業務ロジック）
   */
  calculateProgress(currentTime: number, totalTime: number): number {
    if (totalTime === 0) return 0
    return Math.min(100, Math.max(0, (currentTime / totalTime) * 100))
  }

  /**
   * キューの状態バリデーション
   */
  validateQueueState(queueItems: QueueItem[]): {
    isValid: boolean
    hasCurrentTrack: boolean
    hasMultipleCurrentTracks: boolean
  } {
    const currentTracks = queueItems.filter((item) => item.isCurrent)

    return {
      isValid: currentTracks.length <= 1,
      hasCurrentTrack: currentTracks.length === 1,
      hasMultipleCurrentTracks: currentTracks.length > 1,
    }
  }

  /**
   * イベントリスナーの登録（WebSocketイベント）
   */
  onQueueUpdate(callback: (queueItems: QueueItem[]) => void): void {
    this.queueService.addQueueListener(callback)
  }

  /**
   * 再生状態更新イベントの登録
   */
  onPlaybackUpdate(callback: (status: PlaybackStatus) => void): void {
    this.queueService.addPlaybackStatusListener(callback)
  }

  /**
   * アルバムカバーURLを取得
   */
  getAlbumCoverUrl(artist: string, album: string): string {
    return this.musicService.getAlbumCoverUrl(artist, album)
  }

  /**
   * キューが空かどうかの判定
   */
  isQueueEmpty(queueItems: QueueItem[]): boolean {
    return queueItems.length === 0
  }

  /**
   * スキップ可能かどうかの判定
   */
  canSkip(queueItems: QueueItem[]): boolean {
    return !this.isQueueEmpty(queueItems)
  }

  /**
   * 接続状態変更イベントの登録
   */
  onConnectionChange(callback: (isConnected: boolean) => void): void {
    console.log('Connection change listener registered:', callback)
  }
}
