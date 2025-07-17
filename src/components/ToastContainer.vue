<template>
  <teleport to="body">
    <div class="toast-container">
      <transition-group name="toast" tag="div">
        <div v-for="toast in toasts" :key="toast.id" :class="['toast', `toast--${toast.type}`]"
          @click="removeToast(toast.id)">
          <div class="toast__icon">
            <span v-if="toast.type === 'success'">✓</span>
            <span v-else-if="toast.type === 'error'">✗</span>
            <span v-else-if="toast.type === 'warning'">⚠</span>
            <span v-else>ℹ</span>
          </div>
          <div class="toast__message">{{ toast.message }}</div>
          <button class="toast__close" @click.stop="removeToast(toast.id)">
            ×
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { useToastStore } from '@/stores/toast'

const { toasts, removeToast } = useToastStore()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

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
  font-size: 18px;
  font-weight: bold;
}

.toast__message {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
}

.toast__close {
  margin-left: 12px;
  background: none;
  border: none;
  color: inherit;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.toast__close:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.2);
}

/* アニメーション */
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
