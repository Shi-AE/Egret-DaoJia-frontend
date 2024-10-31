<template>
    <!-- 公用nav -->
    <view class="navBox">
        <view class="search ">
            <!-- 头部自定义导航 -->
            <!-- <uni-nav-bar right-text="取消" @clickRight="handleCancel"> -->
            <view class="uni-navbar">
                <view class="input-view">
                    <uni-icons class="input-uni-icon" color="#999" size="18" type="search"/>
                    <input
                        v-model="searchVal"
                        class="nav-bar-input"
                        clearable
                        confirm-type="search"
                        placeholder="输入四位或完整运单号/手机号、姓名"
                        type="text"
                        @confirm="handleBlur"
                        @input="handleSearch"
                    />
                    <text v-if="searchVal" class="icon_close" @click="handleClear"></text>
                    <!-- <view class="scanIcon" @click="handleQr"></view> -->
                </view>
                <view v-if="isShowCancel" class="concelBox" @click="handleCancel">取消</view>
            </view>
            <!-- </uni-nav-bar> -->
            <!-- end -->
        </view>
    </view>
    <!-- end -->
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore(); //vuex获取、储存数据
const users = store.state.user;
const props = defineProps({
    isShowCancel: {
        type: Boolean,
        default: false
    }
})
// ------定义变量------
const emit = defineEmits('handleSearch'); //子组件向父组件事件传递
const searchVal = ref('');
// -----方法------
// 取消搜索
const handleCancel = () => {
    searchVal.value = '';
    // 设置搜索的内容，从详情页返回搜索页的时候显示默认搜索的内容
    store.commit('user/setSearchText', '');
    if (users.taskStatus === -1) {
        uni.redirectTo({
            url: '/pages/my/index'
        });
    } else {
        emit('goBack')
    }

};
// 搜索
const handleSearch = () => {
    emit('handleSearch', searchVal);
};
// 离开input框
const handleBlur = () => {
    emit('handleBlur')
}
// 清空
const handleClear = () => {
    searchVal.value = '';
    emit('clearSearchData')
}
// 扫二维码
const handleQr = () => {
};
// 暴漏给父组件
defineExpose({
    searchVal
});
</script>
