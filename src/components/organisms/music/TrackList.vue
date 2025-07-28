<template>
  <div class="track-list">
    <BaseButton variant="back" @click="$emit('back')"> アルバム一覧に戻る </BaseButton>

    <ContentHeader
      :title="`${albumName} のトラック`"
      :image-url="getAlbumCoverUrl(artistName, albumName)"
      :image-alt="`${albumName} album cover`"
      image-size="large"
    />

    <BaseList>
      <UrlInputListItem
        v-if="isYouTubeAlbum"
        v-model:url="youtubeUrl"
        :disabled="isRequestingYoutube"
        action-text="リクエスト"
        placeholder-text="URLを入力..."
        processing-text="リクエスト処理中..."
        variant="track"
        @request="handleYouTubeRequest"
      />

      <ActionListItem
        v-for="track in tracks"
        :key="track"
        :label="track"
        action-text="リクエスト"
        variant="track"
        :disabled="!guildId"
        @action="$emit('requestTrack', track)"
      />
    </BaseList>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseList from '@/components/atoms/BaseList.vue'
import ContentHeader from '@/components/molecules/ContentHeader.vue'
import ActionListItem from '@/components/molecules/ActionListItem.vue'
import UrlInputListItem from '@/components/molecules/UrlInputListItem.vue'

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
