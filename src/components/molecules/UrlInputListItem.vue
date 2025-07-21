<template>
  <BaseListItem :variant="variant">
    <BaseButton :variant="buttonVariant" :disabled="!url || disabled" @click="handleRequest">
      {{ actionText }}
    </BaseButton>
    <BaseInput
      v-model="localUrl"
      :placeholder="disabled ? processingText : placeholderText"
      :disabled="disabled"
      :style="inputStyle"
      @keydown.enter.prevent="handleEnterKey"
    />
  </BaseListItem>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseListItem from '@/components/atoms/BaseListItem.vue'

interface Props {
  url: string
  actionText?: string
  placeholderText?: string
  processingText?: string
  variant?: 'default' | 'track' | 'queue' | 'control'
  buttonVariant?: 'primary' | 'secondary' | 'danger' | 'back' | 'icon'
  inputStyle?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  actionText: 'Submit',
  placeholderText: 'Enter URL...',
  processingText: 'Processing...',
  variant: 'default',
  buttonVariant: 'primary',
  inputStyle: 'width: 70%',
  disabled: false,
})

const emit = defineEmits<{
  'update:url': [value: string]
  request: [url: string]
}>()

const localUrl = ref(props.url)

watch(
  () => props.url,
  (newValue) => {
    localUrl.value = newValue
  },
)

watch(localUrl, (newValue) => {
  emit('update:url', newValue)
})

const handleRequest = () => {
  if (localUrl.value && !props.disabled) {
    emit('request', localUrl.value)
    localUrl.value = ''
  }
}

const handleEnterKey = () => {
  if (localUrl.value && !props.disabled) {
    handleRequest()
  }
}
</script>

<style scoped></style>
