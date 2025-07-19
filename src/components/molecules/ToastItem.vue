<template>
  <div :class="['toast', `toast--${type}`]" @click="$emit('click')">
    <BaseIcon :type="type" size="18px" class="toast__icon" />
    <BaseText tag="div" variant="body" class="toast__message">
      {{ message }}
    </BaseText>
    <BaseButton variant="icon" class="toast__close" @click.stop="$emit('close')">
      <BaseIcon type="close" size="18px" />
    </BaseButton>
  </div>
</template>

<script lang="ts" setup>
import BaseIcon from '@/components/atoms/BaseIcon.vue'
import BaseText from '@/components/atoms/BaseText.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

interface Props {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

defineProps<Props>()
defineEmits<{
  click: []
  close: []
}>()
</script>

<style scoped>
.toast {
  display: flex;
  align-items: center;
  min-width: 300px;
  max-width: 500px;
  margin-bottom: 10px;
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  pointer-events: all;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toast--success {
  background-color: rgba(34, 197, 94, 0.9);
  color: white;
}

.toast--error {
  background-color: rgba(239, 68, 68, 0.9);
  color: white;
}

.toast--warning {
  background-color: rgba(245, 158, 11, 0.9);
  color: white;
}

.toast--info {
  background-color: rgba(59, 130, 246, 0.9);
  color: white;
}

.toast__icon {
  margin-right: 12px;
  flex-shrink: 0;
}

.toast__message {
  flex: 1;
  line-height: 1.4;
  color: white;
}

.toast__close {
  margin-left: 12px;
  width: 20px;
  height: 20px;
}
</style>
