// src/services/MusicService.ts
import type { Artist, Album, Track } from '@/models/musicTypes'

const baseURL = 'https://msbot-api.home.hinasense.jp'

/**
 * アーティスト一覧を取得
 */
export async function getArtists(): Promise<Artist[]> {
  const res = await fetch(`${baseURL}/artist`)
  if (!res.ok) {
    throw new Error(`Failed to fetch artists: ${res.statusText}`)
  }
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

/**
 * アルバム一覧を取得
 */
export async function getAlbums(artistName: string): Promise<Album[]> {
  const encodedArtist = encodeURIComponent(artistName)
  const res = await fetch(`${baseURL}/artist/${encodedArtist}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch albums: ${res.statusText}`)
  }
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

/**
 * トラック一覧を取得
 */
export async function getTracks(artistName: string, albumName: string): Promise<Track[]> {
  const encodedArtist = encodeURIComponent(artistName)
  const encodedAlbum = encodeURIComponent(albumName)
  const res = await fetch(`${baseURL}/artist/${encodedArtist}/${encodedAlbum}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch tracks: ${res.statusText}`)
  }
  const data = await res.json()
  return Array.isArray(data) ? data : []
}
