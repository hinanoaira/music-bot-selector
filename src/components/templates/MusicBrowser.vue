<template>
  <div class="music-browser">
    <!-- 左ペイン：アーティスト一覧 -->
    <div class="left-pane">
      <ArtistList :artists="artists" @select-artist="$emit('selectArtist', $event)" />
    </div>

    <!-- 右ペイン：アルバム / トラック -->
    <div class="right-pane">
      <!-- 1) アーティスト未選択時 -->
      <template v-if="!selectedArtist">
        <template v-if="isMobile">
          <ArtistList :artists="artists" @select-artist="$emit('selectArtist', $event)" />
        </template>
        <template v-else>
          <BaseText tag="p" variant="body"> アーティストを選んでください </BaseText>
        </template>
      </template>

      <!-- 2) アーティスト選択済み & アルバム未選択 → アルバム一覧 -->
      <AlbumList
        v-else-if="selectedArtist && !selectedAlbum"
        :artist-name="selectedArtist"
        :albums="albums"
        :get-album-cover-url="getAlbumCoverUrl"
        @back="$emit('back')"
        @select-album="$emit('selectAlbum', $event)"
      />

      <!-- 3) アルバム選択済み → トラック一覧 -->
      <TrackList
        v-else-if="selectedAlbum"
        :artist-name="selectedArtist"
        :album-name="selectedAlbum"
        :tracks="tracks"
        :guild-id="guildId"
        :is-requesting-youtube="isRequestingYoutube"
        :get-album-cover-url="getAlbumCoverUrl"
        @back="$emit('back')"
        @request-track="$emit('requestTrack', $event)"
        @request-youtube-track="$emit('requestYoutubeTrack', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import BaseText from '@/components/atoms/BaseText.vue'
import ArtistList from '@/components/organisms/ArtistList.vue'
import AlbumList from '@/components/organisms/AlbumList.vue'
import TrackList from '@/components/organisms/TrackList.vue'

interface Props {
  artists: string[]
  albums: string[]
  tracks: string[]
  selectedArtist: string | null
  selectedAlbum: string | null
  guildId: string | null
  isRequestingYoutube: boolean
  getAlbumCoverUrl: (artist: string, album: string) => string
  isMobile: boolean
}

defineProps<Props>()

// emits定義
defineEmits<{
  selectArtist: [artist: string]
  selectAlbum: [album: string]
  requestTrack: [track: string]
  requestYoutubeTrack: [url: string]
  back: []
}>()
</script>

<style scoped>
.music-browser {
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
