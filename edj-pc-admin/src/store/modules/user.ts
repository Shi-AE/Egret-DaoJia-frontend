import { defineStore } from 'pinia'
import {
  AUTHORIZATION_ACCESS_TOKEN,
  AUTHORIZATION_REFRESH_TOKEN
} from '@/config/global'
import { store, usePermissionStore } from '@/store'

// 初始化用户信息
const InitUserInfo = {
  roles: []
}

export const useUserStore = defineStore('user', {
  // 定义用户 Store
  state: () => ({
    authorizationAccessToken:
      localStorage.getItem(AUTHORIZATION_ACCESS_TOKEN) || '',
    authorizationRefreshToken:
      localStorage.getItem(AUTHORIZATION_REFRESH_TOKEN) || '',
    userInfo: { ...InitUserInfo }
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles
    }
  },
  actions: {
    async login(accessToken: string, refreshToken: string) {
      this.authorizationAccessToken = accessToken
      this.authorizationRefreshToken = refreshToken
      localStorage.setItem(AUTHORIZATION_ACCESS_TOKEN, accessToken)
      localStorage.setItem(AUTHORIZATION_REFRESH_TOKEN, refreshToken)
    },
    async setUserInfo(data: any) {
      this.userInfo = data
    },
    async logout() {
      localStorage.removeItem(AUTHORIZATION_ACCESS_TOKEN)
      localStorage.removeItem(AUTHORIZATION_REFRESH_TOKEN)
      this.authorizationAccessToken = ''
      this.authorizationRefreshToken = ''
      this.userInfo = { ...InitUserInfo }
    },
    async removeToken() {
      this.authorizationAccessToken = ''
      this.authorizationRefreshToken = ''
    }
  },
  persist: {
    afterRestore: (ctx) => {
      if (ctx.store.roles && ctx.store.roles.length > 0) {
        const permissionStore = usePermissionStore()
        permissionStore.initRoutes(ctx.store.roles)
      }
    }
  }
})

export function getUserStore() {
  return useUserStore(store)
}
