<template>
  <ToastList :toasts="toastStore.toasts" @removeToast="handleRemoveToast" />
</template>

<script lang="ts" setup>
import ToastList from '@/components/organisms/ToastList.vue'
import { useToastStore } from '@/stores/toast.store'

const toastStore = useToastStore()

function handleRemoveToast(id: string) {
  toastStore.removeToast(id)
}
</script>
