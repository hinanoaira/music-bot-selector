<template>
  <BaseListItem :variant="variant" clickable @click="$emit('click')">
    <BaseImage :src="imageUrl" :alt="imageAlt" :size="imageSize" class="content-image" />
    <BaseText tag="span" variant="body" class="content-title">
      {{ title }}
    </BaseText>
  </BaseListItem>
</template>

<script lang="ts" setup>
import BaseImage from '@/components/atoms/BaseImage.vue'
import BaseText from '@/components/atoms/BaseText.vue'
import BaseListItem from '@/components/atoms/BaseListItem.vue'

interface Props {
  title: string
  imageUrl: string
  imageAlt?: string
  imageSize?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'track' | 'queue' | 'control'
}

withDefaults(defineProps<Props>(), {
  imageAlt: 'Content image',
  imageSize: 'medium',
  variant: 'default',
})

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.content-image {
  flex-shrink: 0;
}

.content-title {
  flex: 1;
}
</style>
