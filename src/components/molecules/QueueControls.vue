<template>
  <ListItem variant="control">
    <BaseButton variant="danger" :disabled="disabled" @click="$emit('skip')"> スキップ </BaseButton>
    <BaseText tag="span" variant="body"> 現在のリクエスト数: {{ pendingCount }} </BaseText>
  </ListItem>
</template>

<script lang="ts" setup>
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseText from '@/components/atoms/BaseText.vue'
import ListItem from '@/components/molecules/ListItem.vue'

interface Props {
  pendingCount: number
  disabled: boolean
}

defineProps<Props>()
defineEmits<{
  skip: []
}>()
</script>

<style scoped></style>
