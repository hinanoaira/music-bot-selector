<template>
  <ul>
    <li v-for="track in tracks" :key="track.id">
      {{ track.title }}
      <button @click="request(track.id)">リクエスト</button>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

interface Track {
  id: number
  title: string
}

const props = defineProps<{
  tracks: Track[]
}>()

const emits = defineEmits<{
  (e: 'request-track', trackId: number): void
}>()

function request(trackId: number) {
  emits('request-track', trackId)
}
</script>

<style scoped>
ul {
  list-style: none;
  padding-left: 0;
}

li {
  padding: 4px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 4px;
}
</style>
