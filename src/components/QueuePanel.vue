<template>
  <div class="queue-panel" :class="{ 'is-open': isOpen }">
    <!-- ヘッダー部分（クリックで開閉） -->
    <div class="queue-header" @click="toggleOpen">
      <span>♪ Current Queue ♪</span>
    </div>

    <!-- スライドアップのアニメーション -->
    <transition name="slide-up">
      <!-- isOpen のときだけ中身を表示 -->
      <div v-if="isOpen" class="queue-body">
        <ul>
          <li>
            <button class="skip-button" @click.stop="skipTrack" :disabled="queueList.length === 0">
              スキップ
            </button>
            現在のリクエスト数: {{queueList.filter(e => !e.isCurrent).length}}
          </li>
          <!-- queueList の各要素を表示 -->
          <li v-for="(item, index) in queueList" :key="index" :class="{ current: item.isCurrent }">
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useGuildParam } from '@/composables/useGuildParam'

const { guildId } = useGuildParam()

/**
 * QueueItem の型定義
 */
interface QueueItem {
  index: number
  artist: string
  album: string
  title: string
  albumArtist: string
  isCurrent: boolean
}

/**
 * BASE_URL
 */
const BASE_URL = 'https://msbot-api.home.hinasense.jp'

/**
 * 開閉状態
 */
const isOpen = ref(false)

/**
 * キュー一覧
 */
const queueList = ref<QueueItem[]>([])

/**
 * WebSocketインスタンス
 */
let ws: WebSocket | null = null

onMounted(() => {
  if (!guildId.value) {
    console.warn('No guildId. WebSocket connection disabled')
    return
  }
  // guildIdをクエリパラメータで送信
  const wsUrl = `wss://msbot-api.home.hinasense.jp?guildid=${encodeURIComponent(guildId.value)}`
  ws = new WebSocket(wsUrl)
  ws.onopen = () => {
    // 何も送信しない（サーバーがprotocolでguildIdを受け取る想定）
  }
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      // 受信データが配列ならqueueListに反映
      queueList.value = data.data;
    } catch (err) {
      console.error('WebSocket message parse error:', err)
    }
  }
  ws.onerror = (err) => {
    console.error('WebSocket error:', err)
  }
  ws.onclose = () => {
    console.warn('WebSocket closed')
  }
})

onUnmounted(() => {
  if (ws) {
    ws.close()
    ws = null
  }
})

// fetchQueueはWebSocket化により不要になったため削除

/**
 * パネルの開閉を切り替え
 */
function toggleOpen() {
  isOpen.value = !isOpen.value
}

/**
 * ジャケットURLを組み立て
 */
function getCoverUrl(albumArtist: string, album: string): string {
  const encodedAlbumArtist = encodeURIComponent(albumArtist);
  const encodedAlbum = encodeURIComponent(album);
  return `${BASE_URL}/cover/${encodedAlbumArtist}/${encodedAlbum}`
}

/**
 * スキップボタン押下時の処理
 */
async function skipTrack() {
  if (!guildId.value) {
    console.warn('No guildId. Skip disabled')
    return
  }
  try {
    const res = await fetch(`${BASE_URL}/skip`, {
      method: 'GET',
      headers: {
        guildid: guildId.value,
      },
    })
    if (!res.ok) {
      throw new Error(`Skip request failed: ${res.statusText}`)
    }
    console.log('スキップ成功')
    // WebSocket経由で自動反映されるためfetchQueue不要
  } catch (error) {
    console.error('スキップ失敗:', error)
  }
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
