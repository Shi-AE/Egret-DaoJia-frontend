<!-- 列表 -->
<template>
  <view class="homeList">
    <view v-for="(item, index) in list.data" :key="index" class="card">
      <view class="card-content">
        <image :src="item.serveItemImg" class="leftCardContent"></image>
        <view class="rightCardContent">
          <view class="title">
            {{ item.serveItemName }}
          </view>
          <view class="serviceTime">
            <text>预约时间</text>
            <text>{{ handleTime(item.serveStartTime) }}</text>
          </view>
        </view>
      </view>
      <view class="serviceAddress">
        <!-- <view>服务地址</view> -->
        <view class="address">
          <view class="addressContent">{{ item.serveAddress }}</view>
        </view>
      </view>
      <view class="cardFooter">
        <view class="price">
          <text class="price-label">服务费用</text>
          ￥{{ (Number(item.ordersAmount) * 0.997 * 0.3).toFixed(2) }}
        </view>
        <view class="robBtn btn-red" @click.stop="handleRob(item.id)"
        >立即抢单
        </view
        >
      </view>
    </view>
    <view class="footer">- 已 经 到 底 了 -</view>
    <!-- 提示窗示例 -->
    <uni-popup ref="alertDialog" :is-mask-click="false" type="dialog">
      <view class="dialog">
        <view :class="isRob ? 'success' : 'fail'" class="img"></view>

        <view :class="isRob ? 'title' : 'content'" class="content">
          <view v-if="!isRob" class="title">抢单失败</view>
          {{ isRob ? '抢单成功' : msg ? msg : '很遗憾，抢单失败' }}
        </view
        >
        <view class="dialogFooter" @click="handleClose">确定</view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { reactive, ref, watchEffect } from 'vue'
import { robOrder } from '../../api/order.js'

const emit = defineEmits(['refresh']) //子组件向父组件事件传递
// 获取父组件值、方法
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
const isRob = ref(true)
let list = reactive({
  data: []
})
const alertDialog = ref(null)
const msg = ref('')
const handleClose = () => {
  alertDialog.value.close()
  emit('refresh')
}
//处理时间格式
const handleTime = (val) => {
  return val ? val.replace(/:\d{2}$/, '') : ''
}
//抢单
const handleRob = (id) => {
  robOrder(id)
    .then((res) => {
      isRob.value = res.code === 200
      alertDialog.value.open()
    })
    .catch((err) => {
      isRob.value = false
      msg.value = err.msg
      alertDialog.value.open()
    })
}
watchEffect(() => {
  list.data = props.data
})
</script>
<style lang="scss" src="../index.scss"></style>
