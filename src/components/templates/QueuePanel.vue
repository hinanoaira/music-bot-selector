<template>
  <div class="queue-panel" :class="{ 'is-open': isOpen }">
    <QueueHeader @toggle="$emit('toggle')" />

    <transition name="slide-up">
      <div v-if="isOpen" class="queue-body">
        <PlaybackInfo v-if="playbackStatus" :formatted-current-time="formattedCurrentTime"
          :formatted-total-time="formattedTotalTime" :progress="playbackProgress" />

        <BaseList class="queue-list">
          <QueueControls :pending-count="pendingTrackCount" :disabled="queueItems.length === 0" @skip="$emit('skip')" />

          <QueueItem v-for="(item, index) in queueItems" :key="index" :title="item.title" :artist="item.artist"
            :album="item.album" :cover-url="getCoverUrl(item.albumArtist, item.album)" :is-current="item.isCurrent" />
        </BaseList>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { QueueHeader, PlaybackInfo, QueueControls, QueueItem } from '@/components/organisms/queue'
import BaseList from '@/components/atoms/BaseList.vue'
import type { QueueItem as QueueItemType, PlaybackStatus } from '@/models/types/music-types'

interface Props {
  queueItems: QueueItemType[]
  isOpen: boolean
  pendingTrackCount: number
  playbackStatus: PlaybackStatus | null
  formattedCurrentTime: string
  formattedTotalTime: string
  playbackProgress: number
  getCoverUrl: (albumArtist: string, album: string) => string
}

defineProps<Props>()

defineEmits<{
  toggle: []
  skip: []
}>()
</script>

<style scoped>
.queue-panel {
  width: 320px;
  border: 1px solid #ccc;
  border-radius: 8px 8px 0 0;
  background-color: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
}

.queue-body {
  padding: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
