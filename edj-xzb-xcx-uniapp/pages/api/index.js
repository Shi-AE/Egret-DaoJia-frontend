import { request } from "../../utils/request"

// 首页服务图标
export const getHomeService = (params) => {
    return request({
        url: `/edj-foundations/consumer/serve/category`,
        method: 'get',
        params
    })
}
// 首页热门服务
export const getHotServe = (params) => {
    return request({
        url: `/edj-foundations/consumer/serve/hot`,
        method: 'get',
        params
    })
}
// 首页服务搜索
export const getServeSearch = (params) => {
    return request({
        url: `/edj-foundations/consumer/serve/search`,
        method: 'get',
        params
    })
}
