<template>
  <div class="queue-header" @click="$emit('toggle')">
    <BaseIcon type="music" size="16px" />
    <BaseText tag="span" variant="inherit"> Current Queue </BaseText>
    <BaseIcon type="music" size="16px" />
  </div>
</template>

<script lang="ts" setup>
import BaseIcon from '@/components/atoms/BaseIcon.vue'
import BaseText from '@/components/atoms/BaseText.vue'

defineEmits<{
  toggle: []
}>()
</script>

<style scoped>
.queue-header {
  background-color: #333;
  color: #fff;
  padding: 8px;
  text-align: center;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.queue-header:hover {
  background-color: #555;
}
</style>
