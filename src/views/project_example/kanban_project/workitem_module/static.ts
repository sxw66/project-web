export const statusColorList = ['#5aacf9', '#fae2af', '#76d899', '#d4d4d4']
export const statusList = ['打开', '进行中', '已完成', '已关闭']
export const selectStatusList = [
  {
    label: '打开',
    value: 0,
    disabled: false,
    bgc: '#5aacf9',
  },
  {
    label: '进行中',
    value: 1,
    disabled: false,
    bgc: '#fae2af',
  },
  {
    label: '已完成',
    value: 2,
    disabled: false,
    bgc: '#76d899',
  },
  {
    label: '已关闭',
    value: 3,
    disabled: false,
    bgc: '#d4d4d4',
  },
]
export const priorityColorList = ['#fd7477', '#fd9e76', '#f5c560', '#62d0fd', '#76d899']
export const prioityList = ['最高', '较高', '普通', '较低', '最低']
export const selectPriorityList = [
  {
    label: '最高',
    value: 0,
    bgc: '#fd7477',
  },
  {
    label: '较高',
    value: 1,
    bgc: '#fd9e76',
  },
  {
    label: '普通',
    value: 2,
    bgc: '#f5c560',
  },
  {
    label: '较低',
    value: 3,
    bgc: '#62d0fd',
  },
  {
    label: '最低',
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
    name: 'itemCode',
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
    name: 'itemName',
    label: '标题',
    align: 'left',
    sortable: true,
    fixed: true,
    width: 320,
    slot: true,
  },
  {
    name: 'itemStatus',
    label: '状态',
    sortable: true,
    align: 'center',
    width: 140,
    slot: true,
  },
  // {
  //   name: 'itemType',
  //   label: '工作项类型',
  //   sortable: true,
  //   align: 'center',
  //   width: 140,
  //   // slot: true,
  // },
  // {
  //   name: 'needFrom',
  //   label: '需求来源',
  //   sortable: true,
  //   align: 'center',
  //   width: 140,
  //   // slot: true,
  // },
  // {
  //   name: 'needType',
  //   label: '需求类型',
  //   sortable: true,
  //   align: 'center',
  //   width: 140,
  //   // slot: true,
  // },
  {
    name: 'principal',
    label: '负责人',
    sortable: true,
    width: 140,
    slot: true,
  },
  {
    name: 'kanbanId',
    label: '看板',
    width: 200,
  },
  {
    name: 'priority',
    label: '优先级',
    width: 140,
    slot: true,
  },
  {
    name: 'createTime',
    label: '父工作项',
    width: 200,
  },
  {
    name: 'deSchedule',
    label: '开始时间',
    width: 140,
    // slot: true,
  },
  {
    name: 'actualTime',
    label: '截止时间',
    width: 200,
  },
]
export const scheduleSteps = [
  {
    title: '需求',
    name: '全部需求',
    icon: 'all',
  },
]
export const detailFields = ['编号', '标题']
export const workitemTypeList = [
  {
    label: '技术需求',
    value: 0,
    bgc: '#62d0fd',
  },
  {
    label: '功能需求',
    value: 1,
    bgc: '#f5c560',
  },
  {
    label: '安全需求',
    value: 2,
    bgc: '#76d899',
  },
  {
    label: '体验优化',
    value: 3,
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
  {
    label: '其他',
    value: 4,
    bgc: '#f3d573',
  },
]

export const addSelectList = [
  {
    label: '史诗',
  },
  {
    label: '特性',
  },
  {
    label: '用户故事',
  },
  {
    label: '任务',
  },
  {
    label: '缺陷',
  },
  {
    label: '事务',
  },
]

export const riskLevelList = [
  {
    label: '高',
    value: 0,
  },
  {
    label: '中',
    value: 1,
  },
  {
    label: '低',
    value: 2,
  },
]

export const itemTypeList = [
  {
    label: '史诗',
    value: 0,
  },
  {
    label: '特性',
    value: 1,
  },
  {
    label: '用户故事',
    value: 2,
  },
  {
    label: '任务',
    value: 3,
  },
  {
    label: '缺陷',
    value: 4,
  },
  {
    label: '事务',
    value: 5,
  },
]

export const moreList = [
  {
    label: '已完成的工作项',
    value: 0,
    icon: 'Operation',
    divided: false,
    checked: false,
  },
  {
    label: '未完成的工作项',
    value: 1,
    icon: 'Operation',
    divided: false,
    checked: false,
  },
  {
    label: '未关联看板的工作项',
    value: 2,
    icon: 'Operation',
    divided: false,
    checked: false,
  },
  {
    label: '已归档的工作项',
    value: 3,
    icon: 'Operation',
    divided: false,
    checked: false,
  },
  {
    label: '乱加的工作项',
    value: 4,
    icon: 'Operation',
    divided: false,
    checked: false,
  },
  {
    label: '新建视图',
    value: 5,
    icon: 'Plus',
    divided: true,
    checked: false,
  },
  {
    label: '视图管理',
    value: 6,
    icon: 'Setting',
    divided: false,
    checked: false,
  },
]
