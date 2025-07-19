<template>
  <ListItem variant="track" clickable @click="$emit('click')">
    <AlbumCover :src="coverUrl" :alt="`${albumName} album cover`" size="medium" />
    <BaseText tag="span" variant="body" class="album-name">
      {{ albumName }}
    </BaseText>
  </ListItem>
</template>

<script lang="ts" setup>
import AlbumCover from '@/components/atoms/AlbumCover.vue'
import BaseText from '@/components/atoms/BaseText.vue'
import ListItem from '@/components/molecules/ListItem.vue'

interface Props {
  albumName: string
  coverUrl: string
}

defineProps<Props>()
defineEmits<{
  click: []
}>()
</script>

<style scoped>
.album-name {
  flex: 1;
}
</style>
