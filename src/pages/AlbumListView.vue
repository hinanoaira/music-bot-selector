<template>
  <div>
    <h2>Albums of {{ artistName }}</h2>
    <AlbumList :albums="albums" @select-album="goToTrack" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AlbumList from '@/components/organisms/AlbumList.vue'

interface Album {
  id: number
  title: string
}

const route = useRoute()
const router = useRouter()

// パラメータからアーティストIDを取得
const artistId = route.params.artistId as string

// アルバムのサンプルデータ
const albums = ref<Album[]>([
  { id: 101, title: 'Album A1' },
  { id: 102, title: 'Album A2' }
])

// アーティスト名は artistId に応じて動的に取得する想定
// ここではサンプルとして簡易的に返す
const artistName = computed(() => {
  if (artistId === '1') return 'Artist A'
  if (artistId === '2') return 'Artist B'
  return 'Unknown Artist'
})

// トラック画面へ遷移
function goToTrack(albumId: number) {
  router.push({
    name: 'TrackList',
    params: {
      artistId,
      albumId
    }
  })
}

// 必要に応じて onMounted でAPI取得等
onMounted(() => {
  // データフェッチなど
})
</script>
