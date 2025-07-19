<template>
  <div class="artist-list">
    <BaseText tag="h2" variant="heading">
      アーティスト一覧
    </BaseText>
    <BaseList>
      <ListItem v-for="artist in artists" :key="artist" clickable @click="$emit('selectArtist', artist)">
        <BaseText tag="span" variant="body">
          {{ artist }}
        </BaseText>
      </ListItem>
    </BaseList>
  </div>
</template>

<script lang="ts" setup>
import BaseText from '@/components/atoms/BaseText.vue'
import BaseList from '@/components/atoms/BaseList.vue'
import ListItem from '@/components/molecules/ListItem.vue'

interface Props {
  artists: string[]
}

defineProps<Props>()
defineEmits<{
  selectArtist: [artist: string]
}>()
</script>

<style scoped>
.artist-list {
  height: 100%;
}
</style>
