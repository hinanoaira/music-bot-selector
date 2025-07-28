<template>
  <NavigableList
    :title="`${artistName} のアルバム一覧`"
    :items="albums"
    back-button-text="アーティスト一覧に戻る"
    :get-item-label="getItemLabel"
    :get-item-image="getItemImage"
    @back="$emit('back')"
    @select-item="handleSelectAlbum"
  >
    <template #item="{ item, selectItem }">
      <ContentCard
        :title="item as string"
        :image-url="props.getAlbumCoverUrl(props.artistName, item as string)"
        :image-alt="`${item} album cover`"
        variant="track"
        @click="selectItem(item)"
      />
    </template>
  </NavigableList>
</template>

<script lang="ts" setup>
import NavigableList from './NavigableList.vue'
import ContentCard from '@/components/molecules/ContentCard.vue'

interface Props {
  artistName: string
  albums: string[]
  getAlbumCoverUrl: (artist: string, album: string) => string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  back: []
  selectAlbum: [album: string]
}>()

const getItemLabel = (album: unknown): string => album as string
const getItemImage = (album: unknown): string =>
  props.getAlbumCoverUrl(props.artistName, album as string)

const handleSelectAlbum = (item: unknown) => {
  emit('selectAlbum', item as string)
}
</script>

<style scoped>
.album-list {
  height: 100%;
}
</style>
