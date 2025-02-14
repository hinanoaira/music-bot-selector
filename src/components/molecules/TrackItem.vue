<template>
  <div class="track-item">
    <button @click="requestTrack">リクエスト</button>
    <span>{{ track.title }}</span>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

interface Track {
  id: number
  title: string
}

const props = defineProps<{
  track: Track
}>()

const emits = defineEmits<{
  (e: 'request-track', trackId: number): void
}>()

function requestTrack() {
  emits('request-track', props.track.id)
}
</script>

<style scoped>
.track-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #fff;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.track-item button {
  margin-left: auto;
}
</style>
