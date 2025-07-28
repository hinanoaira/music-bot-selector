import { MusicService } from '@/services/MusicService'
import type { Artist, Album, Track } from './types/music-types'

/**
 * 音楽リクエストのビジネスロジックを担当するModel
 * MusicRequestView専用の状態管理とビジネスロジック
 */
export class MusicRequestModel {
  private musicService: MusicService

  constructor() {
    this.musicService = new MusicService()
  }

  /**
   * アーティスト選択時の状態管理ロジック
   * 選択したアーティストに応じてアルバム・トラック選択をリセットする必要があるかを判定
   */
  shouldResetAlbumSelection(currentArtist: Artist | null, newArtist: Artist): boolean {
    return currentArtist !== newArtist
  }

  /**
   * アルバム選択時の状態管理ロジック
   * 選択したアルバムに応じてトラック選択をリセットする必要があるかを判定
   */
  shouldResetTrackSelection(currentAlbum: Album | null, newAlbum: Album): boolean {
    return currentAlbum !== newAlbum
  }

  /**
   * 選択状態のバリデーション
   */
  validateTrackRequest(
    artist: Artist | null,
    album: Album | null,
    track: Track | null,
    guildId: string,
  ): boolean {
    return !!(artist && album && track && guildId)
  }

  /**
   * YouTubeリクエストのバリデーション
   */
  validateYoutubeRequest(url: string, guildId: string): boolean {
    const urlRegex = /^https?:\/\/.+/
    return !!(url && guildId && urlRegex.test(url))
  }

  /**
   * アーティスト名の正規化
   */
  normalizeArtistName(artist: Artist): string {
    return artist.trim().toLowerCase()
  }

  /**
   * リクエスト可能かどうかの総合判定
   */
  canMakeRequest(
    artist: Artist | null,
    album: Album | null,
    track: Track | null,
    guildId: string,
    isRequesting: boolean,
  ): boolean {
    return this.validateTrackRequest(artist, album, track, guildId) && !isRequesting
  }

  /**
   * YouTube URL かどうかの判定
   */
  isYoutubeUrl(url: string): boolean {
    const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/
    return youtubeRegex.test(url)
  }

  /**
   * アーティスト一覧を取得
   */
  async getArtists(): Promise<Artist[]> {
    return await this.musicService.getArtists()
  }

  /**
   * アルバム一覧を取得
   */
  async getAlbums(artist: Artist): Promise<Album[]> {
    return await this.musicService.getAlbums(artist)
  }

  /**
   * トラック一覧を取得
   */
  async getTracks(artist: Artist, album: Album): Promise<Track[]> {
    return await this.musicService.getTracks(artist, album)
  }

  /**
   * トラックリクエストを実行
   */
  async requestTrack(params: {
    artist: Artist
    album: Album
    track: Track
    guildId: string
  }): Promise<boolean> {
    if (!this.validateTrackRequest(params.artist, params.album, params.track, params.guildId)) {
      throw new Error('トラックリクエストのバリデーションに失敗しました')
    }
    return await this.musicService.requestTrack(params)
  }

  /**
   * YouTubeリクエストを実行
   */
  async requestYoutubeTrack(params: { url: string; guildId: string }): Promise<boolean> {
    if (!this.validateYoutubeRequest(params.url, params.guildId)) {
      throw new Error('YouTube URLのバリデーションに失敗しました')
    }
    return await this.musicService.requestYoutubeTrack(params)
  }

  /**
   * アルバムカバーURLを取得
   */
  getAlbumCoverUrl(artist: Artist, album: Album): string {
    return this.musicService.getAlbumCoverUrl(artist, album)
  }
}
