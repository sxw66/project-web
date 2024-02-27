import { defineStore } from 'pinia'

export const useProductStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'productStore',
  // state: 返回对象的函数
  state: () => ({
    // 产品id
    productId: null,
  }),
  getters: {},
  // 可以同步 也可以异步
  actions: {
    handleSetProductId(val: any) {
      this.productId = val || ''
    },
  },
  // 进行持久化存储
  persist: {
    // 本地存储的名称
    key: 'productStore',
    //保存的位置
    storage: window.localStorage, //localstorage
  },
})
