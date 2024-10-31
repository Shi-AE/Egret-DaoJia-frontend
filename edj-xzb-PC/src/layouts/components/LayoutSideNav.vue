<!-- 侧边栏主页面 -->
<template>
  <l-side-nav
    v-if="settingStore.showSidebar"
    :is-compact="settingStore.isSidebarCompact"
    :menu="sideMenu"
    :show-logo="settingStore.showSidebarLogo"
    :theme="settingStore.displayMode"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { usePermissionStore, useSettingStore } from '@/store'
import LSideNav from '../simpleComponents/SideNav.vue' // 侧边栏

const permissionStore = usePermissionStore()
const settingStore = useSettingStore()
const { routers: menuRouters } = storeToRefs(permissionStore)
// sideMenu是侧边栏的菜单路由
const sideMenu = computed(() => {
  const newMenuRouters = menuRouters.value
  return newMenuRouters
})
</script>
