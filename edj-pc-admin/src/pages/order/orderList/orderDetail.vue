<template>
  <div class="detailBox">
    <t-card v-if="stepsData" :bordered="false">
      <t-steps :current="activeStep" class="step-container" status="process">
        <t-step-item
          v-for="(item, key) in stepsData"
          :key="key"
          :content="item.dateTime"
          :title="item.status"
        />
      </t-steps>
    </t-card>
    <!-- 订单信息 -->
    <div class="Card bg-wt">
      <div class="title">订单信息</div>
      <div class="bodyBox">
        <div class="tagBox">
          <div class="leftBox">
            <div class="tag">订单编号</div>
            <div class="content">{{ detailData.orderInfo?.id }}</div>
          </div>
          <div class="rightBox">
            <div class="tag">订单状态</div>
            <div class="content">
              <span
                v-if="detailData.orderInfo?.ordersStatus === 0"
                class="status-dot status-dot-0"
              >待支付</span
              >
              <span
                v-if="detailData.orderInfo?.ordersStatus === 100"
                class="status-dot status-dot-0"
              >派单中</span
              >
              <span
                v-if="detailData.orderInfo?.ordersStatus === 200"
                class="status-dot status-dot-0"
              >待服务</span
              >
              <span
                v-if="detailData.orderInfo?.ordersStatus === 300"
                class="status-dot status-dot-0"
              >服务中</span
              >
              <span
                v-if="detailData.orderInfo?.ordersStatus === 400"
                class="status-dot status-dot-0"
              >待评价</span
              >
              <span
                v-if="detailData.orderInfo?.ordersStatus === 500"
                class="status-dot status-dot-2"
              >已完成</span
              >
              <span
                v-if="detailData.orderInfo?.ordersStatus === 600"
                class="status-dot status-dot-2"
              >已取消</span
              >
              <span
                v-if="detailData.orderInfo?.ordersStatus === 700"
                class="status-dot status-dot-1"
              >已关闭</span
              >
            </div>
          </div>
        </div>
        <div class="tagBox">
          <div class="leftBox">
            <div class="tag">下单时间</div>
            <div class="content">
              {{
                formatDateTimeToDateTimeString(
                  new Date(detailData.orderInfo?.createTime)
                )
              }}
            </div>
          </div>
          <div class="rightBox">
            <div class="tag">服务名称</div>
            <div class="content">{{ detailData.orderInfo?.serveItemName }}</div>
          </div>
        </div>
        <div class="tagBox">
          <div class="leftBox">
            <div class="tag">客户电话</div>
            <div class="content">{{ detailData.orderInfo?.contactsPhone }}</div>
          </div>
          <div class="rightBox">
            <div class="tag">客户姓名</div>
            <div class="content">{{ detailData.orderInfo?.contactsName }}</div>
          </div>
        </div>
        <div class="tagBox">
          <div class="leftBox">
            <div class="tag">预约时间</div>
            <div class="content">
              {{
                formatDateTimeToDateTimeString(
                  new Date(detailData.orderInfo?.serveStartTime)
                )
              }}
            </div>
          </div>
          <div class="rightBox">
            <div class="tag">服务地址</div>
            <div class="content">{{ detailData.orderInfo?.serveAddress }}</div>
          </div>
        </div>
        <div
          v-if="detailData.orderInfo?.serveProviderType !== null"
          class="tagBox"
        >
          <div class="leftBox">
            <div class="tag">服务人员电话</div>
            <div
              v-if="detailData.orderInfo?.serveProviderType === 3"
              class="content"
            >
              {{
                detailData.orderInfo?.institutionStaffPhone
                  ? detailData.orderInfo?.institutionStaffPhone
                  : '-'
              }}
            </div>
            <div
              v-if="detailData.orderInfo?.serveProviderType === 2"
              class="content"
            >
              {{
                detailData.orderInfo?.serveProviderPhone
                  ? detailData.orderInfo?.serveProviderPhone
                  : '-'
              }}
            </div>
          </div>
          <div class="rightBox">
            <div class="tag">服务人员姓名</div>
            <div
              v-if="detailData.orderInfo?.serveProviderType === 3"
              class="content"
            >
              {{
                detailData.orderInfo?.institutionStaffName
                  ? detailData.orderInfo?.institutionStaffName
                  : '-'
              }}
            </div>
            <div
              v-if="detailData.orderInfo?.serveProviderType === 2"
              class="content"
            >
              {{
                detailData.orderInfo?.serveProviderName
                  ? detailData.orderInfo?.serveProviderName
                  : '-'
              }}
              <!-- <span class="company">{{
                splitText(detailData.orderInfo?.serveProviderName).text2
              }}</span> -->
            </div>
          </div>
        </div>
        <div
          v-if="detailData.orderInfo?.serveProviderType === 3"
          class="tagBox"
        >
          <div class="leftBox">
            <div class="tag">企业电话</div>
            <div class="content">
              {{
                detailData.orderInfo?.serveProviderPhone
                  ? detailData.orderInfo?.serveProviderPhone
                  : '-'
              }}
            </div>
          </div>
          <div class="rightBox">
            <div class="tag">企业名称</div>
            <div class="content">
              {{
                detailData.orderInfo?.serveProviderName
                  ? detailData.orderInfo?.serveProviderName
                  : '-'
              }}
              <!-- <span class="company">{{
                splitText(detailData.orderInfo?.serveProviderName).text2
              }}</span> -->
            </div>
          </div>
        </div>
        <div class="tagBox">
          <div class="leftBox">
            <div class="tag">服务数量</div>
            <div class="content">
              {{ detailData.orderInfo?.purNum }}
              <span v-if="detailData.orderInfo?.unit">{{
                  UNIT[detailData.orderInfo?.unit - 1].label
                }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end -->
    <!-- 支付记录 -->
    <div
      v-if="
        detailData.orderInfo?.ordersStatus !== 0 || detailData.payInfo !== null
      "
      class="Card bg-wt"
    >
      <div class="title">支付记录</div>
      <div class="bodyBox">
        <div class="tagBox">
          <div class="leftBox">
            <div class="tag">支付状态</div>
            <div class="content">
              <span
                v-if="detailData.payInfo?.payStatus === 2"
                class="status-dot status-dot-1"
              >未支付</span
              >
              <span
                v-if="detailData.payInfo?.payStatus === 4"
                class="status-dot status-dot-0"
              >已支付</span
              >
            </div>
          </div>
          <div
            v-if="
              detailData.orderInfo?.ordersStatus !== 600 &&
              detailData.payInfo?.payStatus === 4
            "
            class="rightBox"
          >
            <div class="tag">支付渠道</div>
            <div class="content">线上支付</div>
          </div>
        </div>
        <div
          v-if="
            detailData.orderInfo?.ordersStatus !== 600 &&
            detailData.payInfo?.payStatus === 4
          "
          class="tagBox"
        >
          <div class="leftBox">
            <div class="tag">支付方式</div>
            <div class="content">
              {{
                detailData.payInfo?.tradingChannel === 'WECHAT_PAY'
                  ? '微信'
                  : '支付宝'
              }}
            </div>
          </div>
          <div class="rightBox">
            <div class="tag">
              {{
                detailData.payInfo?.tradingChannel === 'WECHAT_PAY'
                  ? '微信'
                  : '支付宝'
              }}支付订单号
            </div>
            <div class="content">
              {{
                detailData.payInfo?.thirdOrderId
                  ? detailData.payInfo?.thirdOrderId
                  : '-'
              }}
            </div>
          </div>
        </div>
        <div
          v-if="
            detailData.orderInfo?.ordersStatus !== 600 &&
            detailData.payInfo?.payStatus === 4
          "
          class="tagBox"
        >
          <div class="leftBox">
            <div class="tag">支付金额</div>
            <div class="content">￥{{ detailData.payInfo?.totalAmount }}</div>
          </div>
          <div class="rightBox">
            <div class="tag">实付金额</div>
            <div class="content">￥{{ detailData.payInfo?.realPayAmount }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- end -->
    <div
      v-if="
        detailData.orderInfo?.ordersStatus !== 200 &&
        detailData.orderInfo?.ordersStatus !== 100 &&
        detailData.orderInfo?.ordersStatus !== 0 &&
        detailData.serveInfo?.realServeStartTime !== null
      "
      class="Card bg-wt"
    >
      <div class="title">服务记录</div>
      <div class="bodyBox">
        <div class="serviceSplit">
          <span>服务前</span>
          <span class="line"></span>
        </div>
        <div class="tagBox">
          <div class="leftBox">
            <div class="tag">服务前照片</div>
            <div v-if="detailData.serveInfo?.serveBeforeImgs" class="content">
              <t-image-viewer
                v-for="(item, index) in detailData.serveInfo?.serveBeforeImgs"
                :key="index"
                :default-index="index"
                :images="detailData.serveInfo?.serveBeforeImgs"
              >
                <template #trigger="{ open }">
                  <div class="tdesign-demo-image-viewer__ui-image">
                    <img
                      :src="item"
                      alt="test"
                      class="tdesign-demo-image-viewer__ui-image--img"
                    />
                    <div
                      class="tdesign-demo-image-viewer__ui-image--hover"
                      @click="open"
                    >
                      <span><ZoomInIcon size="1.8em"/> </span>
                    </div>
                  </div>
                </template>
              </t-image-viewer>
            </div>
            <div v-else class="content">-</div>
          </div>
          <div class="rightBox">
            <div class="tag">开始服务时间</div>
            <div class="content">
              {{
                formatDateTimeToDateTimeString(
                  new Date(detailData.serveInfo?.realServeStartTime)
                )
              }}
            </div>
          </div>
        </div>
        <div class="tagBox">
          <div class="tag">补充说明</div>
          <div class="content">
            {{
              detailData.serveInfo?.serveBeforeIllustrate
                ? detailData.serveInfo?.serveBeforeIllustrate
                : '无'
            }}
          </div>
        </div>
        <div
          v-if="detailData.orderInfo?.ordersStatus > 300"
          class="serviceSplit"
        >
          <span>服务后</span>
          <span class="line"></span>
        </div>
        <div v-if="detailData.orderInfo?.ordersStatus > 300" class="tagBox">
          <div v-if="detailData.orderInfo?.ordersStatus > 300" class="leftBox">
            <div class="tag">服务后照片</div>
            <div v-if="detailData.serveInfo?.serveAfterImgs" class="content">
              <t-image-viewer
                v-for="(item, index) in detailData.serveInfo?.serveAfterImgs"
                :key="index"
                :default-index="index"
                :images="detailData.serveInfo?.serveAfterImgs"
              >
                <template #trigger="{ open }">
                  <div class="tdesign-demo-image-viewer__ui-image">
                    <img
                      :src="item"
                      alt="test"
                      class="tdesign-demo-image-viewer__ui-image--img"
                    />
                    <div
                      class="tdesign-demo-image-viewer__ui-image--hover"
                      @click="open"
                    >
                      <span><ZoomInIcon size="1.8em"/> </span>
                    </div>
                  </div>
                </template>
              </t-image-viewer>
            </div>
            <div v-else class="content">-</div>
          </div>
          <div class="rightBox">
            <div class="tag">结束服务时间</div>
            <div class="content">
              {{
                formatDateTimeToDateTimeString(
                  new Date(detailData.serveInfo?.realServeEndTime)
                )
              }}
            </div>
          </div>
        </div>
        <div v-if="detailData.orderInfo?.ordersStatus > 300" class="tagBox">
          <div class="tag">补充说明</div>
          <div class="content">
            {{
              detailData.serveInfo?.serveAfterIllustrate
                ? detailData.serveInfo?.serveAfterIllustrate
                : '无'
            }}
          </div>
        </div>
      </div>
    </div>
    <!-- end -->
    <!-- 收益记录 -->
    <div
      v-if="
        detailData.payInfo?.payStatus === 4 &&
        detailData.orderInfo?.ordersStatus !== 600 &&
        detailData.orderInfo?.ordersStatus !== 700
      "
      class="Card bg-wt"
    >
      <div class="title">收益记录</div>
      <div class="bodyBox">
        <div class="tagBox">
          <div class="leftBox">
            <div class="tag">实付金额</div>
            <div class="content">{{ detailData.payInfo?.realPayAmount }}</div>
          </div>
          <div class="rightBox">
            <div class="tag">入金手续费</div>
            <div class="content">
              {{ detailData.payInfo?.realPayAmount * 0.003 }}
            </div>
          </div>
        </div>
        <div class="tagBox">
          <div class="leftBox">
            <div class="tag">平台收成</div>
            <div class="content">
              {{
                formatNumber(detailData.payInfo?.realPayAmount * 0.997 * 0.3)
              }}
            </div>
          </div>
          <div class="rightBox">
            <div class="tag">服务方收成</div>
            <div class="content">
              {{
                formatNumber(detailData.payInfo?.realPayAmount * 0.997 * 0.7)
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end -->
    <!-- 退款记录 -->
    <div
      v-if="
        detailData.refundInfo?.refundStatus !== null &&
        detailData.payInfo?.payStatus === 4 &&
        detailData.refundInfo !== null
      "
      class="Card bg-wt"
    >
      <div class="title">退款记录</div>
      <div class="bodyBox">
        <div class="tagBox">
          <div class="leftBox">
            <div class="tag">退款状态</div>
            <div
              v-if="detailData.refundInfo?.refundStatus === 0"
              class="content"
            >
              发起退款
            </div>
            <div
              v-if="detailData.refundInfo?.refundStatus === 1"
              class="content status-dot status-dot-0"
            >
              退款中
            </div>
            <div
              v-if="detailData.refundInfo?.refundStatus === 2"
              class="content status-dot status-dot-2"
            >
              退款成功
            </div>
            <div
              v-if="detailData.refundInfo?.refundStatus === 3"
              class="content status-dot status-dot-1"
            >
              退款失败
            </div>
          </div>
          <div class="rightBox">
            <div class="tag">退款人</div>
            <div
              v-if="detailData.refundInfo?.cancellerType === 0"
              class="content"
            >
              系统退款
            </div>
            <div v-else class="content">
              {{
                detailData.refundInfo?.cancelerName
              }}<span v-if="detailData.refundInfo?.cancellerType === 4"
            >（平台）</span
            >
            </div>
          </div>
        </div>
        <div class="tagBox">
          <div class="leftBox">
            <div class="tag">申请时间</div>
            <div class="content">
              {{
                formatDateTimeToDateTimeString(
                  new Date(detailData.refundInfo?.cancelTime)
                )
              }}
            </div>
          </div>
          <div class="rightBox">
            <div class="tag">退款原因</div>
            <div class="content">{{ detailData.refundInfo?.cancelReason }}</div>
          </div>
        </div>
        <div class="tagBox">
          <div class="leftBox">
            <div class="tag">退款渠道</div>
            <div class="content">原路退回</div>
          </div>
          <div class="rightBox">
            <div class="tag">退款方式</div>
            <div class="content">
              {{
                detailData.refundInfo?.tradingChannel === 'WECHAT_PAY'
                  ? '微信'
                  : '支付宝'
              }}
            </div>
          </div>
        </div>
        <div
          v-if="detailData.refundInfo?.thirdRefundOrderId !== null"
          class="tagBox"
        >
          <div class="leftBox">
            <div class="tag">
              {{
                detailData.refundInfo?.tradingChannel === 'WECHAT_PAY'
                  ? '微信'
                  : '支付宝'
              }}支付退款单号
            </div>
            <div class="content">
              {{
                detailData.refundInfo?.thirdRefundOrderId
                  ? detailData.refundInfo?.thirdRefundOrderId
                  : '-'
              }}
            </div>
          </div>
          <div class="rightBox">
            <div class="tag">退款金额</div>
            <div class="content">
              ￥{{ detailData.refundInfo?.realPayAmount }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end -->
    <!-- 评价状态 -->
    <div v-if="detailData.payStatus === 3" class="Card bg-wt">
      <div class="title">评价记录</div>
      <div class="bodyBox">
        <div class="tagBox">
          <div class="leftBox">
            <div class="tag">评价时间</div>
            <div class="content">2</div>
          </div>
          <div class="rightBox">
            <div class="tag">服务评价</div>
            <div class="content">2</div>
          </div>
        </div>
        <div class="tagBox">
          <div class="leftBox">
            <div class="tag">服务人员评价</div>
            <div class="content">2</div>
          </div>
        </div>
      </div>
    </div>
    <!-- END -->
    <!-- 取消记录 -->
    <div
      v-if="
        detailData.orderInfo?.ordersStatus === 600 ||
        (detailData.orderInfo?.ordersStatus === 700 &&
          detailData.cancelInfo?.cancelerName !== null &&
          detailData.payStatus === 2)
      "
      class="Card bg-wt"
    >
      <div class="title">取消记录</div>
      <div class="bodyBox">
        <div class="tagBox">
          <div class="leftBox">
            <div class="tag">取消人</div>
            <div class="content">
              {{
                detailData.cancelInfo?.cancelerName
                  ? detailData.cancelInfo?.cancelerName
                  : '-'
              }}
            </div>
          </div>
          <div class="rightBox">
            <div class="tag">取消原因</div>
            <div class="content">{{ detailData.cancelInfo?.cancelReason }}</div>
          </div>
        </div>
      </div>
      <div class="bodyBox">
        <div class="tagBox">
          <div class="leftBox">
            <div class="tag">取消时间</div>
            <div class="content">
              {{
                formatDateTimeToDateTimeString(
                  new Date(detailData.cancelInfo?.cancelTime)
                )
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end -->
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getOrderById } from '@/api/order'
import { ZoomInIcon } from 'tdesign-icons-vue-next'
import { formatDateTimeToDateTimeString } from '@/utils/date'
import { formatNumber } from '@/utils/index'
import { UNIT } from '@/constants'
import { forEach } from 'lodash'

const route = useRoute()
const orderId = route.params.id
const detailData = ref<any>({})
// 步骤条步骤
const stepsData = ref([])
const activeStep = ref()
// 获取详情数据
const getDetailData = async () => {
  await getOrderById(orderId).then((res) => {
    if (res.code === 200) {
      detailData.value = res.data
      stepsData.value = []
    }
  })
  getStepsData(detailData.value.ordersProgress)
}
// 生命周期
onMounted(() => {
  getDetailData()
})
// 拼接步骤条数据
const getStepsData = (val) => {
  forEach(val, (item, i) => {
    if (item.status === 0) {
      stepsData.value.push({
        status: '待支付',
        dateTime: formatDateTimeToDateTimeString(new Date(item.dateTime)),
        value: 0
      })
    } else if (item.status === 100 || val[i + 1]?.status === 100) {
      if (val[Number(i) - 1]?.status === 100) {
        stepsData.value.push({
          status: '派单成功',
          dateTime: formatDateTimeToDateTimeString(new Date(item.dateTime)),
          value: 100
        })
      } else {
        stepsData.value.push({
          status: '已支付',
          dateTime: formatDateTimeToDateTimeString(new Date(item.dateTime)),
          value: 100
        })
      }
    } else if (item.status === 200) {
      stepsData.value.push({
        status: '派单成功',
        dateTime: formatDateTimeToDateTimeString(new Date(item.dateTime)),
        value: 200
      })
    } else if (item.status === 300) {
      stepsData.value.push({
        status: '开始服务',
        dateTime: formatDateTimeToDateTimeString(new Date(item.dateTime)),
        value: 300
      })
    } else if (item.status === 400) {
      stepsData.value.push({
        status: '服务完成',
        dateTime: formatDateTimeToDateTimeString(new Date(item.dateTime)),
        value: 400
      })
    } else if (item.status === 500) {
      stepsData.value.push({
        status: '服务完成',
        dateTime: formatDateTimeToDateTimeString(new Date(item.dateTime)),
        value: 500
      })
    } else if (item.status === 600) {
      stepsData.value.push({
        status: '已取消',
        dateTime: formatDateTimeToDateTimeString(new Date(item.dateTime)),
        value: 600
      })
    } else {
      stepsData.value.push({
        status: '已关闭',
        dateTime: formatDateTimeToDateTimeString(new Date(item.dateTime)),
        value: 700
      })
    }
  })
  for (let i = 0; i < stepsData.value.length; i++) {
    if (
      stepsData.value.length === 2 &&
      stepsData.value[0].value == '100' &&
      stepsData.value[1].value == '100'
    ) {
      stepsData.value[1].status = '派单中'
    }
  }
  activeStep.value = stepsData.value.length
}

watch(
  () => route.query,
  () => {
    getDetailData()
  }
)
</script>

<style lang="less" scoped>
.detailBox {
  :deep(.t-card__body) {
    padding: 20px 36px;
  }

  .Card {
    margin-top: 25px;
    padding: 36px 49px;

    .title {
      color: var(--color-bk1);
      font-weight: 600;
      font-size: 18px;
      color: #191919;
      padding-bottom: 10px;
    }

    .bodyBox {
      .serviceSplit {
        display: flex;
        margin-top: 25px;
        align-items: center;

        &:last-child {
          margin-top: 35px;
        }

        span {
          min-width: 42px;
          font-family: PingFangSC-SNaNpxibold;
          font-weight: 600;
          display: inline-block;
          color: var(--color-bk1);
          font-size: 14px;
          margin-right: 10px;
          width: auto;
          box-sizing: border-box;
        }

        .line {
          height: 1px;
          width: 100%;
          background: linear-gradient(to left,
          transparent 0%,
          transparent 50%,
          #e8e8e8 50%,
          #e8e8e8 100%);
          background-size: 12px 1px;
          background-repeat: repeat-x;
        }
      }

      .tagBox {
        display: flex;
        margin-top: 30px;
        font-size: 14px;
        width: 100%;

        .leftBox,
        .rightBox {
          width: 50%;
          display: flex;
        }

        .rightBox {
          padding-left: 50px;
        }

        .tag {
          width: 172px;
          color: var(--color-bk3);
        }

        .content {
          color: var(--color-bk1);
          width: 54%;

          :deep(.tdesign-demo-image-viewer__ui-image) {
            width: 100px;
            height: 100px;
            margin-right: 16px;
          }
        }

        .company {
          padding: 0 3.5px;
          background: #ffe8e8;
          border-radius: 2px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          font-size: 12px;
          color: #f74346;
        }
      }
    }
  }
}
</style>
