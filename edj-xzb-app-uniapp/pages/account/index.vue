<!--  -->
<template>
  <view class="account">
    <!-- 导航 -->
    <UniNav :title="title" @goBack="goBack"></UniNav>
    <!-- 姓名 -->
    <view class="name">
      <text class="label">户名</text>
      <uni-easyinput
        v-model="formData.name"
        :placeholderStyle="{ fontSize: '16px' }"
        placeholder="请输入户名"
      ></uni-easyinput>
    </view>
    <!-- 银行 -->
    <view class="idCard">
      <text class="label">银行</text>
      <picker
        :range="bankArray"
        :value="bankIndex"
        class="citySelect bankSelect"
        mode="selector"
        range-key="label"
        @change="handleBank"
      >
        <text
          :class="!formData.bankName ? 'placeholder' : ''"
          class="bankName"
        >{{ formData.bankName ? formData.bankName : '请选择银行' }}
        </text
        >
        <image src="../../static/new/icon_more@2x.png"></image>
      </picker>
    </view>
    <!-- 开户行 -->
    <view class="idCard">
      <text class="label">开户行</text>
      <view class="citySelect" @click="handleOpenLocation">
        <view
          :class="
            !(formData.province && formData.city && formData.district)
              ? 'placeholder'
              : ''
          "
          class="area"
        >{{
            formData.province && formData.city && formData.district
              ? formData.province +
              '-' +
              formData.city +
              '-' +
              formData.district
              : '请选择开户行'
          }}
        </view
        >
        <image src="../../static/new/icon_more@2x.png"></image>
      </view>
    </view>
    <!-- 网点 -->
    <view class="idCard">
      <text class="label">网点</text>
      <uni-easyinput
        v-model="formData.branch"
        :placeholderStyle="{ fontSize: '16px' }"
        placeholder="请输入网点名称"
      ></uni-easyinput>
    </view>
    <!-- 银行账号 -->
    <view class="idCard bankAccount">
      <text class="label">银行账号</text>
      <uni-easyinput
        v-model="formData.account"
        :placeholderStyle="{ fontSize: '16px' }"
        placeholder="请输入银行账号"
      ></uni-easyinput>
    </view>
    <!-- 开户证明 -->
    <view class="data">
      <view class="label">开户证明</view>
      <view class="content">
        <view class="photoItem">
          <uni-file-picker
            :value="[
              {
                url: formData.accountCertification,
                name: 'file.txt',
                extname: 'txt',
              },
            ]"
            limit="1"
            title=""
            @delete="handleDelete"
            @select="handleSelect"
          >
            <image
              v-if="formData.accountCertification"
              :src="formData.accountCertification"
              class="image"
            />
          </uni-file-picker>

          <view class="photoLabel">资料上传</view>
        </view>
      </view>
    </view>
    <!-- 底部按钮 -->
    <view class="footer">
      <view class="btn-red" @click="handleSubmit">确认提交</view>
    </view>
    <!-- 选择省市区弹窗 -->
    <SelectArea
      ref="selectArea"
      :cityName="formData.city"
      :countyName="formData.district"
      :provinceName="formData.province"
      @getAreaData="getAreaData"
    ></SelectArea>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { baseUrl } from '../../utils/env'
import { getAccountInfo, postAccount } from '../api/setting.js'
// 导入组件
// 导航组件
import SelectArea from './components/selectArea.vue'
import UniNav from '@/components/uni-nav/index.vue'

