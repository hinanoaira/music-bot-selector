<template>
  <button
    :class="['base-button', `base-button--${variant}`, { 'base-button--disabled': disabled }]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'back' | 'icon'
  disabled?: boolean
}

defineProps<Props>()
defineEmits<{
  click: []
}>()
</script>

<style scoped>
.base-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.base-button--primary {
  background-color: #007bff;
  color: white;
}

.base-button--primary:hover:not(.base-button--disabled) {
  background-color: #0056b3;
}

.base-button--secondary {
  background-color: #6c757d;
  color: white;
}

.base-button--secondary:hover:not(.base-button--disabled) {
  background-color: #545b62;
}

.base-button--danger {
  background-color: #dc3545;
  color: white;
}

.base-button--danger:hover:not(.base-button--disabled) {
  background-color: #c82333;
}

.base-button--back {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
  margin-bottom: 16px;
}

.base-button--back:hover:not(.base-button--disabled) {
  background-color: #e9ecef;
}

.base-button--icon {
  background: none;
  border: none;
  color: inherit;
  padding: 0;
  min-width: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0.7;
  transition:
    opacity 0.2s,
    background-color 0.2s;
}

.base-button--icon:hover:not(.base-button--disabled) {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.5);
}

.base-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
