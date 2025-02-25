// src/composables/useMusicViewModel.ts
import { ref } from 'vue'
import { useGuildParam } from '@/composables/useGuildParam'
import {
  fetchArtists,
  fetchAlbums,
  fetchTracks,
  sendTrackRequest,
  buildAlbumCoverUrl,
} from '@/models/musicModel'
import type { Artist, Album, Track } from '@/models/musicTypes'

export function useMusicViewModel() {
  // 状態の定義
  const artists = ref<Artist[]>([])
  const albums = ref<Album[]>([])
  const tracks = ref<Track[]>([])
  const selectedArtist = ref<Artist | null>(null)
  const selectedAlbum = ref<Album | null>(null)

  const { guildId } = useGuildParam()

  /** ページ初期化 */
  async function init() {
    try {
      artists.value = await fetchArtists()
    } catch (err) {
      console.error('init error:', err)
    }
  }

  function updateCurrentStateScroll() {
    // 左ペインと右ペインの要素を取得
    const rightPane = document.querySelector('.right-pane')
    const rightScroll = rightPane ? rightPane.scrollTop : 0

    // 現在の履歴 state にスクロール位置を追加して更新
    history.replaceState({ ...history.state, rightScroll }, '')
  }

  /** アーティスト選択時の処理 */
  async function selectArtist(artist: Artist, pushHistory: boolean = true) {
    if (pushHistory) {
      updateCurrentStateScroll()
    }
    history.pushState({ stage: 'artistSelected', artist }, '', '')
    selectedArtist.value = artist
    selectedAlbum.value = null
    albums.value = []
    tracks.value = []

    try {
      albums.value = await fetchAlbums(artist)
    } catch (err) {
      console.error('selectArtist error:', err)
    }
  }

  /** アルバム選択時の処理 */
  async function selectAlbum(album: Album) {
    updateCurrentStateScroll()
    history.pushState({ stage: 'albumSelected', album }, '', '')
    selectedAlbum.value = album
    tracks.value = []
    if (!selectedArtist.value) {
      console.warn('No artist selected, cannot fetch tracks.')
      return
    }
    try {
      tracks.value = await fetchTracks(selectedArtist.value, album)
    } catch (err) {
      console.error('selectAlbum error:', err)
    }
  }

  /** トラックリクエストの実行 */
  async function requestTrack(track: Track) {
    console.log('リクエストするトラック:', track)
    if (!guildId.value || !selectedArtist.value || !selectedAlbum.value) {
      console.warn('必要な情報が不足しておるため、リクエストは実行できぬ。')
      return
    }
    try {
      const result = await sendTrackRequest(
        selectedArtist.value,
        selectedAlbum.value,
        track,
        guildId.value,
      )
      console.log('リクエスト成功:', result)
    } catch (error) {
      console.error('リクエスト時にエラー:', error)
    }
  }

  /** アルバムカバーURLを取得 */
  function getAlbumCoverUrl(artist: Artist, album: Album): string {
    return buildAlbumCoverUrl(artist, album)
  }

  return {
    // 状態
    artists,
    albums,
    tracks,
    selectedArtist,
    selectedAlbum,
    // 初期化・選択系メソッド
    init,
    selectArtist,
    selectAlbum,
    requestTrack,
    // 補助関数
    getAlbumCoverUrl,
  }
}
