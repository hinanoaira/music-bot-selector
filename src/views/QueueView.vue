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
import { getGuildIdFromUrl } from '@/utils/url-params'
import QueuePanel from '@/components/templates/QueuePanel.vue'

const guildId = getGuildIdFromUrl()

const viewModel = new QueueViewModel()

const toggleQueue = () => {
  viewModel.toggleQueuePanel()
}

const skipTrack = async () => {
  if (guildId) {
    await viewModel.skipCurrentTrack(guildId)
  }
}

const getAlbumCoverUrl = (albumArtist: string, album: string) => {
  return viewModel.getQueueAlbumCoverUrl(albumArtist, album)
}

const queueItems = viewModel.queueItems
const isQueueOpen = viewModel.isQueueOpen
const pendingTrackCount = viewModel.pendingTrackCount
const playbackStatus = viewModel.playbackStatus
const formattedCurrentTime = viewModel.formattedCurrentTime
const formattedTotalTime = viewModel.formattedTotalTime
const playbackProgress = viewModel.playbackProgress

onMounted(async () => {
  if (guildId) {
    await viewModel.connect(guildId)
  }
})

onUnmounted(() => {
  viewModel.disconnect()
})
</script>

<style scoped>
.queue-view {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
