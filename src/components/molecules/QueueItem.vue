<template>
  <ListItem variant="queue" :current="isCurrent">
    <AlbumCover :src="coverUrl" :alt="`${title} album cover`" size="small" class="cover-thumb" />

    <div class="info">
      <BaseText tag="div" variant="body" class="title">
        {{ title }}
        <BaseIcon v-if="isCurrent" type="music" size="12px" class="now-playing" />
      </BaseText>
      <BaseText tag="div" variant="caption" class="meta"> {{ artist }} / {{ album }} </BaseText>
    </div>
  </ListItem>
</template>

<script lang="ts" setup>
import AlbumCover from '@/components/atoms/AlbumCover.vue'
import BaseText from '@/components/atoms/BaseText.vue'
import BaseIcon from '@/components/atoms/BaseIcon.vue'
import ListItem from '@/components/molecules/ListItem.vue'

interface Props {
  title: string
  artist: string
  album: string
  coverUrl: string
  isCurrent: boolean
}

defineProps<Props>()
</script>

<style scoped>
.cover-thumb {
  flex-shrink: 0;
}

.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.title {
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
}

.now-playing {
  color: red;
}

.meta {
  color: #666;
}
</style>
