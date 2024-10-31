<template>
    <uni-nav-bar
        v-if="isLeftText"
        :title="title"
        fixed="true"
        statusBar="true"
    ></uni-nav-bar>
    <uni-nav-bar
        v-else
        :right-text="rithtText"
        :title="title"
        fixed="true"
        left-icon="back"
        leftIcon="arrowleft"
        statusBar="true"
        @clickLeft="goBack"
        @clickRight="handleAll"
    ></uni-nav-bar>
</template>

<script setup>
import { useStore } from 'vuex';
// 获取父组件数据
const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    rithtText: {
        type: String,
        default: '',
    },
    isLeftText: {
        type: Boolean,
    },
});
// ------定义变量------
const emit = defineEmits(); //子组件向父组件事件传递
const store = useStore(); //vuex获取、储存数据
const users = store.state.user; //vuex获取、储存数据
const taskStatus = users.taskStatus;
// ------定义方法------
const goBack = () => {
    emit('goBack');
};
const handleAll = () => {
    emit('handleAll');
};
</script>
<style lang="scss" scoped>
::v-deep .uni-nav-bar-right-text {
    font-size: 32rpx;
}
</style>
