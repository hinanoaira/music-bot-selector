<template>
  <div>
    <h2>Artist List</h2>
    <ArtistList :artists="artists" @select-artist="goToAlbum" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ArtistList from '@/components/organisms/ArtistList.vue'

interface Artist {
  id: number
  name: string
}

const router = useRouter()

// サンプルデータ
const artists = ref<Artist[]>([
  { id: 1, name: 'Artist A' },
  { id: 2, name: 'Artist B' }
])

function goToAlbum(artistId: number) {
  router.push({ name: 'AlbumList', params: { artistId } })
}
</script>
