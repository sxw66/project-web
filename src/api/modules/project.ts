import request from '../request'

// 新增项目
export function projectAdd(data) {
  return request({
    url: '/projectInfo/add',
    method: 'post',
    data,
  })
}
// 分页查询项目列表
export function projectPage(data) {
  return request({
    url: '/projectInfo/page',
    method: 'post',
    data,
  })
}
// 更新项目信息
export function updateProject(data) {
  return request({
    url: '/projectInfo/edit',
    method: 'PUT',
    data,
  })
}
// 获取所有星标列表
export function getStarsList(data) {
  return request({
    url: '/projectInfo/starProjectList',
    method: 'get',
    data,
  })
}
// 根据ID查询项目基础信息表详情
export function productDetail(Id) {
  return request({
    url: `/projectInfo/${Id}`,
    method: 'get',
  })
}
// 根据ID查询项目详情
export function productDelete(Id) {
  return request({
    url: `/projectInfo/${Id}`,
    method: 'DELETE',
  })
}

// =============看板子模块接口

// 分页查询看板基础信息表
export function productKanBanPage(data) {
  return request({
    url: '/projectKanban/page',
    method: 'post',
    data,
  })
}
// 新增看板基础信息表
export function addProductKanBan(data) {
  return request({
    url: '/projectKanban/add',
    method: 'post',
    data,
  })
}
// 根据ID删除看板基础信息表
export function deleteProductKanBan(Id) {
  return request({
    url: `/projectKanban/${Id}`,
    method: 'DELETE',
  })
}

// 更新看板基础信息表
export function updateProductKanBan(data) {
  return request({
    url: '/projectKanban/edit',
    method: 'PUT',
    data,
  })
}
// 根据ID查询看板基础信息表详情
export function getIDKanBanDetails(Id) {
  return request({
    url: `/projectKanban/${Id}`,
    method: 'get',
  })
}

// 获取工作项信息列表
export function getWorkitemList(data) {
  return request({
    url: `/projectWorkItem/page`,
    method: 'post',
    data,
  })
}

// 新增工作项信息列表
export function addWorkitemList(data) {
  return request({
    url: `/projectWorkItem/add`,
    method: 'post',
    data,
  })
}

// 删除工作项信息列表
export function deleteWorkitemList(data) {
  return request({
    url: `/projectWorkItem/${data.id}`,
    method: 'delete',
  })
}

// 更新工作项信息列表
export function updateWorkitemList(data) {
  return request({
    url: `/projectWorkItem/edit`,
    method: 'put',
    data,
  })
}

// 新增看板基础信息表
export function addKanbanBasicSettingList(data) {
  return request({
    url: `/projectKanban/add`,
    method: 'post',
    data,
  })
}
// 分页查询项目标签信息表
export function queryItemLabelist(data) {
  return request({
    url: `/projectLabel/page`,
    method: 'post',
    data,
  })
}
// 新增项目标签信息表
export function addItemLabelist(data) {
  return request({
    url: `/projectLabel/add`,
    method: 'post',
    data,
  })
}

// 更新项目标签信息表
export function updateItemLabelist(data) {
  return request({
    url: `/projectLabel/edit`,
    method: 'put',
    data,
  })
}

// 根据ID删除项目标签信息表
export function delItemLabelist(Id) {
  return request({
    url: `/projectLabel/${Id}`,
    method: 'DELETE',
  })
}

// 获取看板泳道列表
export function getKanbanLaneList(data) {
  return request({
    url: `/projectKanbanLane/page`,
    method: 'post',
    data,
  })
}

// 新增看板泳道列表
export function addKanbanLaneList(data) {
  return request({
    url: `/projectKanbanLane/add`,
    method: 'post',
    data,
  })
}

// 新增看板泳道列表
export function updateKanbanLaneList(data) {
  return request({
    url: `/projectKanbanLane/edit`,
    method: 'put',
    data,
  })
}

// 删除看板泳道列表
export function deleteKanbanLaneList(data) {
  return request({
    url: `/projectKanbanLane/${data.id}`,
    method: 'delete',
  })
}

// 新增看板栏设置列表
export function addKanbanColumnList(data) {
  return request({
    url: `/projectKanbanColumn/add`,
    method: 'post',
    data,
  })
}

// 修改看板栏设置列表
export function updateKanbanColumnList(data) {
  return request({
    url: `/projectKanbanColumn/edit`,
    method: 'put',
    data,
  })
}

// 获取看板栏设置列表
export function getKanbanColumnList(data) {
  return request({
    url: `/projectKanbanColumn/page`,
    method: 'post',
    data,
  })
}

// 删除看板栏设置列表
export function deleteKanbanColumnList(data) {
  return request({
    url: `/projectKanbanColumn/${data.id}`,
    method: 'delete',
  })
}
