<template>
  <ul>
    <li v-for="artist in artists" :key="artist.id" @click="() => handleClick(artist.id)">
      {{ artist.name }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

interface Artist {
  id: number
  name: string
}

const props = defineProps<{
  artists: Artist[]
}>()

const emits = defineEmits<{
  (e: 'select-artist', id: number): void
}>()

function handleClick(artistId: number) {
  emits('select-artist', artistId)
}
</script>

<style scoped>
ul {
  list-style: none;
  padding-left: 0;
}

li {
  cursor: pointer;
  padding: 8px;
  border: 1px solid #ccc;
  margin-bottom: 8px;
  border-radius: 4px;
}

li:hover {
  background-color: #eee;
}
</style>
