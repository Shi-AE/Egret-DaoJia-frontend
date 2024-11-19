<!-- 账号登录页 -->
<template>
  <view>
    <image class="logo" src="@/static/new/img_logo@2x.png"></image>
    <view class="loginBox">
      <!-- 登录表单 -->
      <view class="loginMain">
        <uni-forms ref="customForm" :modelValue="fromInfo" :rules="customRules">
          <uni-forms-item name="phone">
            <uni-easyinput
              v-model="fromInfo.phone"
              :clearable="false"
              class="item"
              placeholder="请输入手机号"
            />
          </uni-forms-item>
          <uni-forms-item class="pwdBox" name="verifyCode">
            <uni-easyinput
              v-model="fromInfo.verifyCode"
              :clearable="false"
              class="item"
              placeholder="请输入验证码"
            />
            <text
              :disabled="countDown > 0"
              class="clearIcon"
              @click="handlePwd">
              {{ countDown === 0 ? '获取验证码' : `${countDown}秒后可重发` }}
            </text>
          </uni-forms-item>
        </uni-forms>
        <!-- 按钮 -->
        <view class="btnBox">
          <button
            :class="
              fromInfo.phone.length === 0 || fromInfo.verifyCode.length === 0
                ? 'disabled'
                : ''
            "
            :disabled="
              fromInfo.phone.length === 0 || fromInfo.verifyCode.length === 0
            "
            class="btn-default"
            type="primary"
            @click="handleSubmit"
          >
            登录
          </button>
        </view>
        <div class="gentleReminder">
          仅用于IT培训教学使用，为保障您的个人信息安全，请勿向平台录入任何个人敏感信息（如手机号、身份证号等）！
        </div>
        <!-- end -->
        <!-- 更新请求Url - 教学需求 -->
      </view>
      <!-- end -->
      <!-- 提示窗示例 -->
      <uni-popup ref="alertDialog" :is-mask-click="false" type="dialog">
        <view class="dialog">
          <view class="content">该手机号已被冻结</view>
          <view class="reason">
            <text>冻结原因：</text>
            <text>{{ reason }}</text>
          </view>
          <view class="phoneLabel">如需解冻请拨打客服电话：</view>
          <view class="phone">400-000-4000</view>
          <view class="footer" @click="handleClose">知道了</view>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
// 接口
import { getsmsCode, phoneLogins } from '../api/user.js'
import { getUserSetting } from '../api/setting.js'
import { onShow } from '@dcloudio/uni-app'
// ------定义变量------
const store = useStore() //vuex获取储存数据
const customForm = ref() //表单校验
const alertDialog = ref(null)
const reason = ref('')
const countDown = ref(0)
// 表单数据
let fromInfo = reactive({
  phone: '19330439536', //账号
  verifyCode: '', // 密码
  userType: 2
})
// 表单校验
const customRules = reactive({
  phone: {
    rules: [
      {
        required: true,
        errorMessage: '请输入手机号'
      },
      {
        validateFunction: function(rule, value, data, callback) {
          const reg = /^1[3-9]\d{9}$/

          if (!reg.test(value)) {
            callback('手机号输入错误！请重新输入')
          }
          return true
        }
      }
    ]
  },
  verifyCode: {
    rules: [
      {
        required: true,
        errorMessage: '请输入验证码'
      }
    ]
  }
})
// ------定义方法------
const handleClose = () => {
  alertDialog.value.close()
}
// 登录
const handleSubmit = async () => {
  // 表单校验
  const valid = await customForm.value.validate()
  if (valid) {
    // 登录接口
    // 网络慢的时候添加按钮loading

    uni.showLoading({
      title: 'loading',
      mask: true
    })


    await phoneLogins(fromInfo)
      .then(async (res) => {
        // 操作成功后清除loading
        uni.hideLoading()
        // clearInterval(t);
        if (res.code === 200) {
          // 存储token
          uni.setStorageSync('accessToken', res.data.accessToken)
          uni.setStorageSync('refreshToken', res.data.refreshToken)
          store.commit('user/setToken', res.data.accessToken)
          await getUserSetting().then((res) => {
            if (Boolean(res.data.settingsStatus)) {
              // 跳转到首页
              uni.redirectTo({
                url: '/pages/index/index'
              })
            } else {
              // 跳转到业务配置
              uni.redirectTo({
                url: '/pages/setting/index'
              })
            }
          })
        } else if (res.code === 605) {
          uni.showToast({
            title: res.msg,
            duration: 1000,
            icon: 'none'
          })
        }
      })
      .catch((err) => {
        uni.hideLoading()
        if (err.code === 605) {
          reason.value = err.msg
          alertDialog.value.open()
        } else {
          uni.showToast({
            title: err.msg || '登录失败',
            duration: 1500,
            icon: 'none'
          })
        }
      })
  }
}
// 获取验证码
const handlePwd = async () => {
  if (countDown.value > 0) {
    return uni.showToast({
      title: '验证码已发送，请稍后重试',
      duration: 2000,
      icon: 'none'
    })
  }
  const reg = /^1[3-9]\d{9}$/
  if (!reg.test(fromInfo.phone)) {
    return uni.showToast({
      title: '手机号输入错误！请重新输入',
      duration: 2000,
      icon: 'none'
    })
  }
  getsmsCode({
    bussinessType: 3,
    phone: fromInfo.phone
  })
    .then((res) => {
      fromInfo.verifyCode = '123456'
      countDown.value = 60
      const intervalTimer = setInterval(() => {
        if (countDown.value > 0) {
          countDown.value -= 1
        } else {
          clearInterval(intervalTimer)
          countDown.value = 0
        }
      }, 1000)
    })
    .catch((err) => {
      uni.showToast({
        title: err.msg || '获取验证码失败',
        duration: 1500,
        icon: 'none'
      })
    })
}

// 存在凭证自动登录
onShow(() => {
  const accessToken = uni.getStorageSync('accessToken')
  const refreshToken = uni.getStorageSync('refreshToken')

  if (accessToken && refreshToken) {
    store.commit('user/setToken', accessToken)
    getUserSetting().then((res) => {
      if (Boolean(res.data.settingsStatus)) {
        // 跳转到首页
        uni.redirectTo({
          url: '/pages/index/index'
        })
      } else {
        // 跳转到业务配置
        uni.redirectTo({
          url: '/pages/setting/index'
        })
      }
    })
  }
})
</script>

<style lang="scss" src="./index.scss"></style>
