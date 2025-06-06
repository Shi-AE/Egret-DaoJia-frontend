<template>
  <t-card theme="poster2">
    <template #avatar>
      <t-avatar size="56px">
        <template #icon>
          <shop-icon v-if="product.type === 1" />
          <calendar-icon v-if="product.type === 2" />
          <service-icon v-if="product.type === 3" />
          <user-avatar-icon v-if="product.type === 4" />
          <laptop-icon v-if="product.type === 5" />
        </template>
      </t-avatar>
    </template>
    <template #status>
      <t-tag
        :disabled="!product.isSetup"
        :theme="product.isSetup ? 'success' : 'default'"
        >{{ product.isSetup ? '已启用' : '已停用' }}
      </t-tag>
    </template>
    <template #content>
      <p class="list-card-item_detail--name">{{ product.name }}</p>
      <p class="list-card-item_detail--desc">{{ product.description }}</p>
    </template>
    <template #footer>
      <t-avatar-group :max="2" cascading="left-up">
        <t-avatar>{{ typeMap[product.type - 1] }}</t-avatar>
        <t-avatar>
          <template #icon>
            <add-icon />
          </template>
        </t-avatar>
      </t-avatar-group>
    </template>
    <template #actions>
      <t-dropdown
        :disabled="!product.isSetup"
        :options="[
          {
            content: '管理',
            value: 'manage',
            onClick: () => handleClickManage(product)
          },
          {
            content: '删除',
            value: 'delete',
            onClick: () => handleClickDelete(product)
          }
        ]"
        trigger="click"
      >
        <t-button
          :disabled="!product.isSetup"
          shape="square"
          theme="default"
          variant="text"
        >
          <more-icon />
        </t-button>
      </t-dropdown>
    </template>
  </t-card>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue'
import {
  ShopIcon,
  CalendarIcon,
  ServiceIcon,
  UserAvatarIcon,
  LaptopIcon,
  MoreIcon,
  AddIcon
} from 'tdesign-icons-vue-next'

export interface CardProductType {
  type: number
  isSetup: boolean
  description: string
  name: string
}

const props = defineProps({
  product: {
    type: Object as PropType<CardProductType>
  }
})

const emit = defineEmits(['manage-product', 'delete-item'])

const typeMap = ['A', 'B', 'C', 'D', 'E']

const handleClickManage = (product: CardProductType) => {
  emit('manage-product', product)
}

const handleClickDelete = (product: CardProductType) => {
  emit('delete-item', product)
}
</script>

<style lang="less" scoped>
.list-card-item {
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &_detail {
    min-height: 140px;

    &--name {
      margin-bottom: 8px;
      font-size: 16px;
      font-weight: 400;
      color: var(--td-text-color-primary);
    }

    &--desc {
      color: var(--td-text-color-secondary);
      font-size: 12px;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      height: 40px;
    }
  }
}
</style>
