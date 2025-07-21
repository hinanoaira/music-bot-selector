<template>
  <div class="progress-bar">
    <div class="progress-fill" :style="{ width: progress + '%' }"></div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  progress: number
}

defineProps<Props>()
</script>

<style scoped>
.progress-bar {
  width: 100%;
  height: 4px;
  background-color: #ddd;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}
</style>
