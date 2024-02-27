import { defineStore } from 'pinia'

export const useProjectStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'projectStore',
  // state: 返回对象的函数
  state: () => ({
    // 项目id
    projectId: null,
    // 项目管理-顶部tabs数组项
    projectTabs: [],
    projectGather: {
      searchState: 0, // 搜索状态、编号1、标题2
      kanbanInputModel: '', // 输入框的值
      kanbanModelNum: 0, // 看板状态、需要调用列表接口的时候+1
      kanbanMenuActive: {}, // 看板列表页面中选中的看板数据
    },
    //
    workItemTabChecked: '',
    //工作项更多选中
    workItemMoreChecked: {},
  }),
  getters: {},
  // 可以同步 也可以异步
  actions: {
    handleSetProjectId(val: any) {
      this.projectId = val || ''
    },
    handleSetProjectTabs(val: any) {
      this.projectTabs = val || []
    },
    handleSetWorkItemTabChecked(val: any) {
      this.workItemTabChecked = val
    },
    handleSetWorkItemMoreChecked(val: any) {
      this.workItemMoreChecked = val
    },
    handleSetUpdateKanbanList() {
      this.projectGather.kanbanModelNum + 1
    },
  },
  // 进行持久化存储
  persist: {
    // 本地存储的名称
    key: 'projectStore',
    //保存的位置
    storage: window.localStorage, //localstorage
  },
})
