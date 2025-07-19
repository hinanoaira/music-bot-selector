<template>
    <ul class="base-list">
        <slot />
    </ul>
</template>

<script lang="ts" setup>
// プロパティは不要 - スロットで内容を受け取る
</script>

<style scoped>
.base-list {
    list-style: none;
    padding-left: 0;
    margin: 0;
}
</style>
