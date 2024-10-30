<!-- 新增编辑弹窗 -->
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
        :reset-type="resetType"
        :rules="rules"
        label-width="110px"
        on-cancel="onClickCloseBtn"
        @submit="onSubmit"
      >
        <t-form-item label="服务类型：" name="name">
          <t-input
            v-model="formData.name"
            class="wt-400"
            clearable
            placeholder="请输入类型名称"
          />
        </t-form-item>
        <t-form-item label="排序：" name="sortNum">
          <t-input-number
            v-model="formData.sortNum"
            :min="1"
            class="wt-400"
            placeholder="请输入数字"
            theme="column"
          ></t-input-number>
        </t-form-item>
        <t-form-item label="服务类型图标：" name="icon">
          <t-upload
            ref="uploadRef1"
            v-model="formData.icon"
            :allow-upload-duplicate-file="true"
            :headers="{
              AuthorizationAccessToken: accessToken,
              AuthorizationRefreshToken: refreshToken
            }"
            :is-batch-upload="true"
            :size-limit="10240"
            :tips="`请上传png格式图片，&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  尺寸：126*126px，在400k以内`"
            accept="image/*"
            action="/api/edj-publics/storage/upload"
            class="wt-400"
            theme="image"
            @fail="handleFail"
            @success="(e) => handleSuccess(e, 1)"
            @validate="onValidate"
          >
          </t-upload>
        </t-form-item>
        <t-form-item label="服务类型图片：" name="img">
          <t-upload
            ref="uploadRef2"
            v-model="formData.img"
            :allow-upload-duplicate-file="true"
            :headers="{
              AuthorizationAccessToken: accessToken,
              AuthorizationRefreshToken: refreshToken
            }"
            :is-batch-upload="true"
            :size-limit="10240"
            :tips="`请上传png格式图片，&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  尺寸：532*200px，在800k以内`"
            accept="image/*"
            action="/api/edj-publics/storage/upload"
            class="wt-400"
            theme="image"
            @fail="handleFail"
            @success="(e) => handleSuccess(e, 2)"
            @validate="onValidate"
          >
          </t-upload>
        </t-form-item>
        <t-form-item style="float: right">
          <div class="bt bt-grey btn-submit" @click="onClickCloseBtn">
            <span>取消</span>
          </div>
          <button class="bt btn-submit" theme="primary" type="submit">
            <span>保存</span>
          </button>
        </t-form-item>
      </t-form>
    </template>
  </t-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { MessagePlugin, ValidateResultContext } from 'tdesign-vue-next'

import { validateNum, validateText5 } from '@/utils/validate'
import { AUTHORIZATION_ACCESS_TOKEN, AUTHORIZATION_REFRESH_TOKEN } from '@/config/global'

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
  title: {
    type: String,
    default: '新建产品'
  }
})
// 重置表单
const resetType = ref('empty')
// 表单
const form = ref()
// 触发父级事件
const emit: Function = defineEmits(['handleClose', 'fetchData', 'handleSubmit'])
// 弹窗
const formVisible = ref(false)
// 表单数据
const formData = ref<any>({
  name: '',
  sortNum: '',
  img: [],
  icon: []
})
// 弹窗标题
const title = ref()
// 提交表单
const onSubmit = (result: ValidateResultContext<FormData>) => {
  if (result.validateResult === true) {
    emit('handleSubmit', formData.value)
  }
}
const handleSuccess = (params, id) => {
  if (params.response.code !== 200) {
    MessagePlugin.warning('上传失败')
    return
  }
  if (id === 1) {
    formData.value.icon[0].url = params.response.data.url
  } else {
    formData.value.img[0].url = params.response.data.url
  }
}
// 点击取消关闭
const onClickCloseBtn = () => {
  // 重置表单
  form.value.reset()
  formVisible.value = false
  emit('handleClose')
}

const accessToken = localStorage.getItem(AUTHORIZATION_ACCESS_TOKEN)
const refreshToken = localStorage.getItem(AUTHORIZATION_REFRESH_TOKEN)

// 监听器，监听父级传递的visible值，控制弹窗显示隐藏
watch(
  () => props.visible,
  () => {
    const data = JSON.parse(JSON.stringify(props.data))
    if (data.img) {
      formData.value.name = data.name
      formData.value.sortNum = data.sortNum
      // formData.value.img中新增对象，url为图片地址，name为图片名称
      formData.value.img = [
        {
          url: data.img
        }
      ]
      formData.value.icon = [
        {
          url: data.icon
        }
      ]
    }
    formVisible.value = props.visible
    title.value = props.title
  }
)

// 上传图片失败
const handleFail = () => {
  MessagePlugin.error(`文件上传失败`)
}
// 超过大小或者文件格式错误报错提示
const onValidate = (params) => {
  const {files, type} = params
  const messageMap = {
    FILE_OVER_SIZE_LIMIT: files[0].response.error,
    FILES_OVER_LENGTH_LIMIT: '文件数量超出限制，仅上传未超出数量的文件',
    // if you need same name files, setting allowUploadDuplicateFile={true} please
    FILTER_FILE_SAME_NAME: '不允许上传同名文件',
    BEFORE_ALL_FILES_UPLOAD: 'beforeAllFilesUpload 方法拦截了文件',
    CUSTOM_BEFORE_UPLOAD: 'beforeUpload 方法拦截了文件'
  }
  // you can also set Upload.tips and Upload.status to show warning message.
  messageMap[type] && MessagePlugin.warning(messageMap[type])
}
// 表单校验
const rules = {
  name: [
    // 名称校验
    {
      required: true,
      message: '请输入名称',
      type: 'error',
      trigger: 'blur'
    },
    {
      validator: validateText5,
      message: '分类名称输入不符，请输入2-5个字符',
      type: 'error',
      trigger: 'blur'
    }
  ],
  sortNum: [
    // 序号校验
    {
      required: true,
      message: '请输入序号',
      type: 'error',
      trigger: 'blur'
    },
    {
      validator: validateNum,
      message: '请输入正确格式的序号，0-999',
      type: 'error',
      trigger: 'change'
    },
    {
      validator: validateNum,
      message: '请输入正确格式的序号，0-999',
      type: 'error',
      trigger: 'blur'
    }
  ],
  img: [
    {
      required: true,
      message: '请上传图片',
      type: 'error',
      trigger: 'blur'
    }
  ],
  icon: [
    {
      required: true,
      message: '请上传图片',
      type: 'error',
      trigger: 'blur'
    }
  ]
}
defineExpose({
  onClickCloseBtn
})
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

.wt-400 {
  width: 400px;
}

:deep(.t-upload) {
  display: flex;
  align-items: center;

  .t-upload__tips {
    margin-left: 30px;
    width: 227px;
    height: 40px;
    margin-top: 0;
  }
}

:deep(.t-upload__card-name) {
  width: 120px;
}

:deep(.t-input-number.t-is-controls-right) {
  .t-input-number__decrease,
  .t-input-number__increase {
    opacity: 1;
    visibility: inherit;
  }
}

:deep(.t-dialog__position.t-dialog--top) {
  padding-top: 10vh;
}
</style>
