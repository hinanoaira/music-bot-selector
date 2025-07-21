<template>
  <div class="selectable-list">
    <BaseText :tag="titleTag" :variant="titleVariant">
      {{ title }}
    </BaseText>
    <BaseList>
      <BaseListItem
        v-for="item in items"
        :key="getItemKey ? getItemKey(item) : String(item)"
        clickable
        @click="$emit('selectItem', item)"
      >
        <BaseText tag="span" variant="body">
          {{ getItemLabel ? getItemLabel(item) : String(item) }}
        </BaseText>
      </BaseListItem>
    </BaseList>
  </div>
</template>

<script lang="ts" setup>
import BaseText from '@/components/atoms/BaseText.vue'
import BaseList from '@/components/atoms/BaseList.vue'
import BaseListItem from '@/components/atoms/BaseListItem.vue'

interface Props<T = unknown> {
  title: string
  items: T[]
  titleTag?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  titleVariant?: 'heading' | 'subheading' | 'body' | 'caption' | 'inherit'
  getItemKey?: (item: T) => string
  getItemLabel?: (item: T) => string
}

withDefaults(defineProps<Props>(), {
  titleTag: 'h2',
  titleVariant: 'heading',
})

defineEmits<{
  selectItem: [item: unknown]
}>()
</script>

<style scoped>
.selectable-list {
  height: 100%;
}
</style>
