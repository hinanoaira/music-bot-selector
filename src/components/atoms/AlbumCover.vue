<template>
  <img :class="['album-cover', `album-cover--${size}`]" :src="src" :alt="alt" />
</template>

<script lang="ts" setup>
interface Props {
  src: string
  alt?: string
  size?: 'small' | 'medium' | 'large'
}

withDefaults(defineProps<Props>(), {
  alt: 'Album cover',
  size: 'medium',
})
</script>

<style scoped>
.album-cover {
  object-fit: cover;
  border-radius: 4px;
}

.album-cover--small {
  width: 48px;
  height: 48px;
}

.album-cover--medium {
  width: 48px;
  height: 48px;
}

.album-cover--large {
  width: 80px;
  height: 80px;
}
</style>
