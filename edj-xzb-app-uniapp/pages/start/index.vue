<!-- 启动页 -->
<template>
    <view class="starPage">
        <view class="page"></view>
        <view class="bottom"></view>
    </view>
</template>

<script>
import { onMounted } from 'vue';

export default {
    name: 'StarPage',
    setup: () => {
        onMounted(() => {
            const times = setTimeout(() => {
                uni.redirectTo({
                    url: '/pages/login/user',
                });
                clearTimeout(times);
            }, 3000);
        });
        return {};
    },
};
</script>

<style lang="scss" scoped src="./index.scss"></style>