const title = ref('账户设置')
const flag = ref(true)
let bankIndex = ref(0)
const selectArea = ref()
// 表单数据
const formData = ref({
  name: '',
  bankName: '',
  province: '',
  city: '',
  district: '',
  branch: '',
  account: '',
  accountCertification: '',
  type: 2
})
// 银行下拉框
const bankArray = ref([
  {
    label: '中国工商银行',
    value: 1
  },
  {
    label: '中国建设银行',
    value: 2
  },
  {
    label: '中国邮政储蓄银行',
    value: 3
  },
  {
    label: '中国农业银行',
    value: 4
  },
  {
    label: '北京农商银行',
    value: 5
  },
  {
    label: '招商银行',
    value: 6
  }
])
onMounted(() => {
  getAccountInfoFunc()
})
const handleDelete = () => {
  formData.value.accountCertification = ''
}
//获取账户设置信息
const getAccountInfoFunc = () => {
  getAccountInfo()
    .then((res) => {
      formData.value.name = res.data.name
      formData.value.bankName = res.data.bankName

      formData.value.province = res.data.province || 0
      formData.value.city = res.data.city || 0
      formData.value.district = res.data.district || 0

      formData.value.branch = res.data.branch
      formData.value.account = res.data.account
      formData.value.accountCertification = res.data.accountCertification
    })
    .catch((err) => {
      uni.showToast({
        title: err.msg || '账户信息获取失败!',
        duration: 1000,
        icon: 'none'
      })
    })
}
//上传图片
const handleSelect = (e) => {
  const item = e.tempFiles[0]
  uni.uploadFile({
    url: `${baseUrl}` + '/publics/storage/upload',
    files: [
      {
        name: 'file',
        uri: item.url,
        file: item
      }
    ],
    header: {
      AuthorizationAccessToken: uni.getStorageSync('accessToken'), // 请求头配置token
      AuthorizationRefreshToken: uni.getStorageSync('refreshToken') // 请求头配置token
    },
    success: (uploadFileRes) => {
      formData.value.accountCertification = JSON.parse(
        uploadFileRes.data
      ).data.url
    },
    fail: () => {
      uni.showToast({
        title: '图片上传失败',
        duration: 1000,
        icon: 'none'
      })
    }
  })
}
//提交账户设置
const handleSubmit = () => {
  if (!formData.value.name) {
    return uni.showToast({
      title: '请填写户名',
      duration: 1000,
      icon: 'none'
    })
  } else if (!formData.value.bankName) {
    return uni.showToast({
      title: '请选择银行',
      duration: 1000,
      icon: 'none'
    })
  } else if (
    !formData.value.province ||
    !formData.value.city ||
    !formData.value.district
  ) {
    return uni.showToast({
      title: '请选择开户行',
      duration: 1000,
      icon: 'none'
    })
  } else if (!formData.value.branch) {
    return uni.showToast({
      title: '请填写网点',
      duration: 1000,
      icon: 'none'
    })
  } else if (!formData.value.account) {
    return uni.showToast({
      title: '请填写银行账号',
      duration: 1000,
      icon: 'none'
    })
  } else if (!formData.value.accountCertification) {
    return uni.showToast({
      title: '请上传开户证明',
      duration: 1000,
      icon: 'none'
    })
  }
  if (!flag.value) return
  flag.value = false
  postAccount(formData.value)
    .then((res) => {
      setTimeout(() => {
        flag.value = true
      }, 1000)
      if (res.code === 200) {
        uni.showToast({
          title: '提交成功!',
          duration: 1000,
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
      }
    })
    .catch((err) => {
      setTimeout(() => {
        flag.value = true
      }, 1000)
      uni.showToast({
        title: err.msg || '提交失败!',
        duration: 1000,
        icon: 'none'
      })
    })
}
//选择开户行（省市区）
const getAreaData = (e) => {
  formData.value.province = e.province.label
  formData.value.city = e.city.label
  formData.value.district = e.area.label
}
//选择银行
const handleBank = (e) => {
  bankIndex.value = e.detail.value
  formData.value.bankName = bankArray.value[e.detail.value].label
}
// 返回上一页
const goBack = () => {
  uni.navigateBack()
}
const handleOpenLocation = () => {
  selectArea.value.handleOpen()
}
</script>
<style scoped src="./index.scss"></style>
