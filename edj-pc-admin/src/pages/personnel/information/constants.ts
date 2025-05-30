// 服务人员信息管理，表格列配置

import { formatDateTimeToDateTimeString } from '@/utils/date'
// 服务人员信息列表
export const COLUMNS = [
  {title: '真实姓名', width: 250, minWidth: '150px', colKey: 'name'},
  {
    title: '登录账号',
    width: 250,
    minWidth: '170px',
    sortType: 'all',
    colKey: 'phone'
  },
  {
    title: '身份证号',
    align: 'left',
    width: 250,
    minWidth: '200px',
    colKey: 'idNumber'
  },
  // { title: '服务分类', width: 250, minWidth: '150px', colKey: 'name' },
  {title: '服务城市', width: 250, minWidth: '150px', colKey: 'cityName'},
  {
    title: '接单状态',
    colKey: 'canPickUp',
    minWidth: '120px',
    cell: (h, {row}) => {
      const statusList = {
        0: {
          label: '休息中'
        },
        1: {
          label: '接单中'
        },
        '-1': {
          label: '未设置'
        },
      }
      // const status = row.canPickUp === -1 ? 0 : row.canPickUp
      return h(
        'span',
        {
          class: `status-dot status-dot-${row.canPickUp + 1}`
        },
        statusList[row.canPickUp].label
      )
    }
  },
  {
    title: '账号状态',
    colKey: 'status',
    minWidth: '120px',
    // 添加筛选
    filter: {
      type: 'single',
      list: [
        {
          label: '正常',
          value: 0
        },
        {
          label: '冻结',
          value: 1
        }
      ],
      showConfirmAndReset: true
    },
    cell: (h, {row}) => {
      const statusList = {
        0: {
          label: '正常'
        },
        1: {
          label: '冻结'
        }
      }
      const status = row.status === 0 ? '2' : 1
      return h(
        'span',
        {
          class: `status-dot status-dot-${status}`
        },
        statusList[row.status].label
      )
    }
  },
  {
    title: '认证时间',
    width: 250,
    minWidth: '180px',
    colKey: 'certificationTime',
    cell: (h, {row}) => h('span', row.certificationTime ? formatDateTimeToDateTimeString(new Date(row.certificationTime)) : '-')
  },
  {
    align: 'left',
    fixed: 'right',
    width: 120,
    minWidth: '120px',
    colKey: 'op',
    title: '操作'
  }
]
// 服务数据
export const SERVE_DATA = [
  {
    title: '订单编号',
    align: 'left',
    width: 200,
    minWidth: '200px',
    colKey: 'id'
  },
  {title: '服务名称', width: 150, minWidth: '150px', colKey: 'serveItemName'},
  {title: '评价评分（分）', width: 150, minWidth: '150px', colKey: 'score'},
  {title: '实付金额（元）', width: 150, minWidth: '150px', colKey: 'ordersAmount'},
  {
    title: '服务完成时间',
    minWidth: '180px',
    colKey: 'realServeEndTime',
    cell: (h, {row}) =>
      h('span', row.realServeEndTime ? formatDateTimeToDateTimeString(new Date(row.realServeEndTime)) : '-')
  },
  {
    align: 'left',
    // fixed: 'right',
    width: 120,
    minWidth: '120px',
    colKey: 'serveBeforeImgs',
    title: '服务前照片'
  }, {
    align: 'left',
    // fixed: 'right',
    width: 120,
    minWidth: '120px',
    colKey: 'serveAfterImgs',
    title: '服务后照片'
  },
  {
    align: 'left',
    // fixed: 'right',
    width: 120,
    minWidth: '120px',
    colKey: 'op2',
    title: '操作'
  }
]
