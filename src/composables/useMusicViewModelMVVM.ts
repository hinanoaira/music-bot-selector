// src/composables/useMusicViewModel.ts
import { onMounted, onUnmounted } from 'vue'
import { MusicViewModel } from '@/viewmodels/MusicViewModel'
import { MusicRequestViewModel } from '@/viewmodels/MusicRequestViewModel'
import { NavigationViewModel } from '@/viewmodels/NavigationViewModel'
import { useToastStore } from '@/stores/toast'
import { useGuildParam } from '@/composables/useGuildParam'

/**
 * 音楽関連のComposable（ViewModelのラッパー）
 */
export function useMusicViewModelMVVM() {
  const { guildId } = useGuildParam()
  const { showSuccess, showError } = useToastStore()

  // ViewModelインスタンスを作成
  const musicViewModel = new MusicViewModel()
  const requestViewModel = new MusicRequestViewModel()
  const navigationViewModel = new NavigationViewModel()

  // コールバック設定
  requestViewModel.onRequestSuccess = (message: string) => showSuccess(message)
  requestViewModel.onRequestError = (message: string) => showError(message)

  // ナビゲーション処理
  const handlePopState = (event: PopStateEvent) => {
    const result = navigationViewModel.handlePopState(event)

    switch (result.action) {
      case 'resetAll':
        musicViewModel.resetSelection()
        navigationViewModel.restoreScrollPosition(result.scrollPosition)
        break
      case 'resetAlbum':
        musicViewModel.resetAlbumSelection()
        navigationViewModel.restoreScrollPosition(result.scrollPosition)
        break
      case 'selectArtist':
        if (result.artist && musicViewModel.selectedArtist.value !== result.artist) {
          musicViewModel.selectArtist(result.artist)
        }
        musicViewModel.resetAlbumSelection()
        navigationViewModel.restoreScrollPosition(result.scrollPosition)
        break
    }
  }

  // アーティスト選択処理
  const selectArtist = async (artist: string, pushHistory = true) => {
    if (pushHistory) {
      navigationViewModel.navigateToArtist(artist)
    }
    await musicViewModel.selectArtist(artist)
  }

  // アルバム選択処理
  const selectAlbum = async (album: string) => {
    navigationViewModel.navigateToAlbum(album)
    await musicViewModel.selectAlbum(album)
  }

  // トラックリクエスト処理
  const requestTrack = async (track: string) => {
    await requestViewModel.requestTrack(
      musicViewModel.selectedArtist.value,
      musicViewModel.selectedAlbum.value,
      track,
      guildId.value,
    )
  }

  // YouTubeリクエスト処理
  const requestYoutubeTrack = async (url: string) => {
    await requestViewModel.requestYoutubeTrack(url, guildId.value)
  }

  // ライフサイクル
  onMounted(() => {
    musicViewModel.initialize()
    window.addEventListener('popstate', handlePopState)
  })

  onUnmounted(() => {
    window.removeEventListener('popstate', handlePopState)
  })

  return {
    // 状態
    artists: musicViewModel.artists,
    albums: musicViewModel.albums,
    tracks: musicViewModel.tracks,
    selectedArtist: musicViewModel.selectedArtist,
    selectedAlbum: musicViewModel.selectedAlbum,
    isLoading: musicViewModel.isLoading,
    error: musicViewModel.error,
    isRequestingYoutube: requestViewModel.isRequestingYoutube,

    // 計算プロパティ
    hasArtists: musicViewModel.hasArtists,
    hasAlbums: musicViewModel.hasAlbums,
    hasTracks: musicViewModel.hasTracks,
    isArtistSelected: musicViewModel.isArtistSelected,
    isAlbumSelected: musicViewModel.isAlbumSelected,

    // メソッド
    init: () => musicViewModel.initialize(),
    selectArtist,
    selectAlbum,
    requestTrack,
    requestYoutubeTrack,
    getAlbumCoverUrl: musicViewModel.getAlbumCoverUrl.bind(musicViewModel),
    handlePopState,
  }
}
