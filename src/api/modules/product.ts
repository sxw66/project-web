import request from '../request'

// 新增产品
export function productAdd(data) {
  return request({
    url: '/productInfo/add',
    method: 'post',
    data,
  })
}
// 分页查询产品基础信息表
export function getProductPages(data) {
  return request({
    url: '/productInfo/page',
    method: 'post',
    data,
  })
}
// 更新产品基础信息表
export function updateProductPages(data) {
  return request({
    url: '/productInfo/edit',
    method: 'PUT',
    data,
  })
}

// 获取所有星标列表
export function getsListAllStars(data) {
  return request({
    url: '/productInfo/starList',
    method: 'get',
    data,
  })
}

// 分页查询计划详情表
export function getSchedulePages(data) {
  return request({
    url: '/productPlan/page',
    method: 'post',
    data,
  })
}

// 新增计划详情表
export function addSchedulePages(data) {
  return request({
    url: '/productPlan/add',
    method: 'post',
    data,
  })
}

// 根据ID删除计划详情表
export function delSchedulePages(scheduleId) {
  return request({
    url: `/productPlan/${scheduleId}`,
    method: 'delete',
  })
}

// 更新计划详情表
export function editSchedulePages(data) {
  return request({
    url: '/productPlan/edit',
    method: 'put',
    data,
  })
}

// 获取产品计划下的需求列表
export function getProductPlanPages(data) {
  return request({
    url: '/productPlan/listDemandByPlan',
    method: 'post',
    data,
  })
}

// 获取产品计划下的需求树形
export function getProductTreePlanPages(data) {
  return request({
    url: '/productPlan/treeDemandByPlan',
    method: 'post',
    data,
  })
}

// 分页查询工单详情表
export function getWorkPages(data) {
  return request({
    url: '/productOrder/page',
    method: 'post',
    data,
  })
}

// 新增产品模块详情表
export function addProductModuleList(data) {
  return request({
    url: '/productModule/add',
    method: 'post',
    data,
  })
}
// 根据绑定Id及类别获取组件树
export function getKindTreeList(data) {
  return request({
    url: '/productModule/getKindTree',
    method: 'get',
    params: {
      ...data,
    },
  })
}
// 根据ID删除产品模块详情表
export function delKindTreeList(treeId) {
  return request({
    url: `/productModule/${treeId}`,
    method: 'delete',
  })
}
// 更新产品模块详情表
export function updateKindTreeList(data) {
  return request({
    url: `/productModule/edit`,
    method: 'put',
    data,
  })
}
// 分页查询客户信息表
export function getCustomerPages(data) {
  return request({
    url: `/productCustomer/page`,
    method: 'post',
    data,
  })
}
// 新增客户信息表
export function addCustomerPages(data) {
  return request({
    url: `/productCustomer/add`,
    method: 'post',
    data,
  })
}
// 根据ID删除客户信息表
export function delCustomerPages(customerId) {
  return request({
    url: `/productCustomer/${customerId}`,
    method: 'delete',
  })
}
// 更新客户信息表
export function updateCustomerPages(data) {
  return request({
    url: `/productCustomer/edit`,
    method: 'put',
    data,
  })
}

// 获取工单信息列表
export function getWorkOrderList(data) {
  return request({
    url: `/productOrder/page`,
    method: 'post',
    data,
  })
}

// 新增工单信息列表
export function addWorkOrderList(data) {
  return request({
    url: `/productOrder/add`,
    method: 'post',
    data,
  })
}

// 获取需求信息列表
export function getDemandList(data) {
  return request({
    url: `/productDemand/page`,
    method: 'post',
    data,
  })
}

//新增需求信息列表
export function addDemandList(data) {
  return request({
    url: `/productDemand/add`,
    method: 'post',
    data,
  })
}

//获取所有产品信息列表
export function getAllProductList() {
  return request({
    url: `/productInfo/starList`,
    method: 'get',
  })
}

//删除需求信息列表
export function deleteDemandList(data) {
  return request({
    url: `/productDemand/${data.id}`,
    method: 'delete',
  })
}

//更新需求详情表
export function updateDemandList(data) {
  return request({
    url: `/productDemand/edit`,
    method: 'put',
    data,
  })
}

//删除工单信息列表
export function deleteWorkOrderList(data) {
  return request({
    url: `/productOrder/${data.id}`,
    method: 'delete',
  })
}

//更新工单信息列表
export function updateWorkOrderList(data) {
  return request({
    url: `/productOrder/edit`,
    method: 'put',
    data,
  })
}
