import { request } from '../../utils/request'
// 获取当前开通的城市列表
export const getCityList = () =>
  request({
    url: `/edj-foundations/consumer/region/active`,
    method: 'get'
  })
// 根据经纬度获取城市
export const getAddress = (params) =>
  request({
    url: `/edj-publics/map/regeo`,
    method: 'get',
    params
  })
// 根据城市编号获取系统id
export const getIdByCityCode = (params) =>
  request({
    url: `/edj-foundations/open/city/id`,
    method: 'get',
    params
  })
// 地址薄分页查询
export const getAddressBook = (params) =>
  request({
    url: `/edj-customer/consumer/address/book/page`,
    method: 'post',
    params
  })
// 地址薄新增
export const addAddressBook = (params) =>
  request({
    url: `/edj-customer/consumer/address/book`,
    method: 'post',
    params
  })


// 地址簿详情
export const getAddressBookDetail = (id) =>
  request({
    url: `/edj-customer/consumer/address/book/${id}`,
    method: 'get'
  })
// 获取默认地址
export const getDefaultAddress = () =>
  request({
    url: `/edj-customer/consumer/address/book/default`,
    method: 'get'
  })
// 地址薄设为默认/取消默认
export const setDefaultAddress = (id, flag) =>
  request({
    url: `/edj-customer/consumer/address/book/default?id=${id}&flag=${flag}`,
    method: 'put'
  })
// 地址薄批量删除
export const deleteAddressBook = (params) =>
  request({
    url: `/edj-customer/consumer/address/book/batch`,
    method: 'delete',
    params
  })
// 地址薄详情
export const getAddressBookInfo = (id) =>
  request({
    url: `/edj-customer/consumer/address/book/${id}`,
    method: 'get'
  })
// 地址薄修改
export const updateAddressBook = (id, params) =>
  request({
    url: `/edj-customer/consumer/address/book/${id}`,
    method: 'put',
    params
  })
// 根据经纬度查询详细地址
export const getAddressByLocation = (params) =>
  request({
    url: `/address/findDetailByLocation`,
    method: 'get',
    params
  })
// 获取当前开通的城市列表
// 区域展示相关配置
export const getAreaConfig = (params) => {
  return request({
    url: `/foundations/consumer/region/queryRegionDisplayByCityCode`,
    method: 'get',
    params
  })
}
