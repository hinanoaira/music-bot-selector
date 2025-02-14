<template>
  <div class="artist-item" @click="onClick">
    {{ artist.name }}
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

interface Artist {
  id: number
  name: string
}

const props = defineProps<{
  artist: Artist
}>()

const emits = defineEmits<{
  (e: 'click-artist', id: number): void
}>()

function onClick() {
  emits('click-artist', props.artist.id)
}
</script>

<style scoped>
.artist-item {
  cursor: pointer;
  padding: 8px;
  border: 1px solid #ccc;
  margin-bottom: 8px;
  border-radius: 4px;
}

.artist-item:hover {
  background-color: #f0f0f0;
}
</style>
