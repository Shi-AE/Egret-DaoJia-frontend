<!-- 底部按钮 -->
<template>
    <view class="BtnFooter">
        <view :class="isActive ? 'active' : ''" class="btn" @click="handleClick">{{
            btnText
            }}
        </view>
    </view>
</template>

<script setup>
defineProps({
    btnText: {
        type: String,
        default: '确定',
    },
    isActive: {
        type: Boolean,
        default: false,
    },
});
const emits = defineEmits(['@confirm']);

const handleClick = () => {
    emits('confirm');
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
