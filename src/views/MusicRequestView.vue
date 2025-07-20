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
      @back="router.back()"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { MusicRequestViewModel } from '@/viewmodels/MusicRequestViewModel'
import { useToastStore } from '@/stores/toast'
import { getGuildIdFromUrl } from '@/utils/urlParams'
import MusicBrowser from '@/components/templates/MusicBrowser.vue'

const router = useRouter()
const route = useRoute()
const guildId = getGuildIdFromUrl()
const { showSuccess, showError } = useToastStore()

const viewModel = new MusicRequestViewModel()

viewModel.addEventListener('requestSuccess', showSuccess)
viewModel.addEventListener('requestError', showError)

watch(
  () => [route.params.artist, route.params.album],
  async ([artist, album]) => {
    if (artist && typeof artist === 'string') {
      await viewModel.selectArtist(artist)

      if (album && typeof album === 'string') {
        await viewModel.selectAlbum(album)
      }
    } else {
      viewModel.resetSelection()
    }
  },
  { immediate: true },
)

const selectArtist = async (artist: string) => {
  await router.push({ name: 'ArtistSelected', params: { artist } })
}

const selectAlbum = async (album: string) => {
  if (route.params.artist) {
    await router.push({
      name: 'AlbumSelected',
      params: {
        artist: route.params.artist,
        album,
      },
    })
  }
}

const requestTrack = async (track: string) => {
  await viewModel.requestTrack(track, guildId)
}

const requestYoutubeTrack = async (url: string) => {
  await viewModel.requestYoutubeTrack(url, guildId)
}

const artists = viewModel.artists
const albums = viewModel.albums
const tracks = viewModel.tracks
const selectedArtist = viewModel.selectedArtist
const selectedAlbum = viewModel.selectedAlbum
const isRequestingYoutube = viewModel.isRequestingYoutube
const getAlbumCoverUrl = viewModel.getAlbumCoverUrl.bind(viewModel)

const isMobile = ref(window.innerWidth <= 700)

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 700
}

onMounted(() => {
  viewModel.initialize()
  window.addEventListener('resize', updateIsMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
  viewModel.removeEventListener('requestSuccess', showSuccess)
  viewModel.removeEventListener('requestError', showError)
})
</script>

<style scoped>
.music-request-page {
  width: 100%;
  height: 100%;
}
</style>
