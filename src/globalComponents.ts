
/* 
  2023-10-24
  需要全局导入注册的组件
*/
import { App } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import NavList from '@/components/NavList/index.vue'
import HrmsEmpty from '@/components/Empty/index.vue'
import CommonTable from '@/components/Table/CommonTable/index.vue'
import PropTable from '@/components/Table/PropTable/index.vue'
import Principal from '@/components/principal/index.vue'
export function registerGlobalComponents(app: App): void {
  app.component('svg-icon', SvgIcon)
  app.component('nav-list', NavList)
  app.component('hrms-empty', HrmsEmpty)
  app.component('CommonTable', CommonTable)
  app.component('PropTable', PropTable)
  app.component('Principal', Principal)
}
