<!-- 我的评价 -->
<template>
    <view class="commit">
        <NavBar :isShowBack="true" title="我的评价"></NavBar>
        <view v-if="data.length === 0" class="empty-box">
            <image src="../../static/zwnr@2x.png"></image>
            <view>暂无评价哦～</view>
        </view>
        <scroll-view
            v-else
            :style="scrollHeight"
            class="scroll-view"
            lower-threshold="30"
            scroll-y
            @scrolltolower="LoadMoreCustomers"
        >
            <view v-for="(item, index) in data" :key="index" class="cardsBox">
                <view class="headBox">
                    <view class="left">
                        <view class="time">{{
                            formatDateTimeToDateTimeString(
                            new Date(item.createTime?.replace(/-/g, '/'))
                            )
                            }}
                        </view>
                        <view class="star">
                            <uni-rate
                                :disabled="true"
                                :size="14"
                                :value="item.totalScore"
                                activeColor="#F74145"
                                allow-half
                                color="#D8D8D8"
                                disabledColor="#F74145"
                                margin="1"
                            ></uni-rate>
                            <text>{{ item.totalScore }}分</text>
                        </view>
                    </view
                    >
                    <view class="right">
                        {{ item.evaluatorInfo?.isAnonymous === 1 ? '已匿名' : '' }}
                    </view>
                </view>

                <view class="bodyBox">
                    <text class="evaluationText"> {{ item.content }}</text>
                    <view v-if="item.pictureArray?.length > 0" class="photoList">
                        <image
                            v-for="(img, index) in item.pictureArray"
                            :key="index"
                            :src="img"
                            class="photo"
                            mode="scaleToFill"
                            @click="previewImage(img, item.pictureArray)"
                        />
                    </view>
                    <view class="orderInfo">
                        <view class="orderLeft">
                            <image :src="item.serveItemImg"></image>
                        </view>
                        <view class="orderRight">
                            <view class="serveName">{{ item.targetName }}</view>
                            <view class="address">地址：{{ item.serveAddress }}</view>
                            <view class="toOrderInfo" @click="toOrderInfo(item.relationId)"
                            >点击查看详情>
                            </view
                            >
                        </view>
                    </view>
                    <!-- <view class="replay">{{ item.replay }}</view> -->
                    <view class="footer">
                        <view class="operation" @click="openDelete(item.id)">
                            删除评价
                        </view>
                    </view>
                </view>
            </view>
            <view v-if="!isSendRequest" class="noMore">没有更多了</view>
        </scroll-view>

        <!-- 删除弹层 -->
        <DeletePopup
            ref="deleteRef"
            :errorTipText="errorTipText"
            @handleSub="subDelete"
        ></DeletePopup>
        <!-- end -->
    </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getCommentList, deleteComment } from '@/pages/api/order.js';
import { formatDateTimeToDateTimeString } from '@/utils/index.js';
// 删除弹层
import DeletePopup from '@/components/Operate/index.vue';

const deleteRef = ref(null); //定义取消弹层ref
const errorTipText = ref({
    title: '确定要删除该评价么？',
    text: '确定要删除该评价么？',
});
let scrollHeight = ref('');
const deleteId = ref('');
const data = ref([]);
const requestData = reactive({
    pageNo: 0,
    pageSize: 10,
});
const isSendRequest = ref(true);
onLoad(() => {
    uni.getSystemInfo({
        success: (res) => {
            scrollHeight.value = 'height:' + (res.screenHeight - 84) + 'px';
        },
    });
    getList();
});
// 获取列表
const getList = () => {
    if (!isSendRequest.value) {
        return;
    }
    requestData.pageNo = requestData.pageNo + 1;
    getCommentList(requestData).then((res) => {
        if (res.data.code == 200) {
            data.value.push(...res.data.data);
            if (res.data.data.length < requestData.pageSize) {
                isSendRequest.value = false;
            }
        } else {
            isSendRequest.value = false;
        }
    });
};

//上拉加载
const LoadMoreCustomers = () => {
    getList();
};
// 图片放大弹层
const previewImage = (url, val) => {
    uni.previewImage({
        current: url,
        urls: val,
        success: (res) => {
            console.log('success', res);
        },
        fail: (err) => {
            console.log('fail', err);
        },
    });
};
// 删除
const subDelete = () => {
    deleteComment(deleteId.value).then((res) => {
        if (res.data.code == 200) {
            uni.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000,
            });
            deleteRef.value.popup.close();
            data.value = [];
            isSendRequest.value = true;
            requestData.pageNo = 0;
            getList();
        }
    });
};
// 跳转到订单详情
const toOrderInfo = (val) => {
    uni.navigateTo({url: '/subPages/order/details?id=' + val});
};
// 打开删除弹层
const openDelete = (val) => {
    deleteId.value = val;
    deleteRef.value.popup.open();
};
</script>
<style scoped src="./index.scss">
/* @import url(); 引入css类 */
</style>
<style lang="less" scoped>
.noMore {
    text-align: center;
    padding: 10px 0;
    color: #999;
}

.empty-box {
    padding-top: 300rpx;
    height: 71vh;
    background-color: #fff;

    image {
        width: 320rpx;
        height: 288rpx;
        display: block;
        margin: 0 auto;
    }

    view {
        font-size: 26rpx;
        line-height: 36rpx;
        margin-top: 43rpx;
        text-align: center;
    }
}
</style>
