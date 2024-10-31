<template>
    <view class="nav-bg mnav-bg">
        <view class="headBg"></view>
        <view class="header">
            <view class="headBox">
                <view class="head"
                >
                    <icon v-if="baseData.avatar === ''"></icon
                    >
                    <image
                        v-else
                        :src="baseData.avatar || '../../../static/new/toux.png'"
                    ></image
                    >
                </view>
                <view class="info">
                    <view class="tit">
                        <view class="name">{{ baseData.name || '吴彦祖' }}</view>
                        <view v-if="certificationStatus === 2" class="isAuth">已认证</view>
                    </view>
                    <view class="account">{{ baseData.phone || '177 9987 8876' }}</view>
                </view>
            </view>
        </view>
    </view>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { getUserSetting } from '../../api/setting.js';
// 获取父组件数据
const props = defineProps({
    baseData: {
        type: Object,
        default: () => ({}),
    },
});
const certificationStatus = ref(0); //是否实名认证
onMounted(() => {
    getUserSetting()
        .then((res) => {
            if (res.code == 200) {
                certificationStatus.value = res.data.certificationStatus;
            }
        })
        .catch((err) => {
            uni.showToast({
                title: err.msg || '接口调用失败',
                duration: 1500,
                icon: 'none',
            });
        });
});
</script>
<style lang="scss" scoped src="./../index.scss"></style>
