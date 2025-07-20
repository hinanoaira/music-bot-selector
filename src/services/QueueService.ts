import { API_CONFIG } from '@/config/api'
import type { QueueItem, WebSocketMessage, PlaybackStatus } from '../models/types/musicTypes'

/**
 * キューサービス - WebSocket通信とキュー管理
 */
export class QueueService {
  private static instance: QueueService
  private ws: WebSocket | null = null
  private pingInterval: number | null = null
  private listeners: Set<(queue: QueueItem[]) => void> = new Set()
  private playbackStatusListeners: Set<(status: PlaybackStatus) => void> = new Set()

  static getInstance(): QueueService {
    if (!QueueService.instance) {
      QueueService.instance = new QueueService()
    }
    return QueueService.instance
  }

  /**
   * WebSocket接続を開始
   */
  connect(guildId: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    const wsUrl = `${API_CONFIG.WS_URL}?guildid=${encodeURIComponent(guildId)}`
    this.ws = new WebSocket(wsUrl)

    this.ws.onopen = () => {
      console.log('QueueService: WebSocket connected')
      this.startPing()
    }

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        if (message.type === 'queue' && message.data) {
          this.notifyListeners(message.data)
        }
        if (
          (message.type === 'playbackUpdate' || message.type === 'queue') &&
          message.playbackStatus
        ) {
          this.notifyPlaybackStatusListeners(message.playbackStatus)
        }
      } catch (err) {
        console.error('QueueService: WebSocket message parse error:', err)
      }
    }

    this.ws.onerror = (err) => {
      console.error('QueueService: WebSocket error:', err)
    }

    this.ws.onclose = () => {
      console.log('QueueService: WebSocket disconnected')
      this.stopPing()
      // 5秒後に再接続を試行
      setTimeout(() => this.connect(guildId), 5000)
    }
  }

  /**
   * WebSocket接続を切断
   */
  disconnect(): void {
    this.stopPing()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  /**
   * キューの変更を監視するリスナーを追加
   */
  addQueueListener(listener: (queue: QueueItem[]) => void): void {
    this.listeners.add(listener)
  }

  /**
   * キューの変更監視リスナーを削除
   */
  removeQueueListener(listener: (queue: QueueItem[]) => void): void {
    this.listeners.delete(listener)
  }

  /**
   * 再生状態の変更を監視するリスナーを追加
   */
  addPlaybackStatusListener(listener: (status: PlaybackStatus) => void): void {
    this.playbackStatusListeners.add(listener)
  }

  /**
   * 再生状態の変更監視リスナーを削除
   */
  removePlaybackStatusListener(listener: (status: PlaybackStatus) => void): void {
    this.playbackStatusListeners.delete(listener)
  }

  /**
   * ping送信を開始
   */
  private startPing(): void {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, 30000) // 30秒ごとにping送信
  }

  /**
   * ping送信を停止
   */
  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  /**
   * 登録されたリスナーに通知
   */
  private notifyListeners(queue: QueueItem[]): void {
    this.listeners.forEach((listener) => listener(queue))
  }

  /**
   * 再生状態リスナーに通知
   */
  private notifyPlaybackStatusListeners(status: PlaybackStatus): void {
    this.playbackStatusListeners.forEach((listener) => listener(status))
  }
}
