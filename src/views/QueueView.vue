<template>
  <div v-if="guildId" class="queue-view">
    <QueuePanel
      :queue-items="queueItems"
      :is-open="isQueueOpen"
      :pending-track-count="pendingTrackCount"
      :playback-status="playbackStatus"
      :formatted-current-time="formattedCurrentTime"
      :formatted-total-time="formattedTotalTime"
      :playback-progress="playbackProgress"
      :get-cover-url="getAlbumCoverUrl"
      @toggle="toggleQueue"
      @skip="skipTrack"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { QueueViewModel } from '@/viewmodels/QueueViewModel'
import { MusicService } from '@/services/MusicService'
import { useToastStore } from '@/stores/toast'
import { getGuildIdFromUrl } from '@/utils/urlParams'
import QueuePanel from '@/components/templates/QueuePanel.vue'

const guildId = getGuildIdFromUrl()
const { showSuccess, showError } = useToastStore()

const queueViewModel = new QueueViewModel()
const musicService = MusicService.getInstance()

queueViewModel.addEventListener('skipSuccess', showSuccess)
queueViewModel.addEventListener('skipError', showError)

const toggleQueue = () => {
  queueViewModel.togglePanel()
}

const skipTrack = async () => {
  if (guildId) {
    await queueViewModel.skipCurrentTrack(guildId)
  }
}

const getAlbumCoverUrl = (albumArtist: string, album: string): string => {
  return musicService.getAlbumCoverUrl(albumArtist, album)
}

const queueItems = queueViewModel.queueItems
const isQueueOpen = queueViewModel.isOpen
const pendingTrackCount = queueViewModel.pendingTrackCount
const playbackStatus = queueViewModel.playbackStatus
const formattedCurrentTime = queueViewModel.formattedCurrentTime
const formattedTotalTime = queueViewModel.formattedTotalTime
const playbackProgress = queueViewModel.playbackProgress

onMounted(() => {
  if (guildId) {
    queueViewModel.connect(guildId)
  }
})

onUnmounted(() => {
  queueViewModel.disconnect()
  queueViewModel.removeEventListener('skipSuccess', showSuccess)
  queueViewModel.removeEventListener('skipError', showError)
})
</script>

<style scoped>
.queue-view {
  position: fixed;
  right: 16px;
  bottom: 0;
  z-index: 30;
}
</style>
