<!-- 我的页面 -->
<template>
    <view class="myPage">
        <!-- 标题 -->>
        <!-- end -->
        <view :style="{ paddingTop: capsuleBottom + 'px' }" class="main">
            <view class="head" @click="handleClick">
                <image src="https://patchwiki.biligame.com/images/wukong/thumb/7/73/t82zkeepma4ani56u4xu1qt9rwu18yw.png/427px-%E4%BA%BA%E7%89%A9-%E5%A4%A7%E5%9C%A3%E6%AE%8B%E8%BA%AF-%E5%BD%B1%E7%A5%9E%E5%9B%BE.png"></image>
                <view class="text">{{
                    accessToken && nickName ? nickName : '立即登录'
                    }}
                </view>
            </view>
            <view class="box boxRadius">
                <!-- 我的订单 -->
                <view class="order">
                    <view class="lText">我的订单</view>
                    <view class="rText" @click="handleOrder('')"
                    >查看全部
                        <icon class="nextIcon iconOpacity"></icon>
                    </view>
                </view>
                <!-- end -->
                <!-- 快速导航 -->
                <FastMenu @handle-order="handleOrder"></FastMenu>
                <!-- end -->
            </view>
            <!-- 我的导航 -->
            <view class="box boxRadius">
                <MyMenu
                    @handleAddress="handleAddress"
                    @handleCoupon="handleCoupon"
                    @handle-bill="handleBill"
                ></MyMenu>
            </view>
            <view class="phoneMenu">
                <view class="item">
                    <view @click="handlePhone"
                    >
                        <text>客服电话</text>
                        <test>400-000-4000</test>
                    </view
                    >
                </view>
            </view>
        </view>
        <!-- footer -->
        <UniFooter :pagePath="'/pages/my/index'"></UniFooter>
        <!-- end -->
    </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onShow, } from '@dcloudio/uni-app';
// 接口api
import { useStore } from 'vuex';
// 组件
// 快速入口
import FastMenu from './components/FastMenu.vue';
import MyMenu from './components/MyMenu.vue';

// ------定义变量------
const store = useStore(); //存储获取数据
const nickName = ref(null); //昵称
const accessToken = ref(null); //token
//胶囊底部距离头部的距离
let capsuleBottom = ref();
// ------生命周期------
onShow(() => {
    // 获取nickName
    nickName.value = uni.getStorageSync('nickName');
    // 获取token
    accessToken.value = uni.getStorageSync('accessToken');
});
onLoad(() => {
    uni.getSystemInfo({
        success: (res) => {
            capsuleBottom.value = uni.getMenuButtonBoundingClientRect().bottom + 12;
        },
    });
});
// ------定义方法------
// 如果没有登录，进入登录页面
const handleClick = () => {
    if (!accessToken.value && !nickName.value) {
        goLogin();
    }
};
// 订单列表页
const handleOrder = (val) => {
    if (val != undefined) {
        store.commit('user/setOrderStatus', val);
    }
    if (!accessToken.value && !nickName.value) {
        goLogin();
    } else {
        store.commit('user/setBackLike', 'my');
        uni.navigateTo({
            url: '/subPages/order/index',
        });
    }
};
// 我的地址
const handleAddress = () => {
    if (!accessToken.value && !nickName.value) {
        goLogin();
    } else {
        uni.navigateTo({
            url: '/pages/address/index?type=address&isFromAddress=true',
        });
    }
};
// 我的优惠券
const handleCoupon = () => {
    if (!accessToken.value && !nickName.value) {
        goLogin();
    } else {
        uni.navigateTo({
            url: '/pages/coupon/coupon',
        });
    }
};
// 我的评价
const handleBill = () => {
    if (!accessToken.value && !nickName.value) {
        goLogin();
    } else {
        uni.navigateTo({
            url: '/pages/commit/index',
        });
    }
};
// 进入登录页
const goLogin = () => {
    store.commit('setRouter', 'pages/my/index');
    uni.navigateTo({
        url: '/pages/login/index',
    });
};
// 客服电话
const handlePhone = () => {
    uni.makePhoneCall({
        phoneNumber: '400-000-4000',
    });
};
// 暴露给父组件
defineExpose({});
</script>
<style lang="scss" scoped src="./index.scss"></style>
