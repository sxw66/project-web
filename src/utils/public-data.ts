import { ref } from 'vue'
import {
  DocumentCopy,
  Edit,
  User,
  Plus,
  Delete,
  Operation,
  Setting,
  Aim,
  RefreshLeft,
  Promotion,
  EditPen,
  Switch,
  Timer,
  DataLine,
  PriceTag,
  CollectionTag,
  Connection,
  Menu,
  Paperclip,
} from '@element-plus/icons-vue'
// 一些公共的静态数据
export const operationOptions = ref([
  {
    value: 0,
    label: 'L0',
    color: 'rgb(255, 117, 117)',
    command: 'A',
  },
  {
    value: 1,
    label: 'L1',
    color: 'rgb(255, 159, 115)',
    command: 'B',
  },
  {
    value: 2,
    label: 'L2',
    color: 'rgb(246, 198, 89)',
    command: 'C',
  },
  {
    value: 3,
    label: 'L3',
    color: 'rgb(93, 207, 255)',
    command: 'D',
  },
  {
    value: 4,
    label: 'L4',
    color: 'rgb(93, 107, 255)',
    command: 'E',
  },
  {
    value: 5,
    label: 'L5',
    color: 'rgb(93, 7, 255)',
    command: 'F',
  },
])
export const plannedStatusOptions = ref([
  {
    value: 0,
    label: '账号管理',
    command: '账号管理',
  },
  {
    value: 1,
    label: '订单管理',
    command: '订单管理',
  },
  {
    value: 2,
    label: '优化需求',
    command: '优化需求',
  },
  {
    value: 3,
    label: '商城首页',
    command: '商城首页',
  },
  {
    value: 4,
    label: '商城后台',
    command: '商城后台',
  },
])
export const typeOptions = ref([
  {
    label: '负责人',
    value: 4,
  },
  {
    value: 0,
    label: '行业',
  },
  {
    value: 1,
    label: '等级',
  },
  {
    value: 2,
    label: '类别',
  },
  {
    value: 3,
    label: '规模',
  },
])
export const industryOptions = ref([
  {
    value: 0,
    label: '金融',
  },
  {
    value: 1,
    label: '互联网',
  },
  {
    value: 2,
    label: '制造厂',
  },
  {
    value: 3,
    label: '无业',
  },
])

export const fieldList = [
  // {
  //   label: '负责人',
  //   code: 'principal',
  // },
  {
    label: '类型',
    code: 'orderType',
  },
  {
    label: '状态',
    code: 'orderStatus',
  },
  {
    label: '渠道',
    code: 'channel',
  },
  {
    label: '解决方案',
    code: 'solution',
  },
  // {
  //   label: '提交人',
  //   code: 'createName',
  // },
  // {
  //   label: '客户',
  //   code: 'customerId',
  // },
  // {
  //   label: '更新人',
  //   code: 'updater',
  // },
  // {
  //   label: '创建时间',
  //   code: 'createTime',
  // },
  // {
  //   label: '更新时间',
  //   code: 'updateTime',
  // },
]
export const typeList = [
  {
    label: '需求',
    value: 0,
  },
  {
    label: '缺陷',
    value: 1,
  },
  {
    label: '技术支持',
    value: 2,
  },
]
export const statusList = [
  {
    label: '待处理',
    value: 0,
  },
  {
    label: '处理中',
    value: 1,
  },
  {
    label: '已计划',
    value: 2,
  },
  {
    label: '已完成',
    value: 3,
  },
  {
    label: '已关闭',
    value: 4,
  },
]
export const channelList = [
  {
    label: '内部提交',
    value: 0,
  },
]
export const solutionList = [
  {
    label: '进入需求池',
    value: 0,
  },
  {
    label: '技术排期',
    value: 1,
  },
  {
    label: '待进一步确认等',
    value: 2,
  },
]
// 项目文案描述
export const descList = [
  {
    title: '产品',
    text: '产品与需求池管理，提供多维度的需求规划工具，打通客户、业务团队和产研团队之间的协作。',
    tipList: [
      '模块化需求管理，构建清晰且统一的需求池',
      '标准化评估需求分数，统一衡量需求优先级',
      '多渠道收集整理工单，搭建与客户之间的沟通平台',
    ],
  },
  {
    title: 'Scrum',
    text: 'Scrum是一种增量迭代式的敏捷开发方法，帮助企业持续规划和交付业务价值。',
    tipList: [
      '通过Epic/Feature/User Story管理需求',
      '轻松规划迭代，追踪回顾迭代开发',
      '从产品角度定义并管理发布',
    ],
  },
  {
    title: 'Kanban',
    text: 'Kanban是一种简单灵活、轻量高效的敏捷开发方法，通过拉动和可视化的方式持续交付业务价值。',
    tipList: [
      '支持多个看板，建立专属工作流',
      '在制品限制WIP，让价值流动起来',
      '定义DoD（Definition of Done），把控质量',
    ],
  },
  {
    title: '瀑布',
    text: '瀑布是一种将开发工作拆分阶段，并按序执行的研发模型，支持合理规划项目，对进度、成本与风险高度把控。',
    tipList: [
      '创建项目计划，规划甘特图，确保项目交付',
      '交付物检查，降低交付风险',
      '提供风险预警，把控项目进度',
    ],
  },
  {
    title: '项目集',
    text: '项目集适用于多项目的集中式协调管理，帮助企业规划项目交付时间，管理项目进度，关注并提高资源分配情况。',
    tipList: [
      '制定多层项目集，管理工作进度',
      '规划项目路线图，制定交付计划',
      '合理安排资源，提高团队效率',
    ],
  },
]

