<!-- 列表页和详情页的表格 -->
<template>
  <div class="baseList bg-wt min-h">
    <div class="tableBoxs">
      <t-config-provider>
        <t-table
          :columns="tableCOLUMNS"
          :data="data"
          :disable-data-page="pagination.total <= 10"
          :hover="true"
          :loading="dataLoading"
          :multiple-sort="true"
          :pagination="
            pagination.total <= 10 || !pagination.total ? null : pagination
          "
          :row-key="rowKey"
          :selected-row-keys="selectedRowKeys"
          show-size-changer
          table-content-width="100%"
          table-layout="fixed"
          vertical-align="middle"
          @page-change="onPageChange"
          @select-change="rehandleSelectChange"
        >
          <!-- 空页面 -->
          <template #empty>
            <NoData></NoData>
          </template>
          <!-- 服务类型图标 -->
          <template #icon="{ row }">
            <div class="headPortrait">
              <img
                :src="row.icon"
                alt=""
                class="tdesign-demo-image-viewer__ui-image--img"
              />
            </div>
          </template>
          <!-- end -->
          <!-- 服务类型图片 -->
          <template #img="{ row }">
            <div v-if="row.img" class="headPortrait">
              <t-image-viewer :images="[row.img]">
                <template #trigger="{ open }">
                  <div class="tdesign-demo-image-viewer__ui-image">
                    <img
                      :src="row.img"
                      alt="test"
                      class="tdesign-demo-image-viewer__ui-image--img"
                    />
                    <div
                      class="tdesign-demo-image-viewer__ui-image--hover"
                      @click="open"
                    >
                      <span><ZoomInIcon size="1.8em"/></span>
                    </div>
                  </div>
                </template>
              </t-image-viewer>
            </div>
            <div v-else>-</div>
          </template>
          <!-- end -->
          <!-- 证明资料 -->
          <template #certificationImgs="{ row }">
            <div v-if="row.certificationImgs?.length > 0" class="headPortrait">
              <t-image-viewer :images="row.certificationImgs">
                <template #trigger="{ open }">
                  <div class="tdesign-demo-image-viewer__ui-image">
                    <img
                      :src="row.certificationImgs[0]"
                      alt="test"
                      class="tdesign-demo-image-viewer__ui-image--img"
                    />
                    <div
                      class="tdesign-demo-image-viewer__ui-image--hover"
                      @click="open"
                    >
                      <span><ZoomInIcon size="1.8em"/></span>
                    </div>
                  </div>
                </template>
              </t-image-viewer>
            </div>
            <div v-else>-</div>
          </template>
          <!-- end -->
          <!-- 描述 -->
          <template #description="{ row, rowIndex }">
            <div
              :class="rowIndex < 3 ? 'shortDescription' : ''"
              class="description"
            >
              <span>{{ row.description }}</span>
              <span
                v-if="
                  row.description.length > 36 && row.description.length <= 200
                "
                class="hover"
              >{{ row.description }}</span
              >
            </div>
          </template>
          <!-- end -->
          <!-- 服务前照片 -->
          <template #serveBeforeImgs="{ row }">
            <div v-if="row.serveBeforeImgs?.length > 0" class="headPortrait">
              <t-image-viewer :images="row.serveBeforeImgs">
                <template #trigger="{ open }">
                  <div class="tdesign-demo-image-viewer__ui-image">
                    <img
                      :src="row.serveBeforeImgs[0]"
                      alt="test"
                      class="tdesign-demo-image-viewer__ui-image--img"
                    />
                    <div
                      class="tdesign-demo-image-viewer__ui-image--hover"
                      @click="open"
                    >
                      <span><ZoomInIcon size="1.8em"/></span>
                    </div>
                  </div>
                </template>
              </t-image-viewer>
            </div>
            <div v-else>-</div>
          </template>
          <!-- end -->
          <!-- 服务后照片 -->
          <template #serveAfterImgs="{ row }">
            <div v-if="row.serveAfterImgs?.length > 0" class="headPortrait">
              <t-image-viewer :images="row.serveAfterImgs">
                <template #trigger="{ open }">
                  <div class="tdesign-demo-image-viewer__ui-image">
                    <img
                      :src="row.serveAfterImgs[0]"
                      alt="test"
                      class="tdesign-demo-image-viewer__ui-image--img"
                    />
                    <div
                      class="tdesign-demo-image-viewer__ui-image--hover"
                      @click="open"
                    >
                      <span><ZoomInIcon size="1.8em"/></span>
                    </div>
                  </div>
                </template>
              </t-image-viewer>
            </div>
            <div v-else>-</div>
          </template>
          <!-- 在操作栏添加删除、编辑、查看三种操作 -->
          <template #op="{ row }">
            <a
              class="font-bt btn-split-right"
              @click="handleClickFreeze(row, row.status)"
            >{{ row.status === 0 ? '冻结' : '解冻' }}</a
            >
            <a
              :class="
                row.saleStatus === 2
                  ? 'text-forbidden font-bt line'
                  : 'font-bt line'
              "
              @click="handleClickEdit(row)"
            >查看</a
            >
          </template>
          <!-- end -->
          <!-- 服务人员 -->
          <template #institutionStaffName="{ row }">
            <div>{{ row.institutionStaffName }}</div>
            <div>{{ row.institutionStaffPhone }}</div>
          </template>
          <!-- 在操作栏添加删除、编辑、查看三种操作 -->
          <template #op2="{ row }">
            <a class="font-bt line" @click="handleClickOrderDetail(row)"
            >查看订单</a
            >
          </template>
          <!-- end -->
        </t-table>
      </t-config-provider>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ZoomInIcon } from 'tdesign-icons-vue-next'
