<template>
  <ListItem variant="track">
    <BaseButton variant="primary" :disabled="!url || disabled" @click="handleRequest">
      リクエスト
    </BaseButton>
    <BaseInput
      v-model="localUrl"
      :placeholder="disabled ? 'リクエスト処理中...' : 'URLを入力...'"
      :disabled="disabled"
      style="width: 70%"
      @keydown.enter.prevent="handleEnterKey"
    />
  </ListItem>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import ListItem from '@/components/molecules/ListItem.vue'

interface Props {
  url: string
  disabled?: boolean
}

const props = defineProps<Props>()
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

<style scoped>
/* ListItemのvariant="track"でスタイリング */
</style>