// 项目类型
export const typepeList = [
  { label: 'Scrum 项目', value: 0, iconName: 'scrum', iconColor: '#56abfb', imgFlag: 'item' },
  { label: 'Kanban 项目', value: 1, iconName: 'kanban', iconColor: '#f6c659', imgFlag: 'kanban' },
  { label: '瀑布项目', value: 2, iconName: 'pubu', iconColor: '#73d897', imgFlag: 'pubu' },
]
// 项目所属情况
export const formTypeList = [
  { label: '组织', value: 0 },
  { label: '团队', value: 1 },
]
// 可见范围
export const permissionList = [
  {
    label: '公开',
    value: 0,
    iconName: 'open',
    text: '组织全部成员可见，仅加入的项目成员可编辑',
  },
  {
    label: '私有',
    value: 1,
    iconName: 'private',
    text: '仅加入的成员可见可编辑',
  },
]

// 负责人
export const personList = [
  {
    label: '彭峰',
    value: '彭峰',
  },
  {
    label: '东亮',
    value: '东亮',
  },
  {
    label: '骆生',
    value: '骆生',
  },
]

// 工作项类型
export const WorkItemType = [
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

// 操作数据
export const moreMenu = [
  {
    command: 'productInformation',
    divided: false,
    label: '产品信息',
    disabled: false,
    icon: Plus,
  },
  {
    command: 'productMember',
    divided: true,
    label: '产品成员',
    icon: User,
  },
  {
    command: 'editBasic',
    divided: false,
    label: '编辑基本信息',
    icon: Edit,
  },
  {
    command: 'moreSetting',
    divided: false,
    label: `更多设置`,
    icon: Operation,
  },
  {
    command: 'recycleBin',
    divided: false,
    label: `回收站`,
    icon: Delete,
  },
]

// 星标数据
export const productStartList = [
  {
    value: 1,
    label: '全部',
  },
  {
    value: 0,
    label: '星标',
  },
]

// 筛选器数据
export const tableFilterListA = [
  {
    command: 'Copy-filter',
    divided: false,
    label: '复制筛选器',
    disabled: false,
    icon: DocumentCopy,
  },
  {
    command: 'Del-filter',
    divided: true,
    label: '删除',
    icon: Delete,
  },
  {
    command: 'Edit-filter',
    divided: false,
    label: '编辑',
    icon: Edit,
  },
]
// 看板数据1
export const KanbanRightListA = [
  {
    command: 'User-stories',
    icon: EditPen,
    label: '用户故事',
    type: 2,
  },
  {
    command: 'User-tak',
    icon: Promotion,
    label: '任务',
    type: 3,
  },
  {
    command: 'User-flaw',
    icon: Aim,
    label: '缺陷',
    type: 4,
  },
]
// 看板数据2
export const KanbanIconListB = [
  {
    command: 'Import-work-item',
    icon: EditPen,
    label: '导入工作项',
  },
  {
    command: 'Export-work-item',
    icon: Promotion,
    label: '导出工作项',
  },
  {
    command: 'Delete-kanban',
    icon: Aim,
    label: '删除看板',
  },
]

// 看板拖拽-菜单数据
export const draggableMenuList = [
  {
    command: 'Import-work-item',
    icon: EditPen,
    label: '新建工作项',
  },
  {
    command: 'Export-work-item',
    icon: Promotion,
    label: '整理工作项',
  },
  {
    command: 'Delete-kanban',
    icon: Aim,
    label: '栏设置',
  },
  {
    command: 'Delete-kanban',
    icon: RefreshLeft,
    label: '批量操作工作项',
  },
  {
    command: 'Delete-kanban',
    icon: RefreshLeft,
    label: '归档已完成工作项',
    disabled: true,
  },
]

// 看板拖拽-状态
export const draggableListState = [
  {
    command: 'dragga-open',
    label: '打开',
    value: 0,
  },
  {
    command: 'dragga-underway',
    type: 'warning',
    label: '进行中',
    value: 1,
  },
  {
    command: 'dragga-done',
    type: 'success',
    label: '已完成',
    value: 2,
  },
  {
    command: 'dragga-close',
    type: 'info',
    label: '关闭',
    value: 3,
  },
]

// 看板拖拽-更多-下拉菜单
export const draggabMoreList = [
  {
    command: 'dragga-astate',
    label: '修改状态',
    icon: Switch,
  },
  {
    command: 'dragga-principal',
    label: '负责人',
    icon: User,
  },
  {
    command: 'dragga-start-time',
    label: '开始时间',
    icon: Timer,
  },
  {
    command: 'dragga-off-time',
    label: '截至时间',
    icon: Timer,
  },
  {
    command: 'dragga-priority',
    label: '优先级',
    icon: DataLine,
  },
  {
    command: 'dragga-design-label',
    label: '设置标签',
    icon: PriceTag,
  },
  {
    command: 'dragga-parent-work-item',
    label: '更改父工作项',
    icon: Paperclip,
  },
  {
    command: 'dragga-associated-work-item',
    label: '关联工作项',
    icon: Connection,
  },
  {
    command: 'dragga-Move-Kanban',
    label: '移入看板',
    icon: Menu,
  },
  {
    command: 'dragga-Move-publish',
    label: '移入发布',
    icon: Promotion,
  },
]
// 看板设置-选择状态
export const SelectiveState = [
  { type: '', label: '未完成', value: 0, desc: '系统' },
  { type: 'warning', label: '挂起', value: 1, desc: '系统' },
  { type: 'info', label: '已拒绝', value: 2, desc: '系统' },
  { type: 'success', label: '已发布', value: 3, desc: '系统' },
  { type: 'warning', label: '重新打开', value: 4, desc: '系统' },
  { type: 'warning', label: '已修复', value: 5, desc: '系统' },
  { type: 'warning', label: '处理中', value: 6, desc: '系统' },
  { type: '', label: '新提交', value: 7, desc: '系统' },
]
// 看板设置-目标状态
export const TargetStateList = [
  { label: '未开始', value: 0, bg: 'rgb(86, 171, 251)' },
  { label: '进行中', value: 1, bg: 'rgb(246, 198, 89)' },
  { label: '已完成', value: 2, bg: 'rgb(115, 216, 151)' },
  { label: '已关闭', value: 2, bg: 'rgb(170, 170, 170)' },
]