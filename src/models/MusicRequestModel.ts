import { MusicService } from '@/services/MusicService'
import type {
  Artist,
  Album,
  Track,
  TrackRequestParams,
  YoutubeRequestParams,
} from './types/musicTypes'

/**
 * 音楽リクエストのビジネスロジックを担当するModel
 * MusicRequestViewModelに対応
 */
export class MusicRequestModel {
  private static instance: MusicRequestModel
  private musicService: MusicService

  private constructor() {
    this.musicService = MusicService.getInstance()
  }

  static getInstance(): MusicRequestModel {
    if (!MusicRequestModel.instance) {
      MusicRequestModel.instance = new MusicRequestModel()
    }
    return MusicRequestModel.instance
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
   * キューが空かどうかの判定ロジック
   */
  isQueueEmpty(queueLength: number): boolean {
    return queueLength === 0
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
   * 通常のトラックリクエストを実行
   */
  async requestTrack(params: TrackRequestParams): Promise<boolean> {
    return await this.musicService.requestTrack(params)
  }

  /**
   * YouTubeトラックリクエストを実行
   */
  async requestYoutubeTrack(params: YoutubeRequestParams): Promise<boolean> {
    return await this.musicService.requestYoutubeTrack(params)
  }

  /**
   * アルバムカバーURLを取得
   */
  getAlbumCoverUrl(artist: Artist, album: Album): string {
    return this.musicService.getAlbumCoverUrl(artist, album)
  }

  /**
   * アーティスト選択時の業務ロジック
   * （例：選択状態のリセット、関連データの取得など）
   */
  async selectArtist(artist: Artist): Promise<Album[]> {
    return await this.getAlbums(artist)
  }

  /**
   * アルバム選択時の業務ロジック
   */
  async selectAlbum(artist: Artist, album: Album): Promise<Track[]> {
    return await this.getTracks(artist, album)
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
}