import { COLUMNS, SERVE_DATA, SERVE_COLUMNS } from '../constants'
import NoData from '@/components/noData/index.vue'
// 接收父组件传递的值
const props = defineProps({
  listData: {
    type: Object,
    default: () => {
      return {}
    }
  },
  pagination: {
    type: Object,
    default: () => {
      return {}
    }
  },
  isActive: {
    type: Number
  }
})
// 发送事件给父组件
const emit = defineEmits([
  'fetchData',
  'handleSetupContract',
  'handleBuild',
  'handleClickFreeze',
  'onPageChange',
  'handleClickThaw'
])
// 监听器赋值，切换tab
watch(props, () => {
  pagination.value = props.pagination
  pagination.value.current =
    props.pagination.defaultCurrent == 1 ? 1 : props.pagination.defaultCurrent
  pagination.value.pageSize =
    props.pagination.defaultPageSize == 1 ? 1 : props.pagination.defaultPageSize
  data.value = props.listData
  dataLoading.value = false
  if (props.isActive === 0) {
    tableCOLUMNS.value = COLUMNS
  }
  // 加延时，解决表格可能造成的重复键值
})
watch(
  () => props.isActive,
  () => {
    tableCOLUMNS.value = []
    if (props.isActive === 0) {
      tableCOLUMNS.value = COLUMNS
    } else if (props.isActive === 3) {
      tableCOLUMNS.value = SERVE_DATA
    } else if (props.isActive === 4) {
      tableCOLUMNS.value = SERVE_COLUMNS
    }
  }
)
// 表头COLUMNS
const tableCOLUMNS = ref()
// 路由
const router = useRouter()

const data: any = ref([])
// 选中的行
const pagination: any = ref({
  defaultPageSize: 10,
  total: 0,
  defaultCurrent: 1, // 默认当前页
  current: 1,
  pageSize: 10
})
// 索引
const rowKey = 'index' // 行的key
// 加载状态
const dataLoading = ref(true)

// 选中的行
const selectedRowKeys = ref([1, 2])
const rehandleSelectChange = (val: number[]) => {
  selectedRowKeys.value = val
}
// 点击跳转到详情页
const handleClickEdit = (val) => {
  router.push(`/institution/information/informationDetail/${val.id}`)
}
//
// 点击删除
const handleClickFreeze = (row, flag) => {
  if (flag === 0) {
    emit('handleClickFreeze', row)
  } else {
    emit('handleClickThaw', row)
  }
}
// 点击翻页
const onPageChange = (val) => {
  pagination.value.defaultCurrent = val.current
  pagination.value.defaultPageSize = val.pageSize
  emit('onPageChange', {
    defaultCurrent: val.current,
    defaultPageSize: val.pageSize
  })
}
// 进入订单详情
const handleClickOrderDetail = (row) => {
  router.push(`/order/orderList/orderDetail/${row.id}`)
}
</script>
<style lang="less" scoped src="../../index.less"></style>
<style lang="less" scoped>
.headPortrait {
  display: flex;
  align-items: center;
}

:deep(.t-table__filter-icon) {
  display: none;
}
</style>
