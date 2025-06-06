<!-- 机构管理页 -->
<template>
  <router-view v-if="url !== '/institution/authentication'"></router-view>
  <div v-else class="base-up-wapper bgTable min-h">
    <!-- 搜索表单区域 -->
    <searchFormBox
      :init-search="initSearch"
      :type-select="typeSelect"
      @handleReset="handleReset"
      @handleSearch="handleSearch"
    ></searchFormBox>
    <!-- end -->
    <!-- 表格 -->
    <tableList
      :is-active="0"
      :list-data="listData"
      :pagination="pagination"
      @fetchData="fetchData"
      @handleApply="handleApply"
      @handleBuild="handleBuild"
      @handleClickFreeze="handleClickFreeze"
      @handleReject="handleReject"
      @handleSortChange="handleSortChange"
      @onPageChange="onPageChange"
    ></tableList>
    <!-- end -->
    <!-- 驳回弹窗 -->
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
    <!-- 通过弹窗 -->
    <Delete
      :delete-text="deleteText"
      :dialog-delete-visible="dialogFreezeVisible"
      :title="title"
      @handle-delete="handleThaw"
      @handle-close="handleClose"
    ></Delete>
    <!-- end -->
    <!-- 申请弹窗 -->
    <ApplyDialog
      :data="applyData"
      :pagination="pagination"
      :visible="applyVisible"
      title="申请记录"
      @handleClose="handleClose"
    ></ApplyDialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { forEach } from 'lodash'
import {
  serviceInstitutionAuditList,
  serviceInstitutionAudit
} from '@/api/service'
import DialogForm from './components/DialogForm.vue' // 新增,编辑弹窗.
import tableList from './components/TableList.vue' // 表格
import Delete from '@/components/Delete/index.vue' // 解冻弹层
import searchFormBox from './components/SearchForm.vue' // 搜索框表单
import ApplyDialog from './components/ApplyDialog.vue' // 申请弹窗

const route = useRoute()
const router = useRouter()
const visible = ref(false) // 新增，编辑弹窗
const listData = ref([]) // 列表数据
const dataLoading = ref(false) // 列表数据加载loading
const DialogFormData = ref({}) // 弹窗表单内容
const title = ref('新建') // 弹窗标题
const dialogFreezeVisible = ref(false) // 控制解冻弹层显示隐藏
const deleteText = ref(
  '此操作将同意该企业入驻平台，认证通过后，企业可开启接单业务，是否确认通过实名认证申请？'
) // 删除的内容
const url = ref('') // 当前路由
const applyVisible = ref(false) // 申请弹窗
const initSearch = ref() // 条转过来的携带数据
const typeSelect = ref([]) // 服务类型下拉框数据
const freezeId = ref('') // 删除的id
const dialogForm = ref(null) // 弹窗组件
const applyData = ref([]) // 申请弹窗数据
// 分页
const pagination = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1 // 默认当前页
})
const requestData = ref({
  orderByList: [],
  pageNo: 1,
  pageSize: 10,
  name: null,
  auditStatus: 0,
  certificationStatus: null,
  legalPersonName: null // 法人姓名
}) // 请求参数

// 生命周期
onMounted(() => {
  fetchData(requestData.value)
})
// 搜索功能
const handleSearch = (val) => {
  requestData.value.name = val.name
  requestData.value.auditStatus = val.auditStatus === 2 ? null : val.auditStatus
  requestData.value.certificationStatus =
    val.certificationStatus === 1 ? null : val.certificationStatus
  requestData.value.legalPersonName = val.legalPersonName
  pagination.value.defaultCurrent = 1
  requestData.value.pageNo = 1
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
  await serviceInstitutionAuditList(val)
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
  applyVisible.value = false // 关闭申请弹窗
}
// 点击新建
const handleBuild = () => {
  router.push('/institution/authentication/authenticationDetail')
}
// 确认冻结
const handleFreeze = async (val) => {
  await serviceInstitutionAudit(
    {
      certificationStatus: 3,
      rejectReason: val.selectName
    },
    freezeId.value
  ).then((res) => {
    if (res.data.code === 200) {
      dialogFreezeVisible.value = false
      MessagePlugin.success('驳回成功')
      fetchData(requestData.value)
      dialogForm.value.onClickCloseBtn()
    } else {
      MessagePlugin.error(res.msg)
    }
  })
}
// 点击驳回
const handleClickFreeze = (row) => {
  freezeId.value = row.id
  // 编辑弹窗
  visible.value = true
  title.value = '驳回原因'
}
// 排序
const handleSortChange = (val) => {
  forEach(val, (item) => {
    requestData.value.orderByList[0] = {
      orderBy: item.sortBy,
      isAsc: !item.descending
    }
  })
  fetchData(requestData.value)
}
// 点击通过
const handleReject = (row) => {
  freezeId.value = row.id
  // 编辑弹窗
  dialogFreezeVisible.value = true
  title.value = '确认通过'
}
// 确认通过
const handleThaw = async () => {
  await serviceInstitutionAudit(
    {
      rejectReason: '',
      certificationStatus: 2
    },
    freezeId.value
  ).then((res) => {
    if (res.data.code === 200) {
      dialogFreezeVisible.value = false
      MessagePlugin.success('通过成功')
      fetchData(requestData.value)
    } else {
      MessagePlugin.error(res.msg)
    }
  })
}
// 翻页
const onPageChange = (val) => {
  requestData.value.pageNo = val.defaultCurrent
  requestData.value.pageSize = val.defaultPageSize
  fetchData(requestData.value)
}
// 打开申请弹窗
const handleApply = (val) => {
  applyData.value = listData.value
  applyVisible.value = true
}
// 监听路由变化，三级菜单
watchEffect(() => {
  if (route.path === 'institution/authentication') {
    url.value = 'institution/authentication'
    fetchData(requestData.value)
  } else {
    url.value = route.path
    fetchData(requestData.value)
  }
})
</script>
<style lang="less" scoped src="../index.less"></style>
