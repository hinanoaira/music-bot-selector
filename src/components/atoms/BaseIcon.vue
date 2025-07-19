<template>
  <span :class="['base-icon']" :style="{ fontSize: size }">
    {{ iconText }}
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  type: 'success' | 'error' | 'warning' | 'info' | 'music' | 'close'
  size?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: '16px',
})

const iconText = computed(() => {
  switch (props.type) {
    case 'success':
      return '✓'
    case 'error':
      return '✗'
    case 'warning':
      return '⚠'
    case 'info':
      return 'ℹ'
    case 'music':
      return '♪'
    case 'close':
      return '×'
    default:
      return '?'
  }
})
</script>

<style scoped>
.base-icon {
  display: inline-block;
  font-weight: bold;
  color: inherit;
}

.base-icon--music {
  color: inherit;
}

.base-icon--close {
  color: inherit;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.base-icon--close:hover {
  opacity: 1;
}
</style>
