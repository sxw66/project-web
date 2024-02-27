/** When your routing table is too long, you can split it into small modules**/
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
 * meta.activeMenu ==> 菜单高亮状态
 * meta.icon ==> 菜单icon
 * meta.affix ==> 如果设置为true将会出现在 标签栏中
 * meta.breadcrumb ==> 如果设置为false，该项将隐藏在breadcrumb中（默认值为true）
 * meta.showTag ==> tagsView 是否展示 默认不展示
 * meta.showTab ==> 头部tabs 是否展示如果需要展示则tabs 数组必穿
 */
import type { RouteRecordRaw } from 'vue-router'

import Layout from '@/layout/index.vue'

const routes: RouteRecordRaw = {
  path: '/product',
  component: Layout,
  redirect: '/product/regulate',
  name: 'product',
  meta: {
    title: '产品管理',
    icon: 'Connection',
    tabs: [
      { name: '需求', url: '/product/test/demand' },
      { name: '排期', url: '/product/test/schedule' },
      { name: '工单', url: '/product/test/workorder' },
      { name: '客户', url: '/product/test/client' },
      { name: '基线', url: '/product/test/baseline' },
    ],
    activeMenu: '/product',
  },
  children: [
    // ---------一级菜单------
    {
      path: 'regulate',
      component: () => import('@/views/product_example/list.vue'),
      name: 'regulate',
      meta: {
        title: '产品管理',
        icon: 'Operation',
      },
    },
    {
      path: 'settings/members',
      name: 'settingsMembers',
      component: () => import('@/views/product_example/list_products/settings.members.vue'),
      meta: {
        title: '更多设置',
      },
    },
    {
      path: 'recycle/bin',
      name: 'recycleBin',
      component: () => import('@/views/product_example/list_products/recycle.bin.vue'),
      meta: {
        title: '回收站',
      },
    },
    // ---------二级菜单------
    {
      path: 'test/demand',
      name: 'TestDemand',
      component: () => import('@/views/product_example/test_idea/demand_module/demand.vue'),
      meta: {
        showTab: true,
        title: '需求',
      },
    },
    {
      path: 'test/schedule',
      name: 'TestSchedule',
      component: () => import('@/views/product_example/test_idea/schedule_module/schedule.vue'),
      meta: {
        showTab: true,
        title: '排期',
      },
    },
    {
      path: 'test/workorder',
      name: 'TestWorkorder',
      component: () => import('@/views/product_example/test_idea/workorder_module/workorder.vue'),
      meta: {
        showTab: true,
        title: '工单',
      },
    },
    {
      path: 'test/client',
      name: 'TestClient',
      component: () => import('@/views/product_example/test_idea/client_module/client.vue'),
      meta: {
        showTab: true,
        title: '客户',
      },
    },
    {
      path: 'test/baseline',
      name: 'TestBaseline',
      component: () => import('@/views/product_example/test_idea/baseline_module/baseline.vue'),
      meta: {
        showTab: true,
        title: '基线',
      },
    },
    // ---------三级菜单------
    {
      path: 'edit/schedule',
      name: 'EditSchedule',
      component: () => import('@/views/product_example/test_idea/schedule_module/schedule_children/schedule.edit.vue'),
      meta: {
        showTab: true,
        title: '排期-账号管理',
        // 1.排期列表-跳转到商城后台根据当前行字段
        // 2.排期列表-跳转到商城首页根据当前行字段
        // 3.排期列表-跳转到订单管理根据当前行字段
        // 4.排期列表-跳转到账号管理根据当前行字段
      },
    },
  ],
}
export default routes
