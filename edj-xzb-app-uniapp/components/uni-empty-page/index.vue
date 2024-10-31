<template>
    <view v-if="emptyInfo!==''" class="emptyBox">{{ emptyInfo }}</view>
    <view v-else class="empty">
        <view :class="emptyImage" class="image"></view>
        {{ emptyData }}
    </view>
</template>

<script setup>
// 获取父组件值、方法
const props = defineProps({
    emptyInfo: {
        type: String,
        default: '',
    },
    emptyData: {
        type: String,
        default: '',
    },
    emptyImage: {
        type: String,
        default: '',
    }
})
</script>

<style lang="scss" scoped src="../../styles/common.scss"></style>
