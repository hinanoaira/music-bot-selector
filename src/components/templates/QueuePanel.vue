<template>
  <div class="queue-panel" :class="{ 'is-open': isOpen }">
    <QueueHeader @toggle="togglePanel" />

    <transition name="slide-up">
      <QueueBody
        v-if="isOpen"
        :queue-items="queueItems"
        :pending-track-count="pendingTrackCount"
        :playback-status="playbackStatus"
        :formatted-current-time="formattedCurrentTime"
        :formatted-total-time="formattedTotalTime"
        :playback-progress="playbackProgress"
        :get-cover-url="getCoverUrl"
        @skip="handleSkipTrack"
      />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useQueueViewModel } from '@/composables/useQueueViewModel'
import QueueHeader from '@/components/molecules/QueueHeader.vue'
import QueueBody from '@/components/organisms/QueueBody.vue'

const {
  queueItems,
  isOpen,
  pendingTrackCount,
  playbackStatus,
  formattedCurrentTime,
  formattedTotalTime,
  playbackProgress,
  togglePanel,
  skipTrack,
  getAlbumCoverUrl,
} = useQueueViewModel()

function getCoverUrl(albumArtist: string, album: string): string {
  return getAlbumCoverUrl(albumArtist, album)
}

async function handleSkipTrack() {
  await skipTrack()
}
</script>

<style scoped>
.queue-panel {
  position: fixed;
  right: 16px;
  bottom: 0;
  width: 320px;
  border: 1px solid #ccc;
  border-radius: 8px 8px 0 0;
  background-color: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
}

/* スライドアップトランジション */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
