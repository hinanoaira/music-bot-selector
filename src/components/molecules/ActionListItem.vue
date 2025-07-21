<template>
  <BaseListItem :variant="variant">
    <BaseButton :variant="buttonVariant" :disabled="disabled" @click="$emit('action')">
      {{ actionText }}
    </BaseButton>
    <BaseText tag="span" variant="body">
      {{ label }}
    </BaseText>
  </BaseListItem>
</template>

<script lang="ts" setup>
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseText from '@/components/atoms/BaseText.vue'
import BaseListItem from '@/components/atoms/BaseListItem.vue'

interface Props {
  label: string
  actionText: string
  variant?: 'default' | 'track' | 'queue' | 'control'
  buttonVariant?: 'primary' | 'secondary' | 'danger' | 'back' | 'icon'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  buttonVariant: 'primary',
  disabled: false,
})

defineEmits<{
  action: []
}>()
</script>

<style scoped>
:deep(.base-button) {
  white-space: nowrap;
  flex-shrink: 0;
  min-width: fit-content;
}

:deep(.list-item--track) {
  flex-wrap: nowrap;
}
</style>
