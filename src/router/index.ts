import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  createWebHashHistory,
  Router,
} from 'vue-router'
import Layout from '@/layout/index.vue'
// 扩展继承属性
interface extendRoute {
  hidden?: boolean
}
import tableRouter from './modules/table'
import errorRouter from './modules/error'
import nestedRouter from './modules/nested'
import externalLink from './modules/externalLink'
import formRouter from './modules/from'
import functionPageRouter from './modules/functionPage'
// 产品管理
import productManagement from './modules/product.management'
// 测试管理
import testManagement from './modules/test.management'
// 工时管理
import WorkingHoursManage from './modules/working.hours.manage'
// 项目管理
import projectManagement from './modules/project.management'

// 配置中心
import configurationCenter from './modules/configuration.center'
// // 异步组件
// export const asyncRoutes = [
//   // ...formRouter,
//   // ...functionPageRouter,
//   // ...nestedRouter,
//   // ...errorRouter,
//   // ...externalLink,
// ]
// 动态路由（异步路由、导航栏路由）
export const asyncRoutes = [
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
  {
    path: productManagement.path,
    children: [productManagement],
  },
  {
    path: projectManagement.path,
    children: [projectManagement],
  },
  {
    path: testManagement.path,
    children: [testManagement],
  },
  {
    path: WorkingHoursManage.path,
    children: [WorkingHoursManage],
  },
  {
    path: configurationCenter.path,
    children: [configurationCenter],
    hidden: true,
  },
  {
    path: tableRouter[0].path,
    children: tableRouter,
  },
  {
    path: functionPageRouter[0].path,
    children: functionPageRouter,
  },
]

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

export const constantRoutes: Array<RouteRecordRaw & extendRoute> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
    meta: { title: '登录' },
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/home',
    meta: { title: '工作台' },
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'home',
        meta: { title: '工作台', icon: 'House', affix: true, role: ['other'] },
      },
      {
        path: 'comprehensive/demo',
        component: () => import('@/views/table/ComprehensiveTable/demo.vue'),
        name: 'comprehensive1',
        meta: { title: '示例表格', keepAlive: true, icon: 'MenuIcon' }
      },
    ],
  },
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL), // history
  history: createWebHashHistory(), // hash
  routes: constantRoutes,
})

export default router
