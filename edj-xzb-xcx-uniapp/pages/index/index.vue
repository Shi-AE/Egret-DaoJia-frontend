<!-- 首页 -->
<template>
  <view class="homePage">
    <NavBar :isShowBack="false" title="云岚到家"></NavBar>
    <view class="homeBox">
      <view class="input-view">
        <view class="city" @click="toCity()">
          <image mode="scaleToFill" src="/static/dw.png" />
          <view class="address">{{ city.name ? city.name : '暂无' }}</view>
        </view>
        <image class="input-uni-icon" mode="scaleToFill" src="/static/ss.png" />
        <input
          v-model="searchVal"
          class="nav-bar-input"
          confirm-type="search"
          disabled
          placeholder="日常保洁"
          placeholder-style="color:#ccc ; font-size: 28rpx; align-items: center;margin-top: 3rpx;"
          type="text"
          @click="handleSearch"
          @confirm="handleSearch"
          @focus="handleSearch"
          @input="handleSearch"
        />
      </view>
      <image class="homeBanner" mode="scaleToFill" src="/static/banner.png" />
      <view class="tips">
        <view>
          <image mode="scaleToFill" src="/static/smile.png" />
          <test> 云岚到家平台，给你贴心的 专业的上门服务</test>
        </view>
        <view>
          <image mode="scaleToFill" src="/static/yuan.png" />
          <test> 标准定价 售后无忧</test>
        </view>
      </view>
      <!-- 未选择城市或者城市下无服务时的显示 -->
      <view v-if="!city.name || menuData.length === 0" class="empty-box">
        <image src="../../static/zwnr@2x.png"></image>
        <view v-if="!city.name">
          用户当前未授权位置，请手动选择城市进行下单
        </view>
        <view v-else> 当前城市暂未开通服务，请切换其他城市进行下单</view>
        <button class="agree-btn btn" @click="toCity()">
          手动选择服务城市
        </button>
      </view>

      <view class="menu">
        <view class="leftBox">
          <view
            v-for="(item, index) in menuData"
            :key="index"
            class="left"
            @click="toService(item.serveTypeId, 1)"
          >
            <image :src="item.serveTypeIcon" mode="scaleToFill" />
            <view>{{ item.serveTypeName }}</view>
          </view>
        </view>
        <view class="rightBox">
          <view v-for="(item, index) in menuData" :key="index" class="rights">
            <view class="leftLine"></view>
            <view class="right">
              <view
                v-for="(content, key) in item.serveResDTOList"
                :key="key"
                class="card"
                @click="toService(content.id, 2)"
              >
                <image :src="content.serveItemIcon" mode="scaleToFill" />
                <view>{{ content.serveItemName }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-if="hotData.length > 0" class="title">
        <image mode="scaleToFill" src="/static/biao.png" />
        精选推荐
      </view>
      <view class="recommend">
        <view v-for="(item, index) in hotData" :key="index" class="card">
          <view
            :class="
              (index + 1) % 3 === 1
                ? 'tag1'
                : (index + 1) % 3 === 2
                ? 'tag2'
                : 'tag3'
            "
            class="tag"
          >{{
              // (index + 1)/3 取余数
              (index + 1) % 3 === 1
                ? '专业、贴心的上门服务'
                : (index + 1) % 3 === 2
                  ? '标准定价，售后无忧'
                  : '云岚到家，您的不二选择'
            }}
          </view
          >
          <image
            :src="item.serveItemImg"
            class="cardImg"
            mode="scaleToFill"
            @click="toService(item.id, 2)"
          />
          <view class="cardName">{{ item.serveItemName }}</view>
          <view class="reservation">
            <view
            >￥
              <test>{{ item.price }}</test>
            </view
            >
            <button @click="toService(item.id, 2)">立即预约</button>
          </view>
        </view>
      </view>
    </view>
    <view class="foot">
      <button v-if="false" class="agree-btn btn" @click="toLogin">登录</button>
      <button v-if="false" class="agree-btn btn" @click="toEvaluate">
        评价
      </button>
    </view>
    <!-- footer -->
    <UniFooter :pagePath="'/pages/index/index'"></UniFooter>
    <!-- end -->
    <!-- 悬浮球 -->
    <ExpBall></ExpBall>
    <!-- end -->
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onPullDownRefresh, onShow } from '@dcloudio/uni-app'
import { getHomeService, getHotServe } from '../api/index.js'
import ExpBall from '../../components/expBall/ExpBall.vue'

const nickName = ref('') //昵称
const accessToken = ref('') //token
const menuData = ref([]) //菜单数据
const hotData = ref([]) //热门服务数据
const searchVal = ref('') //搜索框的值
const city = ref({}) //城市

onShow(() => {
  // 获取nickName
  nickName.value = uni.getStorageSync('nickName')
  // 获取token
  accessToken.value = uni.getStorageSync('accessToken')

  if (!accessToken.value && !nickName.value) {
    uni.navigateTo({
      url: '/pages/login/index'
    })
  } else {
    // 延时获取城市，防止城市未获取到
    setTimeout(() => {
      city.value = uni.getStorageSync('city')
      if (city.value) {
        getHomeServiceData()
        getHotServeData()
      }
    }, 200)
  }
})

const toLogin = () => {
  uni.navigateTo({
    url: '/pages/login/index'
  })
}
// 监听下拉刷新
onPullDownRefresh(() => {
  getHomeServiceData()
  getHotServeData()
})
// 跳转到服务列表页面和服务详情页面
const toService = (val, number) => {
  if (number === 1) {
    wx.reLaunch({
      url: '/pages/service/index'
    })
    uni.setStorageSync('activeId', val)
  } else {
    uni.navigateTo({
      url: `/pages/service/components/airMaintenance?id=${val}`
    })
  }
}
// 跳转到城市选择页面
const toCity = () => {
  uni.navigateTo({
    url: '/pages/city/index'
  })
}
// 跳转到评价页面
const toEvaluate = () => {
  uni.navigateTo({
    url: '/subPages/order/components/evaluate'
  })
}
// 获取金刚区图标
const getHomeServiceData = async () => {
  if (uni.getStorageSync('city').id) {
    await getHomeService({
      regionId: uni.getStorageSync('city').id
    }).then((res) => {
      if (res.data.code === 200) {
        menuData.value = res.data.data
      }
    })
  }
}
// 获取热门服务
const getHotServeData = async () => {
  if (uni.getStorageSync('city').id) {
    await getHotServe({
      regionId: uni.getStorageSync('city').id
    }).then((res) => {
      if (res.data.code === 200) {
        hotData.value = res.data.data
      }
    })
  }
}
// 搜索
const handleSearch = () => {
  uni.navigateTo({
    url: `/pages/search/index`
  })
}
</script>
<style lang="scss" scoped src="./index.scss"></style>
