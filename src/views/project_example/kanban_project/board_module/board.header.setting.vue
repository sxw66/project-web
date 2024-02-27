<template>
  <!-- 看板设置 -->
  <div class="setting-dialog-box">
    <el-dialog
      width="70%"
      style="height: 700px"
      v-model="props.dialogBoardVisible"
      align-center
      v-if="props.dialogBoardVisible"
      :before-close="handleCancel"
    >
      <div class="setting-wraper">
        <nav class="menu-wraper">
          <div class="setting-menu-title">看板设置</div>
          <div class="setting-menu">
            <nav-list :steps="steps" :selectedIndex="0" @selected="handleSelected"></nav-list>
          </div>
        </nav>
        <section class="section" :class="{ fullscreen: !showFooter }">
          <div class="setting-section-title">{{ sectionTitle }}</div>
          <div class="setting-section-container">
            <Component ref="RefComponent" :is="pageList[page]" :kanbanRowData="rowData">
            </Component>
          </div>
        </section>
      </div>
      <template #footer>
        <span v-show="showFooter" class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="submitForm"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    shallowRef,
    nextTick,
    onMounted,
    computed,
    watchEffect,
    defineAsyncComponent,
    watch,
  } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useProjectStore } from '@/store/modules/project'
  // 表格列表-等级-行业
  import { WorkItemType, industryOptions } from '@/utils/public-data'
  const BasicSetting = defineAsyncComponent(() => import('./components/basic.setting.vue'))
  const ColumnSettings = defineAsyncComponent(() => import('./components/column.settings.vue'))
  const Lane = defineAsyncComponent(() => import('./components/lane.vue'))
  const Trigger = defineAsyncComponent(() => import('./components/trigger.vue'))
  const Card = defineAsyncComponent(() => import('./components/card.vue'))
  const RefComponent = ref()
  const page = ref('0')
  const pageList = shallowRef([BasicSetting, ColumnSettings, Lane, Trigger, Card])
  const Store = useProjectStore()

  // 接收父组件传递的参数
  const props = defineProps({
    dialogBoardVisible: Boolean,
    kanbanRowData: Object,
  })

  //分发事件给父组件
  let emits = defineEmits(['closeBoardVisible'])

  const steps = ref([
    {
      name: '基础设置',
      code: '0',
      showFooter: true,
    },
    {
      name: '栏设置',
      code: '1',
      showFooter: true,
    },
    {
      name: '泳道',
      code: '2',
      showFooter: false,
    },
    {
      name: '触发器',
      code: '3',
      showFooter: false,
    },
    {
      name: '卡片',
      code: '4',
      showFooter: true,
    },
  ])
  const sectionTitle = ref('基础设置')
  const showFooter = ref(true)
  const rowData: any = ref({})

  const handleSelected = (selected) => {
    page.value = selected.code
    sectionTitle.value = selected.name
    showFooter.value = selected.showFooter
  }
  // 关闭-取消
  const handleCancel = () => {
    showFooter.value = true
    page.value = '0'
    emits('closeBoardVisible', '')
  }
  // 确定
  const submitForm = () => {
    nextTick(() => {
      const { name } = RefComponent.value.$options
      switch (name) {
        case 'basic':
          //修改看板基础设置
          RefComponent.value.handleUpdateKanbanBasicSettingList()
          break
        case 'column':
          //修改看板栏设置
          RefComponent.value.handleUpdateColumnSettingList()
          break
      }
    })
  }
  // 监听属性值变化获取行数据
  watchEffect(() => {
    if (props.dialogBoardVisible) {
      console.log('----------获取行数据', props.kanbanRowData)
      let len =
        typeof props.kanbanRowData != 'undefined' && Object.keys(props.kanbanRowData)?.length
      if (len > 0) {
        rowData.value = props.kanbanRowData
      } else {
        rowData.value = Store.projectGather.kanbanMenuActive
        rowData.value.kanbanName = Store.projectGather?.kanbanMenuActive?.label
      }
    }
  })
</script>

<style lang="scss" scoped>
  .setting-dialog-box {
    // width: 100%;
    .setting-wraper {
      display: flex;
      width: 100%;
      height: 100%;
      .menu-wraper {
        width: 259px;
        height: 100%;
        padding: 4px;
        padding-top: 0;
        border-right: 1px solid #eee;
        box-sizing: border-box;
        background-color: #fbfbfb;
        .setting-menu-title {
          display: flex;
          align-items: center;
          width: 100%;
          height: 56px;
          font-size: 16px;
          color: #333;
          padding-left: 19px;
          box-sizing: border-box;
          // margin-bottom: 10px;
        }
        .setting-menu {
          // border: 1px solid;
          font-size: 14px;
          margin-top: 10px;
        }
      }
      .section {
        display: flex;
        flex-direction: column;
        width: calc(100% - 259px);
        height: 634px;
        box-sizing: border-box;
        padding-top: 0;
        .setting-section-title {
          display: flex;
          align-items: center;
          height: 56px;
          font-size: 14px;
          color: #333;
          padding: 0px 32px 0px;
        }
        .setting-section-container {
          flex: 1;
          width: 100%;
          height: 100%;
          margin-top: 10px;
          // border: 1px solid;
          padding: 6px 32px 8px;
          box-sizing: border-box;
          overflow-y: scroll;
          overflow-x: hidden;
        }
      }
      .fullscreen {
        height: 697px;
      }
    }
  }
  .prefix-icon {
    border-style: dashed;
    color: #cacaca;
    border-color: #cacaca;
    border-width: 1px;
    border-radius: 50%;
    line-height: 1;
  }
  :deep(.el-dialog) {
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      height: 100%;
      padding: 0px;
    }
    .el-dialog__footer {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
</style>
