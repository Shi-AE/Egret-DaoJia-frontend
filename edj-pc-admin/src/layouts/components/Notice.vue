<!-- 通知，弃用 -->
<template>
  <t-popup expand-animation placement="bottom-right" trigger="click">
    <template #content>
      <div class="header-msg">
        <div class="header-msg-top">
          <p>通知</p>
          <t-button
            v-if="unreadMsg.length > 0"
            class="clear-btn"
            theme="primary"
            variant="text"
            @click="setRead('all')"
          >清空
          </t-button
          >
        </div>
        <t-list
          v-if="unreadMsg.length > 0"
          :split="true"
          class="narrow-scrollbar"
        >
          <t-list-item v-for="(item, index) in unreadMsg" :key="index">
            <div>
              <p class="msg-content">{{ item.content }}</p>
              <p class="msg-type">{{ item.type }}</p>
            </div>
            <p class="msg-time">{{ item.date }}</p>
            <template #action>
              <t-button
                size="small"
                variant="outline"
                @click="setRead('radio', item)"
              >
                设为已读
              </t-button>
            </template>
          </t-list-item>
        </t-list>

        <div v-else class="empty-list">
          <img
            alt="空"
            src="https://tdesign.gtimg.com/pro-template/personal/nothing.png"
          />
          <p>暂无通知</p>
        </div>
        <div class="header-msg-bottom">
          <t-button
            v-if="unreadMsg.length > 0"
            class="header-msg-bottom-link"
            theme="primary"
            variant="text"
            @click="goDetail"
          >查看全部
          </t-button
          >
        </div>
      </div>
    </template>
    <t-badge :count="unreadMsg.length" :offset="[12, 8]">
      <t-button shape="square" theme="default" variant="text">
        <t-icon name="mail"/>
      </t-button>
    </t-badge>
  </t-popup>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/store'
import type { NotificationItem } from '@/types/interface'

const router = useRouter()
const store = useNotificationStore()
// msgData，通知数据
const {msgData, unreadMsg} = storeToRefs(store)
// setRead，设置已读
const setRead = (type: string, item?: NotificationItem) => {
  // changeMsg，修改后的数据
  const changeMsg = msgData.value
  if (type === 'all') {
    changeMsg.forEach((e) => {
      e.status = false
    })
  } else {
    changeMsg.forEach((e) => {
      if (e.id === item?.id) {
        e.status = false
      }
    })
  }
  store.setMsgData(changeMsg)
}
// 前往详情页
const goDetail = () => {
  router.push('/detail/secondary')
}
</script>

<style lang="less" scoped>
.header-msg {
  width: 400px;
  height: 500px;

  .empty-list {
    height: calc(100% - 104px);
    text-align: center;
    padding-top: 135px;
    font-size: 14px;
    color: var(--td-text-color-secondary);

    img {
      width: 63px;
    }

    p {
      margin-top: 30px;
    }
  }

  &-top {
    position: relative;
    height: 56px;
    font-size: 16px;
    color: var(--td-text-color-primary);
    text-align: center;
    line-height: 56px;
    border-bottom: 1px solid var(--td-component-border);

    .clear-btn {
      position: absolute;
      top: 12px;
      right: 24px;
    }
  }

  &-bottom {
    height: 48px;
    align-items: center;
    display: flex;
    justify-content: center;

    &-link {
      text-decoration: none;
      font-size: 14px;
      color: var(--td-brand-color);
      line-height: 48px;
      cursor: pointer;
    }
  }

  .t-list {
    height: calc(100% - 104px);
  }

  .t-list-item {
    overflow: hidden;
    width: 100%;
    padding: 16px 24px;
    border-radius: var(--td-radius-default);
    font-size: 14px;
    color: var(--td-text-color-primary);
    line-height: 22px;
    cursor: pointer;

    &:hover {
      transition: background 0.2s ease;
      background: var(--td-bg-color-container-hover);

      .msg-content {
        color: var(--td-brand-color);
      }

      .t-list-item__action {
        button {
          bottom: 16px;
          opacity: 1;
        }
      }

      .msg-time {
        bottom: -6px;
        opacity: 0;
      }
    }

    .msg-content {
      margin-bottom: 16px;
    }

    .msg-type {
      color: var(--td-text-color-secondary);
    }

    .t-list-item__action {
      button {
        opacity: 0;
        position: absolute;
        right: 24px;
        bottom: -6px;
      }
    }

    .msg-time {
      transition: all 0.2s ease;
      opacity: 1;
      position: absolute;
      right: 24px;
      bottom: 16px;
      color: var(--td-text-color-secondary);
    }
  }
}

.t-button {
  margin: 0 8px;

  .t-icon {
    font-size: 20px;

    &.general {
      margin-right: 16px;
    }
  }
}
</style>
