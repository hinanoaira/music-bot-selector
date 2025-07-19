<template>
  <li :class="[
    'list-item',
    `list-item--${variant}`,
    {
      'list-item--clickable': clickable,
      'list-item--current': current
    }
  ]" @click="clickable && $emit('click')">
    <slot />
  </li>
</template>

<script lang="ts" setup>
interface Props {
  variant?: 'default' | 'track' | 'queue' | 'control'
  clickable?: boolean
  current?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  clickable: false,
  current: false
})

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.list-item {
  margin-bottom: 8px;
  border-radius: 4px;
  padding: 4px;
  border: 1px solid #ccc;
}

.list-item--clickable {
  cursor: pointer;
}

.list-item--clickable:hover {
  background-color: #eee;
}

.list-item--track,
.list-item--queue,
.list-item--control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.list-item--queue {
  padding-bottom: 8px;
  border-bottom: 1px solid #ccc;
  border: none;
  border-radius: 0;
}

.list-item--control {
  padding-bottom: 8px;
  border-bottom: 1px solid #ccc;
  border: none;
  border-radius: 0;
}

.list-item--current {
  background-color: #ffd;
}
</style>
