// src/models/types/music-types.ts
export type Artist = string
export type Album = string
export type Track = string

// キューアイテムの型定義
export interface QueueItem {
  index: number
  artist: string
  album: string
  title: string
  albumArtist: string
  isCurrent: boolean
  duration?: number // 再生時間（秒）
}

// 再生状態の型定義
export interface PlaybackStatus {
  guildId: string
  isPlaying: boolean
  currentTime: number
  totalTime: number
}

// WebSocketメッセージの型定義
export interface WebSocketMessage {
  type: 'queue' | 'ping' | 'pong' | 'playbackUpdate'
  data?: QueueItem[]
  playbackStatus?: PlaybackStatus
}

// APIレスポンスの型定義
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// リクエストパラメータの型定義
export interface TrackRequestParams {
  artist: Artist
  album: Album
  track: Track
  guildId: string
}

export interface YoutubeRequestParams {
  url: string
  guildId: string
}
