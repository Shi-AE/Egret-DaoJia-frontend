import { request } from '@/utils/request'
import type { ListResult } from '@/api/model/listModel'

export function getProjectList() {
  return request.get<ListResult>({
    url: '/get-detail-list'
  })
}

// 机构下属服务人员分页列表
export function getPersonnelDetailList(params) {
  return request.get({
    url: '/customer/agency/institution-staff/page',
    params
  })
}

// 抢单管理列表
export function getRobOrderList(params) {
  return request.post({
    url: '/edj-orders-grab/provider/orders/garb',
    data: params
  })
}

// 抢单
export function robOrder(params) {
  return request.post({
    url: `/edj-orders-grab/provider/orders/garb/${params}`
  })
}
