import { QueueService } from '@/services/QueueService'
import { MusicService } from '@/services/MusicService'
import type { QueueItem, PlaybackStatus } from './types/music-types'

/**
 * キュー管理のビジネスロジックを担当するModel
 * 純粋なビジネスロジックのみを担当
 */
export class QueueModel {
  private queueService: QueueService
  private musicService: MusicService

  constructor() {
    this.queueService = new QueueService()
    this.musicService = new MusicService()
  }

  /**
   * WebSocket接続を開始
   */
  connectWebSocket(guildId: string): void {
    this.queueService.connect(guildId)
  }

  /**
   * WebSocket接続を切断
   */
  disconnectWebSocket(): void {
    this.queueService.disconnect()
  }

  /**
   * キューリスナーを追加
   */
  addQueueListener(handler: (items: QueueItem[]) => void): void {
    this.queueService.addQueueListener(handler)
  }

  /**
   * キューリスナーを削除
   */
  removeQueueListener(handler: (items: QueueItem[]) => void): void {
    this.queueService.removeQueueListener(handler)
  }

  /**
   * 再生状態リスナーを追加
   */
  addPlaybackStatusListener(handler: (status: PlaybackStatus) => void): void {
    this.queueService.addPlaybackStatusListener(handler)
  }

  /**
   * 再生状態リスナーを削除
   */
  removePlaybackStatusListener(handler: (status: PlaybackStatus) => void): void {
    this.queueService.removePlaybackStatusListener(handler)
  }

  /**
   * 現在の曲をスキップ
   */
  async skipTrack(guildId: string): Promise<boolean> {
    return await this.musicService.skipTrack(guildId)
  }

  /**
   * キューが空かどうかを判定
   */
  isQueueEmpty(queueItems: QueueItem[]): boolean {
    return queueItems.length === 0
  }

  /**
   * 現在のトラックを取得
   */
  getCurrentTrack(queueItems: QueueItem[]): QueueItem | null {
    return queueItems.find((item) => item.isCurrent) || null
  }

  /**
   * 現在のトラック数を計算
   */
  getCurrentTrackCount(queueItems: QueueItem[]): number {
    return queueItems.filter((item) => item.isCurrent).length
  }

  /**
   * 待機中のトラック数を計算
   */
  getPendingTrackCount(queueItems: QueueItem[]): number {
    return queueItems.filter((item) => !item.isCurrent).length
  }

  /**
   * アルバムカバーURLを取得
   */
  getAlbumCoverUrl(artist: string, album: string): string {
    return this.musicService.getAlbumCoverUrl(artist, album)
  }

  /**
   * 再生時間のフォーマット
   */
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  /**
   * 再生進捗の計算
   */
  calculateProgress(currentTime: number, totalTime: number): number {
    if (totalTime === 0) return 0
    return Math.min((currentTime / totalTime) * 100, 100)
  }
}
