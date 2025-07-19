<template>
  <div class="track-list">
    <BaseButton variant="back" @click="$emit('back')">
      アルバム一覧に戻る
    </BaseButton>

    <TrackHeader :album-name="albumName" :cover-url="getAlbumCoverUrl(artistName, albumName)" />

    <BaseList>
      <!-- YouTube専用入力 -->
      <YouTubeInput v-if="isYouTubeAlbum" v-model:url="youtubeUrl" :disabled="isRequestingYoutube"
        @request="handleYouTubeRequest" />

      <!-- 通常トラック -->
      <TrackItem v-for="track in tracks" :key="track" :track-name="track" :disabled="!guildId"
        @request="$emit('requestTrack', track)" />
    </BaseList>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseList from '@/components/atoms/BaseList.vue'
import TrackHeader from '@/components/molecules/TrackHeader.vue'
import TrackItem from '@/components/molecules/TrackItem.vue'
import YouTubeInput from '@/components/molecules/YouTubeInput.vue'

interface Props {
  artistName: string
  albumName: string
  tracks: string[]
  guildId: string | null
  isRequestingYoutube: boolean
  getAlbumCoverUrl: (artist: string, album: string) => string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  back: []
  requestTrack: [track: string]
  requestYoutubeTrack: [url: string]
}>()

const youtubeUrl = ref('')

const isYouTubeAlbum = computed(() => {
  return props.artistName === 'Youtube' && props.albumName === 'Youtube'
})

const handleYouTubeRequest = (url: string) => {
  emit('requestYoutubeTrack', url)
  youtubeUrl.value = ''
}
</script>

<style scoped>
.track-list {
  height: 100%;
}
</style>
