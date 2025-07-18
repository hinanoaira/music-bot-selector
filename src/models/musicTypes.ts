// src/models/musicTypes.ts
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
}

// WebSocketメッセージの型定義
export interface WebSocketMessage {
  type: 'queue' | 'ping' | 'pong'
  data?: QueueItem[]
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
