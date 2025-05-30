import { request } from '../../utils/request.js'

//获取配置状态
export const getUserSetting = (params) =>
  request({
    url: `/edj-customer/worker/serve/settings/status`,
    method: 'get',
    params
  })

//修改接单设置
export const setPickUpStatus = (params) =>
  request({
    url: `/edj-customer/worker/serve/settings/pick/up`,
    method: 'put',
    params
  })

//获取服务分类
export const getServiceClassify = (params) =>
  request({
    url: `/customer/worker/serve-skill/listServeType`,
    method: 'get',
    params
  })
//获取服务分类下的服务技能
export const getServiceSkillByClassify = (params) =>
  request({
    url: `/customer/worker/serve-skill/listByServeType`,
    method: 'get',
    params
  })
//获取服务技能及其下的服务技能所有数据
export const getServiceSkillAll = (params) =>
  request({
    url: `/edj-customer/worker/serve/skill/category`,
    method: 'get',
    params
  })
//修改服务技能
export const updateServiceSkill = (params) =>
  request({
    url: `/edj-customer/worker/serve/skill/batch`,
    method: 'post',
    params
  })
//获取配置详细信息
export const getSettingInfo = (params) =>
  request({
    url: `/edj-customer/worker/serve/settings`,
    method: 'get',
    params
  })
//获取开通城市列表
export const getOpenCity = (params) =>
  request({
    url: `/edj-foundations/consumer/region/active`,
    method: 'get',
    params
  })
//修改服务范围
export const setServiceSetting = (params) =>
  request({
    url: `/edj-customer/worker/serve/settings/scope`,
    method: 'put',
    params
  })
//提交实名认证
export const postAuth = (params) =>
  request({
    url: `/edj-customer/worker/certification/audit`,
    method: 'post',
    params
  })
// 根据经纬度获取城市
export const getAddress = (params) =>
  request({
    url: `/edj-publics/map/regeo`,
    method: 'get',
    params
  })
//获取实名认证驳回原因
export const getAuthFail = () =>
  request({
    url: `/edj-customer/worker/certification/audit/reject/reason`,
    method: 'get'
  })
//提交账户设置
export const postAccount = (params) =>
  request({
    url: `/edj-customer/worker/bank/account`,
    method: 'post',
    params
  })
//获取账户设置信息
export const getAccountInfo = () =>
  request({
    url: `/edj-customer/worker/bank/account`,
    method: 'get'
  })
