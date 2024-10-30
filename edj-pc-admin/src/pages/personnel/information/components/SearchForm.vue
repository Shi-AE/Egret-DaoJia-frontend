<!-- 搜索表单区域 -->
<template>
  <div class="formBox bg-wt">
    <t-form ref="form" :data="formData" :label-width="70">
      <t-row>
        <t-col>
          <t-form-item label="真实姓名：" name="name">
            <t-input
              v-model="formData.name"
              class="form-item-content"
              clearable
              placeholder="请输入"
              type="search"
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item :label-width="70" label="登录账号：" name="phone">
            <t-input
              v-model="formData.phone"
              class="form-item-content"
              clearable
              placeholder="请输入"
              type="search"
            />
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item :label-width="70" label="接单状态：" name="canPickUp">
            <t-radio-group v-model="formData.canPickUp">
              <t-radio :value="2">全部</t-radio>
              <t-radio :value="1">接单中</t-radio>
              <t-radio :value="0">休息中</t-radio>
            </t-radio-group>
          </t-form-item>
        </t-col>
        <t-col>
          <t-form-item :label-width="70" label="账号状态：" name="status">
            <t-radio-group v-model="formData.status">
              <t-radio :value="2">全部</t-radio>
              <t-radio :value="0">正常</t-radio>
              <t-radio :value="1">冻结</t-radio>
            </t-radio-group>
          </t-form-item>
        </t-col>
        <t-col class="searchBtn">
          <button class="bt-grey wt-60" @click="handleReset()">重置</button>
          <button class="bt wt-60" @click="handleSearch()">搜索</button>
        </t-col>
      </t-row>
    </t-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// 表单数据
const formData = ref({
  phone: '',
  status: 2,
  name: '',
  canPickUp: 2
})
// 触发父组件的方法
const emit: Function = defineEmits(['handleSearch'])
// 表单数据，用于重置表单
const searchForm = {
  phone: '',
  status: 2,
  name: '',
  canPickUp: 2
}
// 重置表单
const handleReset = () => {
  formData.value = {...searchForm}
  emit('handleSearch', formData.value)
}
// 搜索表单
const handleSearch = () => {
  emit('handleSearch', formData.value)
}
</script>


<style lang="less" scoped src="../../index.less"></style>
