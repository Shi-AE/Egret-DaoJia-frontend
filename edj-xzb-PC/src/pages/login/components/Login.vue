<!-- 用户名密码登录 - 风格二 -->
<template>
  <t-form
    ref="form"
    :class="['item-container', `login-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <!-- 密码登录 -->
    <template v-if="type == 2">
      <t-form-item name="phone">
        <t-input
          v-model="formData.phone"
          :format="formataccount"
          autocomplete="both"
          clearable
          placeholder="账户"
          size="large"
        >
          <template #prefix-icon>
            <t-icon class="phone" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="password">
        <t-input
          v-model="formData.password"
          :format="formataccount"
          :type="showPsw ? 'text' : 'password'"
          autocomplete="both"
          clearable
          onkeyup="this.value=this.value.replace(/[^\w_]/g,'');"
          placeholder="密码"
          size="large"
        >
          <template #prefix-icon>
            <t-icon class="password" />
          </template>
        </t-input>
      </t-form-item>
    </template>

    <t-form-item class="btn-container footer">
      <t-loading v-if="loadSt" class="bt load" indicator></t-loading>
      <button v-else class="bt" type="submit">登录</button>
    </t-form-item>

    <t-form-item class="toRegister">
      <div>
        <span>没有账号？</span>
        <span class="btn" @click="toRegister">去注册</span>
      </div>
      <div>
        <span @click="openForgetPwd">忘记密码</span>
      </div>
    </t-form-item>
  </t-form>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstanceFunctions, FormRule } from 'tdesign-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import { useUserStore } from '@/store'

import { userLogins } from '@/api/user'
import { validatePhone } from '@/utils/validate'
import { getSettingStatus } from '@/api/setting'
import {
  AUTHORIZATION_ACCESS_TOKEN,
  AUTHORIZATION_REFRESH_TOKEN
} from '@/config/global'
// 发送事件给父组件
const emit = defineEmits(['handleFrozen', 'handleTo', 'openForgetPwd'])
// tab切换数据
const userStore = useUserStore()
// 登录loadding
const loadSt = ref(false)

const INITIAL_DATA = {
  phone: '19875447806',
  password: 'admin123',
  userType: 3
}

const FORM_RULES: Record<string, FormRule[]> = {
  phone: [
    {
      required: true,
      message: '账号必填',
      type: 'error'
    },
    {
      validator: validatePhone,
      message: '请输入正确格式的账号',
      type: 'error',
      trigger: 'change'
    }
  ],
  password: [{ required: true, message: '密码必填', type: 'error' }]
}

const type = ref(2)

const form = ref<FormInstanceFunctions>()
const formData = ref({ ...INITIAL_DATA })
const showPsw = ref(false)

const router = useRouter()
const route = useRoute()

// 打开忘记密码弹窗
const openForgetPwd = () => {
  emit('openForgetPwd')
}
const onSubmit = async ({ validateResult }) => {
  if (validateResult === true) {
    loadSt.value = true
    // 登录相关
    userLogins(formData.value)
      .then(async (res: any) => {
        loadSt.value = false
        if (res.code === 200) {
          await userStore.login(res.data.accessToken, res.data.refreshToken)

          // 登录成功， 转入首页
          await MessagePlugin.success('登录成功')
          const redirect = route.query.redirect as string
          const redirectUrl = redirect
            ? decodeURIComponent(redirect)
            : '/dashboard'
          // console.log(route, redirectUrl, redirect, 'redirect')
          getSettingStatus().then((res) => {
            userStore.settingsStatus = res.data.settingsStatus
            if (res.data.settingsStatus) {
              router.push(redirectUrl)
            } else {
              router.push('/setting')
            }
          })
        } else if (res.data.code === 605) {
          emit('handleFrozen', res.data.msg)
        } else {
          await MessagePlugin.error(res.data.msg || '登录失败')
        }
      })
      .catch((err) => {
        loadSt.value = false
        console.log(err, 'err')
      })
  }
}
const toRegister = () => {
  emit('handleTo', 'register')
}
const formataccount = (val: string) => {
  return val.replace(/\s/g, '')
}

onMounted(() => {
  const authorizationAccessToken = localStorage.getItem(
    AUTHORIZATION_ACCESS_TOKEN
  )
  const authorizationRefreshToken = localStorage.getItem(
    AUTHORIZATION_REFRESH_TOKEN
  )

  if (authorizationAccessToken && authorizationRefreshToken) {
    MessagePlugin.success('登录成功')
    const redirect = route.query.redirect as string
    const redirectUrl = redirect ? decodeURIComponent(redirect) : '/dashboard'
    // console.log(route, redirectUrl, redirect, 'redirect')
    getSettingStatus().then((res) => {
      userStore.settingsStatus = res.data.settingsStatus
      if (res.data.settingsStatus) {
        router.push(redirectUrl)
      } else {
        router.push('/setting')
      }
    })
  }
})
</script>

<style lang="less" scoped>
@import url('../index.less');
</style>
