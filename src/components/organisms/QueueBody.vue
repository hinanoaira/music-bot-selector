<template>
  <div class="queue-body">
    <PlaybackInfo
      v-if="playbackStatus"
      :formatted-current-time="formattedCurrentTime"
      :formatted-total-time="formattedTotalTime"
      :progress="playbackProgress"
    />

    <BaseList class="queue-list">
      <QueueControls
        :pending-count="pendingTrackCount"
        :disabled="queueItems.length === 0"
        @skip="$emit('skip')"
      />

      <QueueItem
        v-for="(item, index) in queueItems"
        :key="index"
        :title="item.title"
        :artist="item.artist"
        :album="item.album"
        :cover-url="getCoverUrl(item.albumArtist, item.album)"
        :is-current="item.isCurrent"
      />
    </BaseList>
  </div>
</template>

<script lang="ts" setup>
import { PlaybackInfo, QueueControls, QueueItem } from '@/components/organisms/queue'
import BaseList from '@/components/atoms/BaseList.vue'
import type { QueueItem as QueueItemType, PlaybackStatus } from '@/models/types/music-types'

interface Props {
  queueItems: QueueItemType[]
  pendingTrackCount: number
  playbackStatus: PlaybackStatus | null
  formattedCurrentTime: string
  formattedTotalTime: string
  playbackProgress: number
  getCoverUrl: (albumArtist: string, album: string) => string
}

defineProps<Props>()
defineEmits<{
  skip: []
}>()
</script>

<style scoped>
.queue-body {
  padding: 8px;
  max-height: 300px;
  overflow-y: auto;
}
</style>
