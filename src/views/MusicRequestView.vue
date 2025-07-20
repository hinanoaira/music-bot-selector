<template>
  <div class="music-request-page">
    <!-- 左ペイン：アーティスト一覧 -->
    <div class="left-pane">
      <ArtistList :artists="artists" @select-artist="selectArtist" />
    </div>

    <!-- 右ペイン：アルバム / トラック -->
    <div class="right-pane">
      <!-- 1) アーティスト未選択時 -->
      <template v-if="!selectedArtist">
        <template v-if="isMobile">
          <ArtistList :artists="artists" @select-artist="selectArtist" />
        </template>
        <template v-else>
          <BaseText tag="p" variant="body"> アーティストを選んでください </BaseText>
        </template>
      </template>

      <!-- 2) アーティスト選択済み & アルバム未選択 → アルバム一覧 -->
      <AlbumList v-else-if="selectedArtist && !selectedAlbum" :artist-name="selectedArtist" :albums="albums"
        :get-album-cover-url="getAlbumCoverUrl" @back="$router.go(-1)" @select-album="selectAlbum" />

      <!-- 3) アルバム選択済み → トラック一覧 -->
      <TrackList v-else-if="selectedAlbum" :artist-name="selectedArtist" :album-name="selectedAlbum" :tracks="tracks"
        :guild-id="guildId" :is-requesting-youtube="isRequestingYoutube" :get-album-cover-url="getAlbumCoverUrl"
        @back="$router.go(-1)" @request-track="requestTrack" @request-youtube-track="requestYoutubeTrack" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { MusicViewModel } from '@/viewmodels/MusicViewModel'
import { MusicRequestViewModel } from '@/viewmodels/MusicRequestViewModel'
import { NavigationViewModel } from '@/viewmodels/NavigationViewModel'
import { useToastStore } from '@/stores/toast'
import { getGuildIdFromUrl } from '@/utils/urlParams'
import BaseText from '@/components/atoms/BaseText.vue'
import ArtistList from '@/components/organisms/ArtistList.vue'
import AlbumList from '@/components/organisms/AlbumList.vue'
import TrackList from '@/components/organisms/TrackList.vue'

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
  display: flex;
  width: 100%;
  height: 100%;
}

/* 左ペイン */
.left-pane {
  width: 320px;
  padding: 16px;
  box-sizing: border-box;
  background-color: #f8f8f8;
  border-right: 1px solid #ccc;
  height: 100%;
  overflow-y: auto;
}

/* 右ペイン */
.right-pane {
  flex: 1;
  padding: 16px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
}

/* レスポンシブ対応：スマホ画面では左ペインを非表示に */
@media (max-width: 700px) {
  .left-pane {
    display: none;
  }
}
</style>
