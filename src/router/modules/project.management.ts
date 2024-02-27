/**
 * path ==> 路由路径
 * name ==> 路由名称
 * component ==> 路由组件
 * redirect ==> 路由重定向
 * alwaysShow ==> 如果设置为true，将始终显示根菜单，无论其子路由长度如何
 * hidden ==> 如果“hidden:true”不会显示在侧边栏中（默认值为false）
 * keepAlive ==> 设为true 缓存
 * meta ==> 路由元信息
 * meta.title ==> 路由标题
 * meta.icon ==> 菜单icon
 * meta.affix ==> 如果设置为true将会出现在 标签栏中
 * meta.breadcrumb ==> 如果设置为false，该项将隐藏在breadcrumb中（默认值为true）
 * meta.showTag ==> tagsView 是否展示 默认不展示
 * meta.showTab ==> 头部tabs 是否展示如果需要展示则tabs 数组必穿
 */
import type { RouteRecordRaw } from 'vue-router'
/*
  1.项目类型 0:Scrum项目 1:Knaban项目 2:瀑布项目
  2.根据路由区分项目
  3.2023-11-20-16点40分 😴
*/
import Layout from '@/layout/index.vue'

const routes: RouteRecordRaw = {
  path: '/project',
  component: Layout,
  redirect: '/project/projectManage',
  name: 'project',
  meta: {
    title: '项目管理',
    icon: 'Document',
  },
  children: [
    {
      path: 'projectManage',
      name: 'projectManage',
      component: () => import('@/views/project_example/management_list/list.vue'),
      meta: {
        title: '项目管理',
        icon: '',
        activeMenu: '/project',
      },
    },
    // ------二级路由------
    /*
      0.Scrum项目
      0.Scrum项目
      0.Scrum项目
    */
    {
      path: 'detail/baseInfo',
      name: 'baseInfo',
      component: () => import('@/views/project_example/kanban_project/overview_module/baseInfo.vue'),
      meta: {
        showTab: true,
        title: '概览',
      },
    },
    {
      path: 'detail/plan',
      name: 'plan',
      component: () => import('@/views/project_example/scrum_project/plan_module/plan.scrum.vue'),
      meta: {
        showTab: true,
        title: '规划',
      },
    },
    {
      path: 'detail/demand',
      name: 'demand',
      component: () => import('@/views/project_example/scrum_project/demand_module/demand.scrum.vue'),
      meta: {
        showTab: true,
        title: '需求',
      },
    },
    {
      path: 'detail/flaw',
      name: 'flaw',
      component: () => import('@/views/project_example/scrum_project/flaw_module/flaw.scrum.vue'),
      meta: {
        showTab: true,
        title: '缺陷',
      },
    },
    {
      path: 'detail/iteration',
      name: 'iteration',
      component: () => import('@/views/project_example/scrum_project/iteration_module/iteration.scrum.vue'),
      meta: {
        showTab: true,
        title: '迭代',
      },
    },

    {
      path: 'detail/publish',
      name: 'publish',
      component: () => import('@/views/project_example/scrum_project/publish_module/publish.scrum.vue'),
      meta: {
        showTab: true,
        title: '发布',
      },
    },
    {
      path: 'detail/basic',
      name: 'basic',
      component: () => import('@/views/project_example/scrum_project/basic_module/basic.scrum.vue'),
      meta: {
        showTab: true,
        title: '基线',
      },
    },
    {
      path: 'detail/testInfo',
      name: 'testInfo',
      component: () => import('@/views/project_example/scrum_project/testInfo_module/testInfo.scrum.vue'),
      meta: {
        showTab: true,
        title: '测试',
      },
    },
    {
      path: 'detail/pageInfo',
      name: 'pageInfo',
      component: () => import('@/views/project_example/scrum_project/pageInfo_module/pageInfo.scrum.vue'),
      meta: {
        showTab: true,
        title: '页面',
      },
    },
    {
      path: 'detail/resource',
      name: 'resource',
      component: () => import('@/views/project_example/scrum_project/resource_module/resource.scrum.vue'),
      meta: {
        showTab: true,
        title: '资源',
      },
    },
    {
      path: 'detail/statement',
      name: 'statement',
      component: () => import('@/views/project_example/scrum_project/statement_module/statement.scrum.vue'),
      meta: {
        showTab: true,
        title: '报表',
      },
    },
    // ------二级路由------
    /*
      1.Knaban项目
      1.Knaban项目
      1.Knaban项目
    */
    {
      path: 'detail/board',
      name: 'board',
      component: () => import('@/views/project_example/kanban_project/board_module/board.kanban.vue'),
      meta: {
        showTab: true,
        title: '看板',
      },
    },
    {
      path: 'detail/workItem',
      name: 'workItem',
      component: () => import('@/views/project_example/kanban_project/workitem_module/workitem.vue'),
      meta: {
        showTab: true,
        title: '工作项',
      },
    },
    // ------二级路由------
    /*
      2:瀑布项目
      2:瀑布项目
      2:瀑布项目
    */
    {
      path: 'detail/milestone',
      name: 'milestone',
      component: () => import('@/views/project_example/waterfall_project/milestone_module/milestone.vue'),
      meta: {
        showTab: true,
        title: '里程碑',
      },
    },
    {
      path: 'detail/deliverable',
      name: 'deliverable',
      component: () => import('@/views/project_example/waterfall_project/deliverable_module/deliverable.vue'),
      meta: {
        showTab: true,
        title: '交付物',
      },
    },
  ],
}

export default routes
