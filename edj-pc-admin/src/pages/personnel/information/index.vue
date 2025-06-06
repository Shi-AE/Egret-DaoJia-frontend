<!-- 服务人员信息管理页 -->
<template>
  <router-view v-if="url !== '/personnel/information'"></router-view>
  <div v-else class="base-up-wapper bgTable min-h">
    <!-- 搜索表单区域 -->
    <searchFormBox
      :initSearch="initSearch"
      :typeSelect="typeSelect"
      @handleReset="handleReset"
      @handleSearch="handleSearch"
    ></searchFormBox>
    <!-- end -->
    <!-- 表格 -->
    <tableList
      :isActive="0"
      :list-data="listData"
      :pagination="pagination"
      @fetchData="fetchData"
      @handleBuild="handleBuild"
      @handleClickFreeze="handleClickFreeze"
      @onPageChange="onPageChange"
    ></tableList>
    <!-- end -->
    <!-- 冻结弹窗 -->
    <DialogForm
      ref="dialogForm"
      :data="DialogFormData"
      :title="title"
      :visible="visible"
      @fetchData="fetchData"
      @handleClose="handleClose"
      @handleSubmit="handleFreeze"
    />
    <!-- end -->
    <!-- 解冻弹窗 -->
    <Delete
      :delete-text="deleteText"
      :dialog-delete-visible="dialogFreezeVisible"
      :title="title"
      @handle-delete="handleThaw"
      @handle-close="handleClose"
    ></Delete>
    <!-- end -->
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { servicePersonList, servicePersonStatus } from '@/api/service'
import DialogForm from './components/DialogForm.vue' // 新增,编辑弹窗.
import tableList from './components/TableList.vue' // 表格
import Delete from '@/components/Delete/index.vue' // 删除弹层
import searchFormBox from './components/SearchForm.vue' // 搜索框表单

const route = useRoute()
const router = useRouter()
const visible = ref(false) // 新增，编辑弹窗
const listData = ref([]) // 列表数据
const dataLoading = ref(false) // 列表数据加载loading
const DialogFormData = ref({}) // 弹窗表单内容
const title = ref('新建') // 弹窗标题
const dialogFreezeVisible = ref(false) // 控制解冻弹层显示隐藏
const deleteText = ref('解冻用户后，用户将恢复登录权限，是否确认解冻该用户？') // 删除的内容
const url = ref('') // 当前路由
const initSearch = ref() // 条转过来的携带数据
const typeSelect = ref([]) // 服务类型下拉框数据
const freezeId = ref('') // 删除的id
const dialogForm = ref(null) // 弹窗组件
// 分页
const pagination = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1 // 默认当前页
})
const requestData = ref({
  pageNo: 1,
  pageSize: 10,
  name: '',
  phone: '',
  status: null,
  canPickUp: null
}) // 请求参数
const resetData = ref({
  pageNo: 1,
  pageSize: 10,
  name: '',
  phone: '',
  status: null,
  canPickUp: null
}) // 默认请求参数
// 生命周期
onMounted(() => {
  fetchData(requestData.value)
})
// 搜索功能
const handleSearch = (val) => {
  requestData.value.name = val.name
  requestData.value.phone = val.phone
  requestData.value.status = val.status === 2 ? null : val.status
  requestData.value.canPickUp = val.canPickUp === 2 ? null : val.canPickUp
  requestData.value.pageNo = 1
  pagination.value.defaultCurrent = 1
  fetchData(requestData.value)
}
// 分页

// 重置，清空搜索框
const handleReset = () => {
  // 清空搜索框的全部内容并且重新获取数据
  // 重置页码
  pagination.value.defaultCurrent = 1
  fetchData(requestData.value)
  // 重新渲染table
}
// 获取列表数据
const fetchData = async (val) => {
  dataLoading.value = true
  await servicePersonList(val)
    .then((res) => {
      if (res.code === 200) {
        listData.value = res.data.list
        pagination.value.total = Number(res.data.total)
        dataLoading.value = false
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 关闭弹窗
const handleClose = () => {
  visible.value = false // 关闭新增弹窗
  dialogFreezeVisible.value = false // 关闭删除弹层
}
// 确认解冻
const handleThaw = async () => {
  await servicePersonStatus({
    id: freezeId.value,
    status: 0
  }).then((res) => {
    if (res.data.code === 200) {
      dialogFreezeVisible.value = false
      MessagePlugin.success('解冻成功')
      fetchData(requestData.value)
    } else {
      MessagePlugin.error(res.msg)
    }
  })
}
// 点击新建
const handleBuild = () => {
  router.push('/personnel/information/informationDetail')
}
// 上下架
const handleFreeze = async (val) => {
  await servicePersonStatus({
    id: freezeId.value,
    status: 1,
    accountLockReason: val.accountLockReason
  }).then((res) => {
    if (res.data.code === 200) {
      dialogFreezeVisible.value = false
      MessagePlugin.success('冻结成功')
      fetchData(requestData.value)
      dialogForm.value.onClickCloseBtn()
    } else {
      MessagePlugin.error(res.msg)
    }
  })
}
// 点击冻结
const handleClickFreeze = (row, flag) => {
  freezeId.value = row.id
  if (flag === 0) {
    // 编辑弹窗
    visible.value = true
    title.value = '冻结原因'
  } else {
    // 编辑弹窗
    dialogFreezeVisible.value = true
    title.value = '解冻确认'
  }
}
// 翻页
const onPageChange = (val) => {
  requestData.value.pageNo = val.defaultCurrent
  requestData.value.pageSize = val.defaultPageSize
  fetchData(requestData.value)
}
watchEffect(() => {
  pagination.value.defaultCurrent = 1
  pagination.value.defaultPageSize = 10
  url.value = route.path
  fetchData(resetData.value)
})
</script>
<style lang="less" scoped>
.bgTable {
  min-width: 1024px;
}
</style>
