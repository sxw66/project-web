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
 */
import type { RouteRecordRaw } from 'vue-router'

import Layout from '@/layout/index.vue'

const routes: RouteRecordRaw = {
  path: '/admin',
  component: Layout,
  redirect: '/admin/overview',
  name: 'admin',
  meta: {
    title: '配置中心',
    icon: 'Connection',
    showTab: true,
    tabs: [
      { name: '概览', url: '/admin/overview' },
      { name: '成员', url: '/admin/member' },
      { name: '组织', url: '/admin/organization' },
      { name: '应用', url: '/admin/application' },
      { name: '产品', url: '/admin/products' },
    ],
  },
  children: [
    {
      path: 'overview',
      component: () => import('@/views/configuration_center/admin.overview.vue'),
      name: 'overview',
      meta: {
        title: '概览',
        icon: 'Operation',
      },
    },
    {
      path: 'member',
      component: () => import('@/views/configuration_center/admin.members.vue'),
      name: 'member',
      meta: {
        title: '成员',
        icon: 'Operation',
      },
    },
    {
      path: 'organization',
      component: () => import('@/views/configuration_center/admin.organization.vue'),
      name: 'organization',
      meta: {
        title: '组织',
        icon: 'Operation',
      },
    },
    {
      path: 'application',
      component: () => import('@/views/configuration_center/admin.application.vue'),
      name: 'application',
      meta: {
        title: '应用',
        icon: 'Operation',
      },
    },
    {
      path: 'products',
      component: () => import('@/views/configuration_center/admin_product/admin.product.vue'),
      name: 'products',
      meta: {
        title: '产品',
        icon: 'Operation',
      },
    },
  ],
}
export default routes
