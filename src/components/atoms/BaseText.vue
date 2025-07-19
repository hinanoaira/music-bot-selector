<template>
  <component :is="tag" :class="['base-text', `base-text--${variant}`]">
    <slot />
  </component>
</template>

<script lang="ts" setup>
interface Props {
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  variant?: 'heading' | 'subheading' | 'body' | 'caption' | 'inherit'
}

withDefaults(defineProps<Props>(), {
  tag: 'p',
  variant: 'body'
})
</script>

<style scoped>
.base-text {
  margin: 0;
}

.base-text--heading {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.base-text--subheading {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.base-text--body {
  font-size: 1rem;
  color: #333;
}

.base-text--caption {
  font-size: 0.875rem;
  color: #666;
}

.base-text--inherit {
  color: inherit;
}
</style>
