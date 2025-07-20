import { API_CONFIG } from '@/config/api'
import type {
  Artist,
  Album,
  Track,
  TrackRequestParams,
  YoutubeRequestParams,
} from '../models/types/musicTypes'

/**
 * 音楽データアクセス層
 */
export class MusicRepository {
  private static instance: MusicRepository

  static getInstance(): MusicRepository {
    if (!MusicRepository.instance) {
      MusicRepository.instance = new MusicRepository()
    }
    return MusicRepository.instance
  }

  async getArtists(): Promise<Artist[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ARTIST}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch artists: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('MusicRepository.getArtists error:', error)
      throw error
    }
  }

  async getAlbums(artist: Artist): Promise<Album[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALBUM(artist)}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch albums: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('MusicRepository.getAlbums error:', error)
      throw error
    }
  }

  async getTracks(artist: Artist, album: Album): Promise<Track[]> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRACK(artist, album)}`,
      )
      if (!response.ok) {
        throw new Error(`Failed to fetch tracks: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('MusicRepository.getTracks error:', error)
      throw error
    }
  }

  async requestTrack(params: TrackRequestParams): Promise<unknown> {
    try {
      const { artist, album, track, guildId } = params
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REQUEST_PLAY(artist, album, track)}`,
        {
          method: 'GET',
          headers: { guildid: guildId },
        },
      )
      if (!response.ok) {
        throw new Error(`Failed to request track: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('MusicRepository.requestTrack error:', error)
      throw error
    }
  }

  async requestYoutubeTrack(params: YoutubeRequestParams): Promise<unknown> {
    try {
      const { url, guildId } = params
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.YOUTUBE_PLAY(url)}`,
        {
          method: 'GET',
          headers: { guildid: guildId },
        },
      )
      if (!response.ok) {
        throw new Error(`Failed to request YouTube track: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('MusicRepository.requestYoutubeTrack error:', error)
      throw error
    }
  }

  async skipTrack(guildId: string): Promise<unknown> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SKIP}`, {
        method: 'GET',
        headers: { guildid: guildId },
      })
      if (!response.ok) {
        throw new Error(`Skip request failed: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('MusicRepository.skipTrack error:', error)
      throw error
    }
  }

  getAlbumCoverUrl(artist: Artist, album: Album): string {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.COVER(artist, album)}`
  }
}
