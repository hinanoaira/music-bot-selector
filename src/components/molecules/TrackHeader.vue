<template>
  <div class="track-header">
    <AlbumCover :src="coverUrl" :alt="`${albumName} album cover`" size="large" />
    <BaseText tag="h2" variant="subheading">
      {{ albumName }} のトラック
    </BaseText>
  </div>
</template>

<script lang="ts" setup>
import AlbumCover from '@/components/atoms/AlbumCover.vue'
import BaseText from '@/components/atoms/BaseText.vue'

interface Props {
  albumName: string
  coverUrl: string
}

defineProps<Props>()
</script>

<style scoped>
.track-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}
</style>
