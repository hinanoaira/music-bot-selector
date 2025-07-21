<template>
  <SelectableList title="アーティスト一覧" :items="artists" @select-item="handleSelectArtist" />
</template>

<script lang="ts" setup>
import SelectableList from '@/components/molecules/SelectableList.vue'

interface Props {
  artists: string[]
}

defineProps<Props>()
const emit = defineEmits<{
  selectArtist: [artist: string]
}>()

const handleSelectArtist = (item: unknown) => {
  emit('selectArtist', item as string)
}
</script>

<style scoped>
.artist-list {
  height: 100%;
}
</style>
