<template>
  <ListItem variant="track">
    <BaseButton variant="primary" :disabled="disabled" @click="$emit('request')">
      リクエスト
    </BaseButton>
    <BaseText tag="span" variant="body">
      {{ trackName }}
    </BaseText>
  </ListItem>
</template>

<script lang="ts" setup>
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseText from '@/components/atoms/BaseText.vue'
import ListItem from '@/components/molecules/ListItem.vue'

interface Props {
  trackName: string
  disabled?: boolean
}

defineProps<Props>()
defineEmits<{
  request: []
}>()
</script>

<style scoped>
/* ListItemのvariant="track"でスタイリング */
</style>
