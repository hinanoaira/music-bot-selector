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
import { onMounted, onUnmounted } from 'vue'
import { QueueViewModel } from '@/viewmodels/QueueViewModel'
import { useToastStore } from '@/stores/toast'
import { getGuildIdFromUrl } from '@/utils/urlParams'
import QueueHeader from '@/components/molecules/QueueHeader.vue'
import QueueBody from '@/components/organisms/QueueBody.vue'

const { showSuccess, showError } = useToastStore()
const guildId = getGuildIdFromUrl()

// ViewModelインスタンスを作成
const queueViewModel = new QueueViewModel()

// コールバック設定
queueViewModel.onSkipSuccess = (message: string) => showSuccess(message)
queueViewModel.onSkipError = (message: string) => showError(message)

// スキップ処理
const skipTrack = async () => {
  if (guildId) {
    await queueViewModel.skipCurrentTrack(guildId)
  }
}

function getCoverUrl(albumArtist: string, album: string): string {
  return queueViewModel.getAlbumCoverUrl(albumArtist, album)
}

async function handleSkipTrack() {
  await skipTrack()
}

// ライフサイクル
onMounted(() => {
  if (guildId) {
    queueViewModel.connect(guildId)
  }
})

onUnmounted(() => {
  queueViewModel.disconnect()
})

// テンプレートで使用するプロパティ
const queueItems = queueViewModel.queueItems
const isOpen = queueViewModel.isOpen
const pendingTrackCount = queueViewModel.pendingTrackCount
const playbackStatus = queueViewModel.playbackStatus
const formattedCurrentTime = queueViewModel.formattedCurrentTime
const formattedTotalTime = queueViewModel.formattedTotalTime
const playbackProgress = queueViewModel.playbackProgress
const togglePanel = queueViewModel.togglePanel.bind(queueViewModel)
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
