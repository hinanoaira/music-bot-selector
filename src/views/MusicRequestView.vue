<template>
  <div class="music-request-page">
    <!-- 左ペイン：アーティスト一覧 -->
    <div class="left-pane">
      <h2>アーティスト一覧</h2>
      <ul>
        <li v-for="artist in artists" :key="artist" @click="selectArtist(artist)">
          {{ artist }}
        </li>
      </ul>
    </div>

    <!-- 右ペイン：アルバム / トラック -->
    <div class="right-pane">
      <!-- 1) アーティスト未選択時 -->
      <template v-if="!selectedArtist">
        <template v-if="isMobile">
          <h2>アーティスト一覧</h2>
          <ul>
            <li v-for="artist in artists" :key="artist" @click="selectArtist(artist)">
              {{ artist }}
            </li>
          </ul>
        </template>
        <template v-else>
          <p>アーティストを選んでください</p>
        </template>
      </template>

      <!-- 2) アーティスト選択済み & アルバム未選択 → アルバム一覧 -->
      <template v-else-if="selectedArtist && !selectedAlbum">
        <!-- アーティスト一覧に戻るボタン -->
        <button class="back-button" @click="$router.go(-1)">
          アーティスト一覧に戻る
        </button>

        <h2>{{ selectedArtist }} のアルバム一覧</h2>
        <ul>
          <li v-for="album in albums" :key="album" @click="selectAlbum(album)" class="album-item">
            <!-- アルバムジャケット -->
            <img class="album-cover" :src="getAlbumCoverUrl(selectedArtist, album)" alt="Album cover" />
            <span class="album-name">{{ album }}</span>
          </li>
        </ul>
      </template>

      <!-- 3) アルバム選択済み → トラック一覧 -->
      <template v-else-if="selectedAlbum">
        <!-- アルバム一覧に戻るボタン -->
        <button class="back-button" @click="$router.go(-1)">
          アルバム一覧に戻る
        </button>

        <!-- ここで、アルバムジャケットを表示する -->
        <div class="track-header">
          <img class="album-cover-large" :src="getAlbumCoverUrl(selectedArtist, selectedAlbum)" alt="Album cover" />
          <h2>{{ selectedAlbum }} のトラック</h2>
        </div>

        <!-- トラック一覧 -->
        <ul>
          <li v-for="track in tracks" :key="track">
            <button @click="requestTrack(track)" :disabled="!guildId">リクエスト</button>
            {{ track }}
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useMusicViewModel } from '@/composables/useMusicViewModel'
import { useGuildParam } from '@/composables/useGuildParam'

const { guildId } = useGuildParam()

const {
  artists,
  albums,
  tracks,
  selectedArtist,
  selectedAlbum,
  init,
  selectArtist,
  selectAlbum,
  requestTrack,
  getAlbumCoverUrl,
} = useMusicViewModel()

const isMobile = ref(window.innerWidth <= 700)

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 700
}

const onPopState = (event: PopStateEvent) => {
  const state = event.state
  if (state) {
    switch (state.stage) {
      case 'albumSelected':
        break
      case 'artistSelected':
        selectedAlbum.value = null
        tracks.value = []
        if (selectedArtist.value !== state.artist) {
          selectArtist(state.artist, false)
        }
        break
      default:
        selectedArtist.value = null
        albums.value = []
        break
    }
    setTimeout(() => {
      const rightPane = document.querySelector('.right-pane')
      if (rightPane) rightPane.scrollTop = state.rightScroll ?? 0
    }, 0)
  } else {
    selectedAlbum.value = null
    tracks.value = []
    selectedArtist.value = null
    albums.value = []
  }
}


onMounted(() => {
  init()
  window.addEventListener('resize', updateIsMobile)
  window.addEventListener('popstate', onPopState)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})
</script>

<style scoped>
.music-request-page {
  display: flex;
  width: 100%;
  height: 100%;
  /* 親 (.main)が calc(100% - ヘッダー＆フッター) なので、その100%を埋める */
}

/* 左ペイン */
.left-pane {
  width: 320px;
  padding: 16px;
  box-sizing: border-box;
  background-color: #f8f8f8;
  border-right: 1px solid #ccc;
  height: 100%;
  overflow-y: auto;
}

/* 右ペイン */
.right-pane {
  flex: 1;
  padding: 16px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
}

/* リスト系共通スタイル */
ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

li {
  cursor: pointer;
  margin-bottom: 8px;
  border-radius: 4px;
  padding: 4px;
  border: 1px solid #ccc;
}

li:hover {
  background-color: #eee;
}

/* アルバム一覧アイテム */
.album-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.album-cover {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
}

.album-name {
  flex: 1;
}

/* トラック一覧で使うヘッダー */
.track-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.album-cover-large {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.back-button {
  margin-bottom: 16px;
  padding: 4px 8px;
  cursor: pointer;
}

button {
  margin-left: 8px;
}

/* レスポンシブ対応：スマホ画面では左ペインを非表示に */
@media (max-width: 700px) {
  .left-pane {
    display: none;
  }
}
</style>
