<template>
  <div class="music-browser">
    <div class="left-pane">
      <ArtistList :artists="artists" @select-artist="$emit('selectArtist', $event)" />
    </div>

    <div class="right-pane">
      <template v-if="!selectedArtist">
        <template v-if="isMobile">
          <ArtistList :artists="artists" @select-artist="$emit('selectArtist', $event)" />
        </template>
        <template v-else>
          <BaseText tag="p" variant="body"> アーティストを選んでください </BaseText>
        </template>
      </template>

      <AlbumList
        v-else-if="selectedArtist && !selectedAlbum"
        :artist-name="selectedArtist"
        :albums="albums"
        :get-album-cover-url="getAlbumCoverUrl"
        @back="$emit('back')"
        @select-album="$emit('selectAlbum', $event)"
      />

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
import { ArtistList, AlbumList, TrackList } from '@/components/organisms/music'

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

.left-pane {
  width: 320px;
  padding: 16px;
  box-sizing: border-box;
  background-color: #f8f8f8;
  border-right: 1px solid #ccc;
  height: 100%;
  overflow-y: auto;
}

.right-pane {
  flex: 1;
  padding: 16px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
}

@media (max-width: 700px) {
  .left-pane {
    display: none;
  }
}
</style>
