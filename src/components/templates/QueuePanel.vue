<template>
  <div class="queue-panel" :class="{ 'is-open': isOpen }">
    <QueueHeader @toggle="$emit('toggle')" />

    <transition name="slide-up">
      <QueueBody v-if="isOpen" :queue-items="queueItems" :pending-track-count="pendingTrackCount"
        :playback-status="playbackStatus" :formatted-current-time="formattedCurrentTime"
        :formatted-total-time="formattedTotalTime" :playback-progress="playbackProgress" :get-cover-url="getCoverUrl"
        @skip="$emit('skip')" />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import QueueHeader from '@/components/molecules/QueueHeader.vue'
import QueueBody from '@/components/organisms/QueueBody.vue'
import type { QueueItem, PlaybackStatus } from '@/models/types/music-types'

interface Props {
  queueItems: QueueItem[]
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
