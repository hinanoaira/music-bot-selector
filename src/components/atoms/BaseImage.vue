<template>
  <img :class="['base-image', `base-image--${size}`]" :src="src" :alt="alt" />
</template>

<script lang="ts" setup>
interface Props {
  src: string
  alt?: string
  size?: 'small' | 'medium' | 'large'
}

withDefaults(defineProps<Props>(), {
  alt: 'Image',
  size: 'medium',
})
</script>

<style scoped>
.base-image {
  object-fit: cover;
  border-radius: 4px;
}

.base-image--small {
  width: 48px;
  height: 48px;
}

.base-image--medium {
  width: 48px;
  height: 48px;
}

.base-image--large {
  width: 80px;
  height: 80px;
}
</style>
