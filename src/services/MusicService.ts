import { MusicRepository } from '../repositories/MusicRepository'
import type {
  Artist,
  Album,
  Track,
  TrackRequestParams,
  YoutubeRequestParams,
} from '../models/types/music-types'

/**
 * 音楽ビジネスロジック層
 */
export class MusicService {
  private musicRepository: MusicRepository

  constructor() {
    this.musicRepository = new MusicRepository()
  }

  /**
   * アーティスト一覧を取得（Youtubeを先頭に配置）
   */
  async getArtists(): Promise<Artist[]> {
    try {
      const artists = await this.musicRepository.getArtists()
      if (Array.isArray(artists)) {
        const youtubeIndex = artists.findIndex((artist: Artist) => artist === 'Youtube')
        if (youtubeIndex > 0) {
          const [youtubeArtist] = artists.splice(youtubeIndex, 1)
          artists.unshift(youtubeArtist)
        }
      }
      return Array.isArray(artists) ? artists : []
    } catch (error) {
      console.error('MusicService.getArtists error:', error)
      return []
    }
  }

  /**
   * アルバム一覧を取得
   */
  async getAlbums(artist: Artist): Promise<Album[]> {
    try {
      const albums = await this.musicRepository.getAlbums(artist)
      return Array.isArray(albums) ? albums : []
    } catch (error) {
      console.error('MusicService.getAlbums error:', error)
      return []
    }
  }

  /**
   * トラック一覧を取得
   */
  async getTracks(artist: Artist, album: Album): Promise<Track[]> {
    try {
      const tracks = await this.musicRepository.getTracks(artist, album)
      return Array.isArray(tracks) ? tracks : []
    } catch (error) {
      console.error('MusicService.getTracks error:', error)
      return []
    }
  }

  /**
   * トラックリクエストのバリデーションと実行
   */
  async requestTrack(params: TrackRequestParams): Promise<boolean> {
    try {
      if (!params.artist || !params.album || !params.track || !params.guildId) {
        throw new Error('必要なパラメータが不足しています')
      }
      await this.musicRepository.requestTrack(params)
      return true
    } catch (error) {
      console.error('MusicService.requestTrack error:', error)
      throw error
    }
  }

  /**
   * YouTubeトラックリクエストのバリデーションと実行
   */
  async requestYoutubeTrack(params: YoutubeRequestParams): Promise<boolean> {
    try {
      if (!params.url || !params.guildId) {
        throw new Error('必要なパラメータが不足しています')
      }
      // URLの簡易バリデーション
      if (!this.isValidUrl(params.url)) {
        throw new Error('有効なURLを入力してください')
      }
      await this.musicRepository.requestYoutubeTrack(params)
      return true
    } catch (error) {
      console.error('MusicService.requestYoutubeTrack error:', error)
      throw error
    }
  }

  /**
   * スキップリクエストの実行
   */
  async skipTrack(guildId: string): Promise<boolean> {
    try {
      if (!guildId) {
        throw new Error('ギルドIDが必要です')
      }
      await this.musicRepository.skipTrack(guildId)
      return true
    } catch (error) {
      console.error('MusicService.skipTrack error:', error)
      throw error
    }
  }

  /**
   * アルバムカバーURLを取得
   */
  getAlbumCoverUrl(artist: Artist, album: Album): string {
    return this.musicRepository.getAlbumCoverUrl(artist, album)
  }

  /**
   * HTTP URLの簡易バリデーション
   */
  private isValidUrl(url: string): boolean {
    const urlRegex = /^https?:\/\/.+/
    return urlRegex.test(url)
  }
}
