<template>
  <ul>
    <li v-for="album in albums" :key="album.id" @click="() => handleClick(album.id)">
      {{ album.title }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

interface Album {
  id: number
  title: string
}

const props = defineProps<{
  albums: Album[]
}>()

const emits = defineEmits<{
  (e: 'select-album', id: number): void
}>()

function handleClick(albumId: number) {
  emits('select-album', albumId)
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
