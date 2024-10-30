<template>
    <!-- 公用nav带搜索 -->
    <view class="navBox">
        <view class="search ">
            <!-- 头部自定义导航 -->
            <view :style="{'paddingTop':capsuleTop +'px'}" class="uni-navbar">
                <view class="input-view">
                    <uni-icons class="input-uni-icon" color="#999" size="18" type="search"/>
                    <input
                        v-model="searchVal"
                        class="nav-bar-input"
                        confirm-type="search"
                        placeholder="请输入"
                        type="text"
                        @confirm="handleSearch"
                        @input="handleSearch"
                    />
                    <icon v-if="searchVal" size="14" type="clear" @click="handleCancel"></icon>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue';
import {
    onLoad
} from '@dcloudio/uni-app';

const props = defineProps({
    isShowCancel: {
        type: Boolean,
        default: false
    }
})
// ------定义变量------
const emit = defineEmits('handleSearch'); //子组件向父组件事件传递
const searchVal = ref('');
//胶囊顶部距离头部的距离
let capsuleTop = ref()
// -----方法------
onLoad(() => {
    uni.getSystemInfo({
        success: () => {
            capsuleTop.value = uni.getMenuButtonBoundingClientRect().top

        }
    })
})
// 取消搜索
const handleCancel = () => {
    searchVal.value = '';
    emit('handleSearch', searchVal);
};
// 搜索
const handleSearch = (e) => {
    searchVal.value = e.detail.value
    emit('handleSearch', searchVal);
};
</script>
<style lang="scss" scoped src="./index.scss"></style>
