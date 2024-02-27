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

import Layout from '@/layout/index.vue'

const routes: RouteRecordRaw = {
  path: '/beta',
  component: Layout,
  redirect: '/beta/manage',
  name: 'beta',
  meta: {
    title: '测试管理',
    icon: 'Connection',
  },
  children: [
    {
      path: 'manage',
      component: () => import('@/views/test_example/list.vue'),
      name: 'manage',
      meta: {
        title: '测试管理',
        icon: 'Operation',
        alwaysShow: true,
        activeMenu: '/beta',
      },
    },
    {
      path: 'edit',
      name: 'Edit',
      component: () => import('@/views/test_example/edit.vue'),
      meta: {
        title: '测试管理详情',
        breadcrumb: false,
        showTag: true,
      },
    },
  ],
}
export default routes
