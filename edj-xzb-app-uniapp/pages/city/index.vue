<template>
  <view class="city">
    <!-- nav -->
    <UniNav title="选择服务城市" @goBack="goBack"></UniNav>

    <scroll-view
      :scroll-into-view="scrollIntoId"
      :style="{ height: scrollHeight }"
      class="w100"
      scroll-y="true"
      @touchmove.stop.prevent
    >
      <view v-if="disPosition" id="hot">
        <view class="grey"> 当前定位城市</view>
        <!-- 定位模块 -->
        <view class="position top">
          <view class="position_city">
            <view class="position_city_one" @click="selectCity(currentCity)">
              {{ currentCity ? currentCity.name : '定位失败' }}
            </view>
            <view class="WarpWeft" @click="getWarpWeft">
              <image class="image" src="../../static/new/positions.png" />
              <text>{{ po_tips }}</text>
            </view>
          </view>
        </view>
        <view v-if="hotCity.length" class="hot grey"> 热门城市</view>
        <!-- 最近模块 -->
        <!-- 热门 -->
        <view v-if="hotCity.length" class="position hotCity">
          <view class="position_city position_city_hot">
            <view
              v-for="(item, index) in hotCity"
              :key="index"
              :class="
                activeId === item.cityCode
                  ? 'position_city_tag_active position_city_tag'
                  : 'position_city_tag'
              "
              @tap="activeCity(item)"
            >
              {{ item.name }}
            </view>
          </view>
        </view>
        <view class="grey"> 已开通的城市</view>
      </view>

      <!-- 城市列表 -->
      <view
        v-for="(item, index) in list"
        :id="item.id"
        :key="index"
        class="cityList"
      >
        <view class="contents">
          <view class="city-div" @click="selectCity(item)">
            <text class="city">{{ item.name }}</text>
          </view>
        </view>
      </view>

      <view class="placeholder footer"></view>
    </scroll-view>

    <!-- 右侧字母 -->
    <view
      v-show="false"
      id="list"
      class="letters"
      @touchend="touchEnd"
      @touchstart="touchStart"
      @touchmove.stop.prevent="touchMove"
    >
      <view v-for="item in letter" :key="item.idx" class="fmin">{{
          item.idx
        }}
      </view>
    </view>

    <!-- 选中之后字母 -->
    <view v-show="false" class="mask">
      <view class="mask-r bold">{{ scrollIntoId }}</view>
    </view>
  </view>
</template>

<script setup>
// 导航组件
import UniNav from '@/components/uni-nav/index.vue'
import { useStore } from 'vuex'
import { getAddress, getOpenCity } from '../api/setting.js'
import { Citys } from '@/pages/city/city.js'
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
// import { getAddress } from '../api/address';
const store = useStore() //vuex获取、储存数据
const address = ref('')
const customBar = ref('87px') //导航栏高度
const winHeight = ref(0) //屏幕高度
const itemHeight = ref(0) //每个item的高度
const winOffsetY = ref(0) //滚动条距离顶部的距离
const touchmove = ref(false) //是否滑动
const scrollHeight = ref('') //滚动高度
const letter = ref([]) //字母
const scrollIntoId = ref('') //滚动到的id
const list = ref([]) //城市列表
const activeId = ref(1) //选中的id
const disPosition = ref(true) //是否显示定位
// 当前所在城市
const currentCity = ref()
const po_tips = ref('重新定位')
const hotCity = ref([
  { name: '北京市', cityCode: '010' },
  { name: '上海市', cityCode: '021' },
  { name: '广州市', cityCode: '020' },
  { name: '深圳市', cityCode: '0755' }
])
const instance = getCurrentInstance() //获取当前实例
// 获取元素信息，并用于计算
const setList = () => {
  uni
    .createSelectorQuery()
    .in(instance)
    .select('#list')
    .boundingClientRect()
    .exec((ret) => {
      winOffsetY.value = ret[0].top
      winHeight.value = ret[0].height
      itemHeight.value = winHeight.value / list.value.length
    })
}
onLoad((option) => {
  address.value = option.address
})
// 返回上一页
const goBack = () => {
  uni.navigateBack()
}
// touchStart是手指触摸到屏幕触发的事件
const touchStart = (e) => {
  touchmove.value = true
  let pageY = e.touches[0].pageY
  let index = Math.floor((pageY - winOffsetY.value) / itemHeight.value)
  if (list.value[index]) {
    scrollIntoId.value = list.value[index].idx
  }
}
// touchMove是手指在屏幕上滑动触发的事件
const touchMove = (e) => {
  let pageY = e.touches[0].pageY
  let index = Math.floor((pageY - winOffsetY.value) / itemHeight.value)
  if (list.value[index] && list.value[index].idx === scrollIntoId.value) {
    return false
  }
  if (list.value[index]) {
    scrollIntoId.value = list.value[index].idx
  }
}
// touchEnd是手指离开屏幕触发的事件
const touchEnd = () => {
  touchmove.value = false
}

const activeCity = (val) => {
  activeId.value = val.cityCode
  selectCity(val)
}
onMounted(() => {
  getWarpWeft()
  scrollHeight.value =
    uni.getSystemInfoSync().windowHeight - parseInt(customBar.value) + 'px'
  letter.value = Citys.index
  list.value = Citys.list
  setList()
  getOpenCity().then((res) => {
    list.value = res.data
    let arr = []
    hotCity.value.map((item) => {
      list.value.map((item1) => {
        if (item1.cityCode === item.cityCode) {
          arr.push(item)
        }
      })
    })
    hotCity.value = arr
  })
})
// 定位
const getWarpWeft = () => {
  po_tips.value = '定位中...'
  // 获取定位
  uni.getLocation({
    type: 'gcj02',
    geocode: false,
    success: function(res) {
      getAddress({
        location: res.longitude + ',' + res.latitude
      }).then((res) => {
        if (res.code === 200) {
          const data = res.data

          currentCity.value = {
            name: data.city,
            cityCode: data.cityCode
          }

          activeId.value = data.cityCode
        }

        // 延时500毫秒，保证效果，展现出定位中的过程
        setTimeout(() => {
          po_tips.value = '重新定位'
        }, 500)
      })
    },
    fail: function() {
      setTimeout(() => {
        po_tips.value = '定位失败'
      }, 500)
      disPosition.value = true
    }
  })
}
const selectCity = (city) => {
  currentCity.value = city
  store.commit('user/setCityCode', city.cityCode)
  store.commit('user/setCityName', city.name)
  uni.navigateBack()
}
watch(list, () => {
  setTimeout(() => {
    setList()
  }, 100)
})
</script>

<style lang="scss" scoped src="./index.scss"></style>
