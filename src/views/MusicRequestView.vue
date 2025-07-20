<template>
  <div class="music-request-page">
    <MusicBrowser
      :artists="artists"
      :albums="albums"
      :tracks="tracks"
      :selected-artist="selectedArtist"
      :selected-album="selectedAlbum"
      :guild-id="guildId"
      :is-requesting-youtube="isRequestingYoutube"
      :get-album-cover-url="getAlbumCoverUrl"
      :is-mobile="isMobile"
      @select-artist="selectArtist"
      @select-album="selectAlbum"
      @request-track="requestTrack"
      @request-youtube-track="requestYoutubeTrack"
      @back="$router.go(-1)"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { MusicViewModel } from '@/viewmodels/MusicViewModel'
import { MusicRequestViewModel } from '@/viewmodels/MusicRequestViewModel'
import { NavigationViewModel } from '@/viewmodels/NavigationViewModel'
import { useToastStore } from '@/stores/toast'
import { getGuildIdFromUrl } from '@/utils/urlParams'
import MusicBrowser from '@/components/templates/MusicBrowser.vue'

const guildId = getGuildIdFromUrl()
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
    guildId,
  )
}

// YouTubeリクエスト処理
const requestYoutubeTrack = async (url: string) => {
  await requestViewModel.requestYoutubeTrack(url, guildId)
}

// テンプレートで使用するプロパティ
const artists = musicViewModel.artists
const albums = musicViewModel.albums
const tracks = musicViewModel.tracks
const selectedArtist = musicViewModel.selectedArtist
const selectedAlbum = musicViewModel.selectedAlbum
const isRequestingYoutube = requestViewModel.isRequestingYoutube
const getAlbumCoverUrl = musicViewModel.getAlbumCoverUrl.bind(musicViewModel)

const isMobile = ref(window.innerWidth <= 700)

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 700
}

onMounted(() => {
  musicViewModel.initialize()
  window.addEventListener('resize', updateIsMobile)
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
  window.removeEventListener('popstate', handlePopState)
})
</script>

<style scoped>
.music-request-page {
  width: 100%;
  height: 100%;
}
</style>
