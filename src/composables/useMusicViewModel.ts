// src/composables/useMusicViewModel.ts

import { ref } from 'vue'
import { useGuildParam } from '@/composables/useGuildParam'

// guildid
const { guildId } = useGuildParam()

/**
 * -------------------------
 * 型定義
 * -------------------------
 */
export type Artist = string
export type Album = string
export type Track = string

/**
 * -------------------------
 * 定数や共通ロジック
 * -------------------------
 */
const BASE_URL = 'https://msbot-api.home.hinasense.jp'

/**
 * -------------------------
 * API通信 (省略しない版)
 * -------------------------
 */

/** アーティスト一覧を取得する */
async function getArtists(): Promise<Artist[]> {
  try {
    const res = await fetch(`${BASE_URL}/artist`)
    if (!res.ok) {
      throw new Error(`Failed to fetch artists: ${res.statusText}`)
    }
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('getArtists error:', error)
    return []
  }
}

/** アルバム一覧を取得する */
async function getAlbums(artist: Artist): Promise<Album[]> {
  try {
    const encodedArtist = encodeURIComponent(artist)
    const res = await fetch(`${BASE_URL}/artist/${encodedArtist}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch albums: ${res.statusText}`)
    }
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('getAlbums error:', error)
    return []
  }
}

/** トラック一覧を取得する */
async function getTracks(artist: Artist, album: Album): Promise<Track[]> {
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
    console.error('getTracks error:', error)
    return []
  }
}

/**
 * -------------------------
 * メインの ViewModel
 * -------------------------
 */
export function useMusicViewModel() {
  // state
  const artists = ref<Artist[]>([])
  const albums = ref<Album[]>([])
  const tracks = ref<Track[]>([])

  // 選択中のアーティスト、アルバム
  const selectedArtist = ref<Artist | null>(null)
  const selectedAlbum = ref<Album | null>(null)

  /**
   * ページ初期化 (onMounted時)
   * アーティスト一覧を取得する
   */
  async function init() {
    try {
      const artistList = await getArtists()
      artists.value = artistList
    } catch (err) {
      console.error('init error:', err)
    }
  }

  /**
   * アーティストを選択 -> アルバム一覧を取得
   */
  async function selectArtist(artist: Artist) {
    selectedArtist.value = artist
    selectedAlbum.value = null
    tracks.value = []

    try {
      const albumList = await getAlbums(artist)
      albums.value = albumList
    } catch (err) {
      console.error('selectArtist error:', err)
    }
  }

  /**
   * アルバムを選択 -> トラック一覧を取得
   */
  async function selectAlbum(album: Album) {
    selectedAlbum.value = album
    tracks.value = []

    if (!selectedArtist.value) {
      console.warn('No artist selected, cannot fetch tracks.')
      return
    }

    try {
      const trackList = await getTracks(selectedArtist.value, album)
      tracks.value = trackList
    } catch (err) {
      console.error('selectAlbum error:', err)
    }
  }

  /**
   * アルバム一覧に戻る (トラック画面から)
   */
  function backToAlbumList() {
    selectedAlbum.value = null
    tracks.value = []
  }

  /**
   * トラックをリクエスト
   * /requestplay/<AlbumArtist>/<Album>/<TrackTitle>
   */
  async function requestTrack(track: Track) {
    console.log('リクエストするトラック:', track)

    if (!guildId.value) {
      console.warn('No guildId. Request disabled')
      return
    }

    if (!selectedArtist.value || !selectedAlbum.value) {
      console.warn('No selected artist or album. Cannot request track.')
      return
    }

    try {
      const encodedArtist = encodeURIComponent(selectedArtist.value)
      const encodedAlbum = encodeURIComponent(selectedAlbum.value)
      const encodedTrack = encodeURIComponent(track)

      const requestUrl = `${BASE_URL}/requestplay/${encodedArtist}/${encodedAlbum}/${encodedTrack}`

      console.log('リクエストURL:', requestUrl)

      // ここでは GET リクエストの例
      // 実際のAPI仕様がPOSTなら method: 'POST' 等に書き換える
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          guildid: guildId.value,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to request track: ${response.statusText}`)
      }

      // レスポンスをどう扱うかはAPI設計次第
      const data = await response.json()
      console.log('リクエスト成功:', data)
    } catch (error) {
      console.error('リクエスト時にエラー:', error)
    }
  }

  /**
   * アルバムカバーURLを組み立てる (ジャケット表示用)
   */
  function getAlbumCoverUrl(artist: Artist, album: Album): string {
    const encodedArtist = encodeURIComponent(artist)
    const encodedAlbum = encodeURIComponent(album)
    return `${BASE_URL}/cover/${encodedArtist}/${encodedAlbum}`
  }

  // ViewModelとして返す値・メソッド
  return {
    // state
    artists,
    albums,
    tracks,
    selectedArtist,
    selectedAlbum,

    // init
    init,

    // 選択系
    selectArtist,
    selectAlbum,

    // 戻る/リクエスト
    backToAlbumList,
    requestTrack,

    // ジャケットURL
    getAlbumCoverUrl,
  }
}
