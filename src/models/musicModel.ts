// src/models/musicModel.ts
import type { Artist, Album, Track } from './musicTypes'

const BASE_URL = 'https://msbot-api.home.hinasense.jp'

/** アーティスト一覧を取得する */
export async function fetchArtists(): Promise<Artist[]> {
  try {
    const res = await fetch(`${BASE_URL}/artist`)
    if (!res.ok) {
      throw new Error(`Failed to fetch artists: ${res.statusText}`)
    }
    const data = await res.json()
    if (Array.isArray(data)) {
      const youtubeIndex = data.findIndex((artist: Artist) => artist === 'Youtube')
      if (youtubeIndex > 0) {
        const [youtubeArtist] = data.splice(youtubeIndex, 1)
        data.unshift(youtubeArtist)
      }
    }
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('fetchArtists error:', error)
    return []
  }
}

/** アルバム一覧を取得する */
export async function fetchAlbums(artist: Artist): Promise<Album[]> {
  try {
    const encodedArtist = encodeURIComponent(artist)
    const res = await fetch(`${BASE_URL}/artist/${encodedArtist}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch albums: ${res.statusText}`)
    }
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('fetchAlbums error:', error)
    return []
  }
}

/** トラック一覧を取得する */
export async function fetchTracks(artist: Artist, album: Album): Promise<Track[]> {
  try {
    const encodedArtist = encodeURIComponent(artist)
    const encodedAlbum = encodeURIComponent(album)
    const res = await fetch(`${BASE_URL}/artist/${encodedArtist}/${encodedAlbum}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch tracks: ${res.statusText}`)
    }
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('fetchTracks error:', error)
    return []
  }
}

/** トラックをリクエストする */
export async function sendTrackRequest(
  artist: Artist,
  album: Album,
  track: Track,
  guildId: string,
): Promise<unknown> {
  try {
    const encodedArtist = encodeURIComponent(artist)
    const encodedAlbum = encodeURIComponent(album)
    const encodedTrack = encodeURIComponent(track)
    const requestUrl = `${BASE_URL}/requestplay/${encodedArtist}/${encodedAlbum}/${encodedTrack}`

    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        guildid: guildId,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to request track: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('sendTrackRequest error:', error)
    throw error
  }
}

export async function sendYoutubeTrackRequest(url: string, guildId: string): Promise<unknown> {
  try {
    const requestUrl = `${BASE_URL}/youtubeplay/${encodeURIComponent(url)}`

    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        guildid: guildId,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to request YouTube track: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('sendYoutubeTrackRequest error:', error)
    throw error
  }
}

/** アルバムカバーURLを組み立てる */
export function buildAlbumCoverUrl(artist: Artist, album: Album): string {
  const encodedArtist = encodeURIComponent(artist)
  const encodedAlbum = encodeURIComponent(album)
  return `${BASE_URL}/cover/${encodedArtist}/${encodedAlbum}`
}
