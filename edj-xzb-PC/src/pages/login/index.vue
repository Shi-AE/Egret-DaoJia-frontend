<template>
  <div>
    <!-- 风格二的登录 -->
    <div class="login-wrapper type2">
      <div class="left">
        <div class="login-container">
          <div class="title-container">
            <h1 class="title">
              <img alt="" class="logo" src="@/assets/test-img/logofull.png" />
            </h1>
          </div>
          <login
            v-if="type === 'login'"
            @handleFrozen="handleFrozen"
            @handleTo="handleTo"
            @openForgetPwd="openForgetPwd"
          />
          <Register v-else @handleTo="handleTo"></Register>
        </div>
        <footer class="copyright">
          Copyright @ 2021-2022 czri. All Rights Reserved
        </footer>
      </div>
      <div class="right"></div>
    </div>
    <!-- 账号冻结弹窗 -->
    <div class="baseDialog">
      <t-dialog
        v-model:visible="dialogVisible"
        :footer="false"
        :on-close="handleClose"
        header="该手机号已被冻结"
      >
        <div class="reason">
          <span>冻结原因：</span>
          <span>{{ frozenReason }}</span>
        </div>
        <div class="phone">
          <span>如需解冻请拨打客服电话：</span>
          <span>400-000-4000</span>
        </div>
        <div class="dialog-footer">
          <button
            class="bt wt-60"
            theme="primary"
            type="submit"
            @click="handleClose"
          >
            <span>知道了</span>
          </button>
        </div>
      </t-dialog>
    </div>
    <t-dialog
      v-model:visible="forgetPwdDialog"
      :footer="false"
      :on-close="handleClose"
      :width="628"
      class="forgetPwdDialog"
      header="找回密码"
    >
      <t-form
        ref="form"
        :data="dialogForm"
        :rules="FORM_RULES"
        label-width="70px"
        @submit="onSubmit"
      >
        <t-form-item label="手机号：" name="phone">
          <t-input
            v-model="dialogForm.phone"
            :maxlength="11"
            placeholder="请输入您的手机号"
            size="large"
          >
          </t-input>
        </t-form-item>

        <t-form-item
          class="verificationCode"
          label="验证码："
          name="verifyCode"
        >
          <t-input
            v-model="dialogForm.verifyCode"
            placeholder="请输入验证码"
            size="large"
          ></t-input>
          <t-button
            :disabled="countDown > 0"
            variant="outline"
            @click="handleCounterFunc"
          >
            {{ countDown == 0 ? '获取验证码' : `${countDown}秒后可重发` }}
          </t-button>
        </t-form-item>
        <t-form-item label="新密码：" name="password">
          <t-input
            v-model="dialogForm.password"
            :type="showPsw ? 'text' : 'password'"
            placeholder="请输入最少8位密码"
            size="large"
          >
            <template #suffix-icon>
              <t-icon
                :name="showPsw ? 'browse' : 'browse-off'"
                @click="showPsw = !showPsw"
              />
            </template>
          </t-input>
        </t-form-item>
        <div class="dialog-footer">
          <button class="bt wt-60 bt-grey" theme="primary" @click="handleClose">
            <span>取消</span>
          </button>
          <button class="bt wt-60" theme="primary" type="submit">保存</button>
        </div>
      </t-form>
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormRule } from 'tdesign-vue-next'
import { MessagePlugin } from 'tdesign-vue-next'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import { useCounter } from '@/hooks' // 倒计时
import { validatePhone } from '@/utils/validate'
import { resetPwd } from '@/api/user'

const dialogVisible = ref(false) // 账号冻结弹窗
const forgetPwdDialog = ref(false)
const frozenReason = ref('') // 账号冻结原因
const type = ref('login')
const dialogForm = reactive({
  phone: '',
  password: '',
  verifyCode: ''
}) as any
const showPsw = ref(false) // 是否显示密码
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
  password: [
    { required: true, message: '密码必填', type: 'error' },
    {
      min: 8,
      message: '输入密码最少8位',
      type: 'error',
      trigger: 'change'
    }
  ],
  verifyCode: [{ required: true, message: '验证码必填', type: 'error' }]
}
const [countDown, handleCounter] = useCounter()
// 提交，修改密码
const onSubmit = async ({ validateResult }) => {
  if (validateResult === true) {
    // 登录相关
    resetPwd(dialogForm)
      .then(async (res: any) => {
        if (res.code === 200) {
          MessagePlugin.success('修改密码成功')
          forgetPwdDialog.value = false
        } else {
          MessagePlugin.error(res.data.msg || '修改失败')
        }
      })
      .catch((err) => {
        console.log(err, 'err')
      })
  }
}
// 获取验证码
const handleCounterFunc = async () => {
  if (!dialogForm.phone) {
    return MessagePlugin.error('手机号不能为空')
  }
  const code = await handleCounter({
    bussinessType: 2,
    phone: dialogForm.phone
  })
  dialogForm.verifyCode = code
}
// 打开忘记密码弹窗
const openForgetPwd = () => {
  forgetPwdDialog.value = true
}
const handleClose = () => {
  frozenReason.value = ''
  dialogVisible.value = false
  forgetPwdDialog.value = false
}
// 切换登录和注册
const handleTo = (val) => {
  type.value = val
}
// 弹出冻结弹窗
const handleFrozen = (val) => {
  frozenReason.value = val
  dialogVisible.value = true
}
</script>

<style lang="less" scoped>
@import url('./index.less');
// 分格二样式 如果使用分格一 直接删除
.type2 {
  flex-direction: row;

  .login-container {
    background: transparent;
    top: auto;
    left: auto;
    transform: translateX(0);
  }

  .left {
    min-width: 600px;
    height: 100%;
    background: var(--color-bk10);
    // 内容居中
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .right {
    min-width: 840px;
    width: 100%;
    height: 100%;
    background: var(--color-bk10);
    background-image: url(@/assets/img_denglu-bg@2x.png);
    // 撑满父元素
    background-size: cover;
    background-repeat: no-repeat;
  }
}

//风格一登录样式
.login-wrapper {
  position: relative;

  .companyFooter {
    position: absolute;
    bottom: 0;
    background-color: transparent;
    left: 50%;
    transform: translateX(-50%);
    color: #c0d1ff;
  }
}

.logo {
  width: 186px;
  height: 75px;
}

:deep(.t-input .t-input__prefix > .t-icon) {
  color: var(--td-text-color-placeholder);
}

.bt {
  width: 71px;
  height: 32px;
  line-height: 32px;
  margin-bottom: 0px;
}
</style>
