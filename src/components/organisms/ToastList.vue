<template>
  <div class="toast-container">
    <transition-group name="toast" tag="div">
      <ToastItem
        v-for="toast in toasts"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
        @click="$emit('removeToast', toast.id)"
        @close="$emit('removeToast', toast.id)"
      />
    </transition-group>
  </div>
</template>

<script lang="ts" setup>
import ToastItem from '@/components/molecules/ToastItem.vue'
import type { ToastMessage } from '@/stores/toast.store'

interface Props {
  toasts: ToastMessage[]
}

defineProps<Props>()
defineEmits<{
  removeToast: [id: string]
}>()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
