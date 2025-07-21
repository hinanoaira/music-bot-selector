<template>
  <div class="content-header">
    <BaseImage :src="imageUrl" :alt="imageAlt" :size="imageSize" class="content-image" />
    <BaseText :tag="titleTag" :variant="titleVariant">
      {{ title }}
    </BaseText>
  </div>
</template>

<script lang="ts" setup>
import BaseImage from '@/components/atoms/BaseImage.vue'
import BaseText from '@/components/atoms/BaseText.vue'

interface Props {
  title: string
  imageUrl: string
  imageAlt?: string
  imageSize?: 'small' | 'medium' | 'large'
  titleTag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  titleVariant?: 'heading' | 'subheading' | 'body' | 'caption' | 'inherit'
}

withDefaults(defineProps<Props>(), {
  imageAlt: 'Content image',
  imageSize: 'large',
  titleTag: 'h2',
  titleVariant: 'subheading',
})
</script>

<style scoped>
.content-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.content-image {
  flex-shrink: 0;
}
</style>
