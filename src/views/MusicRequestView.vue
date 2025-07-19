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
          <BaseText tag="p" variant="body">
            アーティストを選んでください
          </BaseText>
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
import { useMusicViewModelMVVM } from '@/composables/useMusicViewModelMVVM'
import { useGuildParam } from '@/composables/useGuildParam'
import BaseText from '@/components/atoms/BaseText.vue'
import ArtistList from '@/components/organisms/ArtistList.vue'
import AlbumList from '@/components/organisms/AlbumList.vue'
import TrackList from '@/components/organisms/TrackList.vue'

const { guildId } = useGuildParam()

const {
  artists,
  albums,
  tracks,
  selectedArtist,
  selectedAlbum,
  isRequestingYoutube,
  init,
  selectArtist,
  selectAlbum,
  requestTrack,
  requestYoutubeTrack,
  getAlbumCoverUrl,
  handlePopState,
} = useMusicViewModelMVVM()

const isMobile = ref(window.innerWidth <= 700)

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 700
}

onMounted(() => {
  init()
  window.addEventListener('resize', updateIsMobile)
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
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
