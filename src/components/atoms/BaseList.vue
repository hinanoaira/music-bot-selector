<template>
  <ul class="base-list">
    <slot />
  </ul>
</template>

<script lang="ts" setup></script>

<style scoped>
.base-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}
</style>
