<template>
  <div class="playback-info">
    <BaseText tag="div" variant="caption" class="time-display">
      {{ formattedCurrentTime }} / {{ formattedTotalTime }}
    </BaseText>
    <ProgressBar :progress="progress" />
  </div>
</template>

<script lang="ts" setup>
import BaseText from '@/components/atoms/BaseText.vue'
import ProgressBar from '@/components/atoms/ProgressBar.vue'

interface Props {
  formattedCurrentTime: string
  formattedTotalTime: string
  progress: number
}

defineProps<Props>()
</script>

<style scoped>
.playback-info {
  background-color: #f0f0f0;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.time-display {
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
  color: #333;
}
</style>
