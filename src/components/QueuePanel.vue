<template>
  <div class="queue-panel" :class="{ 'is-open': isOpen }">
    <!-- ヘッダー部分（クリックで開閉） -->
    <div v-if="true" class="queue-header" @click="togglePanel">
      <span>♪ Current Queue ♪</span>
    </div>
    <!-- スライドアップのアニメーション -->
    <transition name="slide-up">
      <!-- isOpen のときだけ中身を表示 -->
      <div v-if="isOpen" class="queue-body">
        <!-- 再生時間情報 -->
        <div v-if="playbackStatus" class="playback-info">
          <div class="time-display">
            {{ formattedCurrentTime }} / {{ formattedTotalTime }}
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: playbackProgress + '%' }"></div>
          </div>
        </div>

        <ul>
          <li>
            <button class="skip-button" @click.stop="handleSkipTrack" :disabled="queueItems.length === 0">
              スキップ
            </button>
            現在のリクエスト数: {{ pendingTrackCount }}
          </li>
          <!-- queueItems の各要素を表示 -->
          <li v-for="(item, index) in queueItems" :key="index" :class="{ current: item.isCurrent }">
            <!-- ジャケットサムネイル -->
            <img class="cover-thumb" :src="getCoverUrl(item.albumArtist, item.album)" alt="Album cover" />

            <div class="info">
              <div class="title">
                {{ item.title }}
                <span v-if="item.isCurrent" class="now-playing"></span>
              </div>
              <div class="meta">
                {{ item.artist }} / {{ item.album }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useQueueViewModel } from '@/composables/useQueueViewModel'

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

.queue-header {
  background-color: #333;
  color: #fff;
  padding: 8px;
  text-align: center;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
}

.queue-body {
  padding: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.playback-info {
  background-color: #f0f0f0;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.time-display {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
  color: #333;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: #ddd;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ccc;
  display: flex;
  /* ジャケット + 情報 + スキップボタン を横並び */
  gap: 8px;
}

li.current {
  background-color: #ffd;
}

.cover-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title {
  font-weight: bold;
}

.now-playing {
  color: red;
  margin-left: 4px;
}

.meta {
  font-size: 0.9em;
  color: #666;
}

.skip-button {
  align-self: center;
  background-color: #f66;
  border: none;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.skip-button:hover {
  background-color: #c00;
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
