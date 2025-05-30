import { MessagePlugin } from 'tdesign-vue-next'
import NProgress from 'nprogress' // progress bar//每次刷新页面或者重新进入页面的时候最顶部的进度条
import 'nprogress/nprogress.css' // progress bar style

import { getPermissionStore, getUserStore } from '@/store'
import router from '@/router'
import {
  AUTHORIZATION_ACCESS_TOKEN,
  AUTHORIZATION_REFRESH_TOKEN
} from '@/config/global'
// 是否显示环形进度条
NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, from, next) => {
  // 进度条开始
  NProgress.start()

  const userStore = getUserStore()
  const permissionStore = getPermissionStore()
  const { whiteListRouters } = permissionStore

  const { authorizationAccessToken, authorizationRefreshToken } = userStore

  if (
    authorizationAccessToken &&
    authorizationRefreshToken &&
    localStorage.getItem(AUTHORIZATION_ACCESS_TOKEN) &&
    localStorage.getItem(AUTHORIZATION_REFRESH_TOKEN)
  ) {
    if (to.path === '/login') {
      next()
      return
    }
    // 在路由权限里需要借助roles进行过来 这块先留着后面需要改掉
    const roles = ['all']
    await permissionStore.initRoutes(roles)
    next()
    return
    // 以下是对个人信息的效验， 由于目前改格式了 所以下面的逻辑暂时先不走
    // const { roles } = userStore;

    if (roles && roles.length > 0) {
      next()
    } else {
      try {
        // await userStore.getUserInfo();

        const { roles } = userStore

        await permissionStore.initRoutes(roles)

        if (router.hasRoute(to.name)) {
          next()
        } else {
          next(`/`)
        }
      } catch (error) {
        MessagePlugin.error(error)
        next({
          path: '/login',
          query: { redirect: encodeURIComponent(to.fullPath) }
        })
        NProgress.done()
      }
    }
  }
  /* white list router */
  if (whiteListRouters.indexOf(to.path) !== -1) {
    next()
  } else {
    next({
      path: '/login',
      query: { redirect: encodeURIComponent(to.fullPath) }
    })
  }
  // 进度条结束
  NProgress.done()
})

router.afterEach((to) => {
  if (to.path === '/login') {
    const userStore = getUserStore()
    const permissionStore = getPermissionStore()

    userStore.logout()
    permissionStore.restore()
  }
  // 进度条结束
  NProgress.done()
})
