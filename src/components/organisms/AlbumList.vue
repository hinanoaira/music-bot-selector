<template>
  <div class="album-list">
    <BaseButton variant="back" @click="$emit('back')"> アーティスト一覧に戻る </BaseButton>

    <BaseText tag="h2" variant="heading"> {{ artistName }} のアルバム一覧 </BaseText>

    <BaseList>
      <AlbumItem
        v-for="album in albums"
        :key="album"
        :album-name="album"
        :cover-url="getAlbumCoverUrl(artistName, album)"
        @click="$emit('selectAlbum', album)"
      />
    </BaseList>
  </div>
</template>

<script lang="ts" setup>
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseText from '@/components/atoms/BaseText.vue'
import BaseList from '@/components/atoms/BaseList.vue'
import AlbumItem from '@/components/molecules/AlbumItem.vue'

interface Props {
  artistName: string
  albums: string[]
  getAlbumCoverUrl: (artist: string, album: string) => string
}

defineProps<Props>()
defineEmits<{
  back: []
  selectAlbum: [album: string]
}>()
</script>

<style scoped>
.album-list {
  height: 100%;
}
</style>
