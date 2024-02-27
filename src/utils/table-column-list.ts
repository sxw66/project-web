import { typepeList, productStartList } from './public-data'
// 初始化项目管理表头
export const columnInitial = [
  {
    name: 'projectName',
    label: '项目',
    sortable: true,
    slot: true,
    inSearch: true,
    valueType: 'input',
    width: 300,
    hideHeaderMenu: true,
  },
  {
    name: 'iconShow',
    slot: true,
    width: 200,
  },
  {
    name: 'projectType',
    label: '项目类型',
    inSearch: true,
    hide: true,
    options: typepeList,
    valueType: 'select',
  },
  {
    name: 'projectCode',
    label: '标识',
    hideHeaderMenu: true,
  },
  {
    name: 'productTarget',
    label: '星标',
    inSearch: true,
    hide: true,
    options: productStartList,
    radioModel: '全部',
    valueType: 'radio-button',
  },
  {
    name: 'fromType',
    label: '所属',
    sortable: true,
    slot: true,
    hideHeaderMenu: true,
  },
  {
    name: 'createTime',
    label: '时间',
    sortable: true,
  },
]
// 项目集表头
export const columnItemSet = [
  {
    name: 'projectName',
    label: '项目集',
    sortable: true,
    slot: true,
    inSearch: true,
    valueType: 'input',
    width: 300,
    hideHeaderMenu: true,
  },
  {
    name: 'projectStatus',
    label: '星标',
    inSearch: true,
    hide: true,
    options: [
      {
        label: '全部',
        value: '0',
      },
      {
        label: '正常',
        value: '1',
      },
      {
        label: '预警',
        value: '2',
      },
      {
        label: '延期',
        value: '3',
      },
    ],
    radioModel: '全部',
    valueType: 'radio-button',
  },
  {
    name: 'iconShow',
    slot: true,
    width: 200,
  },
  {
    name: 'projectCode',
    label: '标识',
    hideHeaderMenu: true,
  },
  {
    name: 'creater',
    label: '负责人',
    hideHeaderMenu: true,
  },
  {
    name: 'startTime',
    label: '开始时间',
    width: 150,
    hideHeaderMenu: true,
  },
  {
    name: 'endTime',
    label: '结束时间',
    width: 150,
    hideHeaderMenu: true,
  },
  {
    name: 'work',
    label: '工作',
    hideHeaderMenu: true,
  },
]
// 筛选器表头表头
export const columnItemSizer = [
  {
    name: 'projectName',
    label: '筛选器',
    sortable: true,
    slot: true,
    inSearch: true,
    valueType: 'input',
    width: 300,
    hideHeaderMenu: true,
  },
  {
    name: 'projectStatus',
    label: '星标',
    inSearch: true,
    hide: true,
    options: [
      {
        label: '全部',
        value: '0',
      },
      {
        label: '公开',
        value: '1',
      },
      {
        label: '自己可见',
        value: '2',
      },
    ],
    radioModel: '全部',
    valueType: 'radio-button',
  },
  {
    name: 'iconMore',
    slot: true,
    width: 200,
  },
  {
    name: 'isPrivate',
    label: '可见范围',
    hideHeaderMenu: true,
    slot: true,
  },
  {
    name: 'updater',
    label: '更新人',
    hideHeaderMenu: true,
  },
  {
    name: 'updateTime',
    label: '更新时间',
    width: 150,
    hideHeaderMenu: true,
  },
]
