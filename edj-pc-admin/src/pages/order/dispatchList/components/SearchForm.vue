<!-- 搜索表单区域 -->
<template>
  <div class="formBox bg-wt">
    <t-form ref="form" :data="formData" :label-width="70">
      <t-row>
        <t-col>
          <t-form-item label="服务类型：" name="name">
            <t-select
              v-model="formData.edjServeTypeId"
              :options="typeSelectList"
              class="form-item-content"
              clearable
              placeholder="请选择"
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item label="服务名称：" name="name">
            <t-input
              v-model="formData.contactsName"
              class="form-item-content"
              clearable
              placeholder="请输入"
              type="search"
            />
          </t-form-item>
        </t-col>
        <t-col class="searchBtn">
          <button class="bt-grey wt-60" @click="handleReset()">重置</button>
          <button class="bt wt-60" @click="handleSearch()">搜索</button>
        </t-col>
        <t-col class="citySelect">
          <t-form-item label="" label-width="0" name="name">
            <t-select
              v-model="formData.edjCityId"
              :options="citySelectList"
              class="form-item-content"
              clearable
              placeholder="请选择"
            />
          </t-form-item>
        </t-col>
      </t-row>
    </t-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  typeSelect: {
    type: Array<{
      id: string
      name: string
    }>,
    default: () => {
      return []
    }
  },
  cityList: {
    type: Array<{
      id: string
      name: string
      edjCityId: string
    }>,
    default: () => {
      return []
    }
  }
})
const typeSelectList = ref([]) // 服务类型下拉框数据
const citySelectList = ref([]) // 城市下拉框数据
// 表单数据
const formData = ref({
  edjServeTypeId: '',
  contactsName: '',
  edjCityId: ''
})
// 触发父组件的方法
const emit: Function = defineEmits(['handleSearch', 'handleReset'])
// 表单数据
const searchForm = {
  edjServeTypeId: '',
  contactsName: '',
  edjCityId: ''
}
// 重置表单
const handleReset = () => {
  formData.value = {...searchForm}
  formData.value.edjCityId = props.cityList[0]?.edjCityId
  emit('handleSearch', formData.value)
}
// 搜索表单
const handleSearch = () => {
  emit('handleSearch', formData.value)
}
watchEffect(() => {
  typeSelectList.value = props.typeSelect.map((item) => {
    return {
      label: item.name,
      value: item.id
    }
  })
  citySelectList.value = props.cityList.map((item) => {
    return {
      label: item.name,
      value: item.edjCityId
    }
  })
  formData.value.edjCityId = props.cityList[0]?.edjCityId
})
</script>

<style lang="less" scoped src="../../index.less"></style>
<style lang="less" scoped>
.formBox {
  position: relative;

  .citySelect {
    position: absolute;
    right: 8px;
  }
}
</style>
