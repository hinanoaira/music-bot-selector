<template>
  <div>
    <h2>Tracks in {{ albumTitle }}</h2>
    <TrackList :tracks="tracks" @request-track="handleRequestTrack" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TrackList from '@/components/organisms/TrackList.vue'

interface Track {
  id: number
  title: string
}

const route = useRoute()
const artistId = route.params.artistId as string
const albumId = route.params.albumId as string

// サンプルデータ
const tracks = ref<Track[]>([
  { id: 1001, title: 'Track 1' },
  { id: 1002, title: 'Track 2' }
])

// アルバム名を計算する例（実際はAPIで取得など）
const albumTitle = computed(() => {
  if (albumId === '101') return 'Album A1'
  if (albumId === '102') return 'Album A2'
  return 'Unknown Album'
})

onMounted(() => {
  // albumId, artistId などを元にAPIからトラック情報を取得するなど
  // tracks.value = fetchTracks(...)
})

// TrackList からのイベントを受け取り、実際のリクエスト処理を行う
function handleRequestTrack(trackId: number) {
  console.log('Request track with ID:', trackId)
  // ここでAPIへリクエストしたり、Vuex/Piniaのストアに書き込むなどの処理を実装
}
</script>
