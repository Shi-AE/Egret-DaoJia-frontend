<!-- 列表 -->
<template>
    <view class="homeList">
        <view
            v-for="item in list.data"
            :key="item.id"
            class="card"
            @click="handleToInfo(item)"
        >
            <view class="card-content">
                <image
                    :src="item.serveItemImg || '../../../static/new/empty.png'"
                    class="leftCardContent"
                ></image>
                <view class="rightCardContent">
                    <view class="title">
                        {{ item.serveItemName }}
                        <!-- {{ item.id }} -->
                    </view>
                    <view class="serviceTime">
                        <text>{{
                                item.serveStatus === 1
                                    ? '预约时间'
                                    : item.serveStatus === 2
                                        ? '服务开始时间'
                                        : '服务完成时间'
                            }}
                        </text>
                        <text class="content">{{
                                handleTime(
                                    item.serveStatus === 1
                                        ? item.serveStartTime
                                        : item.serveStatus === 2
                                            ? item.realServeStartTime
                                            : item.realServeEndTime
                                )
                            }}
                        </text>
                    </view>
                </view>
                <view
                    :class="[3, 4, 5].includes(item.serveStatus) ? 'gray' : ''"
                    class="orderStatus"
                >{{
                        orderStatus.filter((item1) => item1.value === item.serveStatus)
                            .length &&
                        orderStatus.filter((item1) => item1.value === item.serveStatus)[0]
                            .label
                    }}
                </view
                >
            </view>
            <view class="serviceAddress">
                <view class="address">
                    <view class="addressContent">{{ item.serveAddress }}</view>
                </view>
            </view>
            <view v-if="[1, 2].includes(item.serveStatus)" class="cardFooter">
                <view
                    v-if="[1].includes(item.serveStatus)"
                    class="robBtn btn-gray"
                    @click.stop="handleCancel(item.id)"
                >取消订单
                </view
                >
                <view
                    v-if="[1, 2].includes(item.serveStatus)"
                    class="robBtn btn-red"
                    @click.stop="handleServeRecord(item.id, item.serveStatus)"
                >{{ item.serveStatus === 1 ? '开始服务' : '完成服务' }}
                </view
                >
            </view>
        </view>
        <!-- 加载底部 -->
        <view class="footer">- 已 经 到 底 了 -</view>
    </view>
</template>

<script setup>
import { onMounted, reactive, watchEffect } from 'vue';
// 基本数据(订单状态)
import { orderStatus } from '@/utils/commonData.js';

const emit = defineEmits(['refresh']); //子组件向父组件事件传递
// 获取父组件值、方法
const props = defineProps({
    data: {
        type: Array,
        default: () => [],
    },
});
onMounted(() => {
});
let list = reactive({
    data: [
        {
            serveTypeName: '保洁服务',
            serveItemName: '空调清洗',
            serveStartTime: '2023-7-28 11:48:00',
            serveAddress: '金燕龙',
            serveFee: '666',
        },
    ],
});
const handleTime = (val) => {
    return val ? val.replace(/:\d{2}$/, '') : '';
};
// 前往详情页
const handleToInfo = (item) => {
    uni.navigateTo({
        url: '/pages/orderInfo/index?id=' + item.id + '&type=history',
    });
};
// 前往取消列表
const handleCancel = (id) => {
    uni.navigateTo({
        url: '/pages/cancel/index?id=' + id + '&type=list',
    });
};
// 前往服务记录
const handleServeRecord = (id, status) => {
    uni.navigateTo({
        url:
            '/pages/serveRecord/index?status=' +
            status +
            '&id=' +
            id +
            '&type=' +
            'list',
    });
};
watchEffect(() => {
    list.data = props.data;
});
</script>
<style lang="scss" src="../index.scss"></style>
