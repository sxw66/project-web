export const statusColorList = ['#5aacf9', '#fd9e76', '#f5c560', '#76d899', '#a5a5a5']
export const statusList = ['待评审', '已计划', '进行中', '已完成', '已关闭']
export const selectStatusList = [
  {
    label: '待处理',
    value: 0,
    disabled: false,
    bgc: '#5aacf9',
  },
  {
    label: '处理中',
    value: 1,
    disabled: false,
    bgc: '#fd9e76',
  },
  {
    label: '已计划',
    value: 2,
    disabled: false,
    bgc: '#f5c560',
  },
  {
    label: '已完成',
    value: 3,
    disabled: false,
    bgc: '#76d899',
  },
  {
    label: '已关闭',
    value: 4,
    disabled: false,
    bgc: '#d4d4d4',
  },
]
export const priorityColorList = ['#fd7477', '#fd9e76', '#f5c560', '#62d0fd', '#76d899']
export const prioityList = ['P0', 'P1', 'P2', 'P3', 'P4']
export const selectPriorityList = [
  {
    label: 'P0',
    value: 0,
    bgc: '#fd7477',
  },
  {
    label: 'P1',
    value: 1,
    bgc: '#fd9e76',
  },
  {
    label: 'P2',
    value: 2,
    bgc: '#f5c560',
  },
  {
    label: 'P3',
    value: 3,
    bgc: '#62d0fd',
  },
  {
    label: 'P4',
    value: 4,
    bgc: '#76d899',
  },
]
export const columnList = [
  {
    type: 'selection',
    width: 55,
    fixed: 'left',
  },
  {
    name: 'demandCode',
    label: '编号',
    width: 140,
    align: 'left',
    sortable: true,
    fixed: true,
    inSearch: true,
    valueType: 'input',
  },
  {
    inSearch: true,
    hide: true, // 不展示当前列
    valueType: 'filtrate',
  },
  {
    name: 'demandTitle',
    label: '标题',
    align: 'left',
    sortable: true,
    fixed: true,
    width: 320,
    slot: true,
  },
  {
    name: 'demandStatus',
    label: '状态',
    sortable: true,
    align: 'center',
    width: 140,
    slot: true,
  },
  {
    name: 'principal',
    label: '负责人',
    sortable: true,
    width: 140,
    slot: true,
  },
  {
    name: 'createTime',
    label: '创建时间',
    width: 200,
  },
  {
    name: 'deSchedule',
    label: '进度',
    width: 140,
    slot: true,
  },
  {
    name: 'actualTime',
    label: '实际时间',
    width: 200,
  },
  {
    name: 'planTime',
    label: '计划时间',
    width: 200,
  },
  {
    name: 'priority',
    label: '优先级',
    width: 140,
    slot: true,
  },
]
export const scheduleSteps = [
  {
    title: '需求',
    name: '全部需求',
    icon: 'all',
  },
]
export const detailFields = ['编号', '标题', '进度']
export const workOrderTypeList = [
  {
    label: '需求',
    value: 0,
    bgc: '#62d0fd',
  },
  {
    label: '缺陷',
    value: 1,
    bgc: '#f5c560',
  },
  {
    label: '技术支持',
    value: 2,
    bgc: '#76d899',
  },
]

export const fromTypeList = [
  {
    label: '产品规则',
    value: 0,
    bgc: '#5aacf9',
  },
  {
    label: '用户反馈',
    value: 1,
    bgc: '#86e181',
  },
  {
    label: '竞品调研',
    value: 2,
    bgc: '#f97795',
  },
  {
    label: '内部需求',
    value: 3,
    bgc: '#f3d573',
  },
]
