<!--预约列表-->
<template>
    <view :style="{'paddingTop':capsuleBottom +'px'}">
        <!-- tabl切换 -->
        <scroll-view :scroll-into-view="scrollinto" :scroll-with-animation="true" class="tabScroll" scroll-x="true">
            <view class="itemTab box">
                <view :class="activeIndex === 1 ? 'active' : ''" class="tabBox">
                    <view v-for="(item, index) in listTabData" :key="index"
                          :class="activeIndex === index ? 'active' : ''" class="tabItem" @click="changeTab(index)">
                        <view class="bLine"></view>
                        {{ item.label }}
                    </view>
                </view>
            </view>
        </scroll-view>
        <!-- end -->
        <!-- 列表 -->
        <view class="main">
            <!-- 垂直滚动区域  scroll和swiper的高度都要给且是一样的高度-->
            <view v-if="itemData.length > 0">
                <scroll-view :lower-threshold="10" scroll-y="true" @scrolltolower="scrolltoupperHandle">
                    <view class="timeList">
                        <view v-for="(item, index) in itemData" :key="index" class="box boxRadius item">
                            <view class="title">
                                <view class="date">{{ getNow(item.time) }}</view>
                                <view :class="item.type === 0 ? 'tagApp' : 'tagLook'" class="tag">
                                    <text>{{ item.type === 0 ? '参观预约' : '探访预约' }}</text>
                                </view>
                                <view class="mobile">{{ item.mobile }}</view>
                            </view>
                            <view class="time">
                                <text>{{ getTime(item.time) }}</text>

                                <view class="status">
                                    <text v-if="item.status === 0" class="fc-error">待上门</text>
                                    <text v-if="item.status === 1">已完成</text>
                                    <text v-if="item.status === 2">已取消</text>
                                    <text v-if="item.status === 3">已过期</text>
                                </view>
                            </view>
                            <view class="info">
                                {{ item.name }}
                                <text class="line"></text>
                                <text>家人：{{ item.visitor }}</text>
                                <view v-if="item.status === 0" class="footBtn">
                                    <view class="bt bt-grey btSmall" @click="handleCancel(item.id)">取消</view>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 下拉加载更多Lodding -->
                    <view>
                        <uni-load-more :status="moreStatus"/>
                    </view>
                    <!-- end -->
                </scroll-view>
            </view>
            <!-- 无数据显示 -->
            <view v-if="itemData.length === 0 && !loading">
                <EmptyPage :emptyInfo="emptyInfo"/>
            </view>
            <!-- end -->
        </view>
        <!-- end -->
    </view>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { getNow, getTime } from '@/utils/index.js';
import { onReachBottom, onShow, onLoad } from "@dcloudio/uni-app";
// 组件
// 无数据
import EmptyPage from '@/components/EmptyPage/index.vue';
// 基础数据
import { listTabData } from '@/utils/commonData.js';
// 获取父组件值、方法
const props = defineProps({
    itemData: {
        type: Array,
        default: () => []
    },
    moreStatus: {
        type: String,
        default: 'noMore'
    },
    loading: {
        type: Boolean,
        default: false
    }
});
// ------定义变量------
const emit = defineEmits(['setTabIndex', 'handleCancel', 'onReachBottom']);
const activeIndex = ref(0); //当前tab
const scrollinto = ref('tab0'); //tab切换
const emptyInfo = ref('未找到相关任务');
//胶囊底部距离头部的距离
let capsuleBottom = ref()
// ------定义方法------
onLoad(() => {
    uni.getSystemInfo({
        success: () => {
            capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom + 12
        }
    })
})
onShow(() => {
    activeIndex.value = 0//解决第二次进入此页面tab没有显示默认选中状态
})
// 切换tab
const changeTab = index => {
    // 点击的还是当前数据的时候直接return
    if (activeIndex.value == index) {
        return;
    }
    activeIndex.value = index;
    emit('setTabIndex', index);
};

// 上拉刷新
function scrolltoupperHandle() {
    emit('setTabIndex', index);
}

// 打开取消弹层
const handleCancel = id => {
    emit('handleCancel', id);
};
// 上下拉取
onReachBottom(() => {
    emit('onReachBottom')
});
// ------生命周期------
onUnmounted(() => {
    activeIndex.value = 0
})
</script>

<style></style>
