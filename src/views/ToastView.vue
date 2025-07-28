<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast" tag="div" class="toast-list">
        <div
          v-for="toast in toastMessages"
          :key="toast.id"
          :class="['toast-item', `toast-item--${toast.type}`]"
          @click="handleRemoveToast(toast.id)"
        >
          <div class="toast-content">
            <BaseIcon :type="viewModel.getIconType(toast.type)" class="toast-icon" />
            <span class="toast-message">{{ toast.message }}</span>
          </div>
          <button class="toast-close" @click.stop="handleRemoveToast(toast.id)" aria-label="閉じる">
            <BaseIcon type="close" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ToastViewModel } from '@/viewmodels/ToastViewModel'
import BaseIcon from '@/components/atoms/BaseIcon.vue'

const viewModel = new ToastViewModel()

const toastMessages = viewModel.toastMessages

/**
 * トーストを削除
 */
const handleRemoveToast = (id: string): void => {
  viewModel.removeToast(id)
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.toast-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 400px;
}

.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 300px;
}

.toast-item:hover {
  transform: translateX(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.toast-item--success {
  background: rgba(34, 197, 94, 0.9);
  color: white;
  border-left: 4px solid #16a34a;
}

.toast-item--error {
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border-left: 4px solid #dc2626;
}

.toast-item--warning {
  background: rgba(245, 158, 11, 0.9);
  color: white;
  border-left: 4px solid #d97706;
}

.toast-item--info {
  background: rgba(59, 130, 246, 0.9);
  color: white;
  border-left: 4px solid #2563eb;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.toast-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.toast-message {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.toast-close svg {
  width: 16px;
  height: 16px;
}

/* トランジション */
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

/* レスポンシブ */
@media (max-width: 480px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }

  .toast-list {
    max-width: none;
  }

  .toast-item {
    min-width: auto;
  }
}
</style>
