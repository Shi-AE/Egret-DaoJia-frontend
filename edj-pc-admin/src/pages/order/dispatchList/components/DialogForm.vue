<!-- 冻结弹窗 -->
<template>
  <t-dialog
    v-model:visible="formVisible"
    :footer="false"
    :header="title"
    :on-close="onClickCloseBtn"
    :width="628"
  >
    <template #body>
      <!-- 表单内容 -->
      <t-form
        ref="form"
        :data="formData"
        :label-width="80"
        :reset-type="resetType"
        :rules="rules"
        on-cancel="onClickCloseBtn"
        @submit="onSubmit"
      >
        <t-form-item :label="formLabel" name="description"
        >
          <t-textarea
            v-model="formData.description"
            :maxlength="100"
            class="wt-400"
            placeholder="请输入至少5个字符"
          >
          </t-textarea>
        </t-form-item>
        <t-form-item style="float: right">
          <div class="bt bt-grey btn-submit" @click="onClickCloseBtn">
            <span>取消</span>
          </div>
          <button class="bt btn-submit" theme="primary" type="submit">
            <span>确定</span>
          </button>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ValidateResultContext } from 'tdesign-vue-next'
import { validateText, } from '@/utils/validate'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => {
      return {}
    }
  },
  label: {
    type: String,
    default: '退款原因：'
  },
  title: {
    type: String,
    default: '新建产品'
  }
})
// 重置表单
const resetType = ref('empty')
const formLabel = ref('退款原因：')
// 表单
const form = ref()
// 触发父级事件
const emit: Function = defineEmits(['handleClose', 'fetchData', 'handleSubmit'])
// 弹窗
const formVisible = ref(false)
// 表单数据
const formData = ref({
  description: ''
})
// 弹窗标题
const title = ref()
// 提交表单
const onSubmit = (result: ValidateResultContext<FormData>) => {
  if (result.validateResult === true) {
    emit('handleSubmit', formData.value)
    // emit('fetchData')
    onClickCloseBtn()
  }
}
// 点击取消关闭
const onClickCloseBtn = () => {
  // 重置表单
  form.value.reset()
  formVisible.value = false
  emit('handleClose')
}
// 点击叉号关闭
// 监听器，监听父级传递的visible值，控制弹窗显示隐藏
watch(
  () => props.visible,
  () => {
    formVisible.value = props.visible
    title.value = props.title
    formLabel.value = props.label
  }
)
// 监听器，监听父级传递的data值，控制表单数据
watch(
  () => props.data,
  (val) => {
    formData.value = JSON.parse(JSON.stringify(val))
  }
)


// 表单校验
const rules = {
  description: [
    {
      required: true,
      message: '请输入产品描述',
      type: 'error',
      trigger: 'blur'
    },
    {
      validator: validateText,
      message: '请输入至少5个字符,至多50个字符',
      type: 'error',
      trigger: 'change'
    },
    {
      validator: validateText,
      message: '请输入至少5个字符,至多50个字符',
      type: 'error',
      trigger: 'blur'
    }
  ]
}
</script>
<style lang="less" scoped>
.btn-submit {
  margin-left: 15.5px;
  width: 60px;
}

.nickname {
  margin-right: 2px;
  z-index: 100;
  color: var(--color-bk4);
}

:deep(.t-textarea__limit) {
  color: var(--color-bk4);
  right: 10px;
}
</style>
