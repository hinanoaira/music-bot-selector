<template>
  <div class="navigable-list">
    <BaseButton variant="back" @click="$emit('back')">
      {{ backButtonText }}
    </BaseButton>

    <BaseText tag="h2" variant="heading">
      {{ title }}
    </BaseText>

    <BaseList>
      <slot
        v-for="item in items"
        :key="getItemKey ? getItemKey(item) : item"
        name="item"
        :item="item"
        :select-item="(selectedItem: unknown) => $emit('selectItem', selectedItem)"
      >
        <!-- Default slot content if no custom slot provided -->
        <ContentCard
          v-if="getItemImage && getItemLabel"
          :title="getItemLabel(item)"
          :image-url="getItemImage(item)"
          @click="$emit('selectItem', item)"
        />
      </slot>
    </BaseList>
  </div>
</template>

<script lang="ts" setup>
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseText from '@/components/atoms/BaseText.vue'
import BaseList from '@/components/atoms/BaseList.vue'
import ContentCard from '@/components/molecules/ContentCard.vue'

interface Props<T = unknown> {
  title: string
  items: T[]
  backButtonText?: string
  getItemKey?: (item: T) => string
  getItemLabel?: (item: T) => string
  getItemImage?: (item: T) => string
}

withDefaults(defineProps<Props>(), {
  backButtonText: 'Back',
})

defineEmits<{
  back: []
  selectItem: [item: unknown]
}>()
</script>

<style scoped>
.navigable-list {
  height: 100%;
}
</style>
