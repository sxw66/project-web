<template>
  <div class="project-board">
    <div class="project-board_header flex-justify-between">
      <div class="board_left">
        <DropdownMenu
          :label="DropdownLabel"
          @command="handleCommand"
          :items="dropdownList.KanbanList"
          text
        />
      </div>
      <div class="board_right flex-align-center">
        <DropdownMenu
          type="primary"
          icon="Plus"
          label="新建"
          :items="KanbanRightListA"
          sideDivider
          @command="handleCommand"
        />
        <DropdownMenu :items="KanbanIconListB" @command="handleCommand">
          <template #dropdownTrigger>
            <svg-icon name="all" />
          </template>
        </DropdownMenu>
      </div>
    </div>
    <div class="project-board_center flex-align-center">
      <boardHeaderInput />
      <!-- 筛选、设置 -->
      <boardHeaderFiltrate :amount="total" />
    </div>
    <div class="project-board_draggable">
      <boardDraggable title="需求" draggableState="0" :draggableList="dragList" />
      <boardDraggable title="设计" draggableState="1" :draggableList="xuqiuA" />
      <boardDraggable title="研发" draggableState="2" :draggableList="[]" />
      <boardDraggable title="测试" draggableState="3" :draggableList="[]" />
    </div>

    <!-- 新建工作项、弹框 -->
    <addWorkItem :workItemVisible="workItemVisible" @closeWorkItem="handeCloseWorkItem" />
    <!-- 新建看板、弹框 -->
    <addBoard :boardAddVisible="dialogAddVisible" @closeBoard="handeCloseBoard" />
    <!-- 看板管理、弹框 -->
    <kanbanSystem
      :systemVisible="dialogSystemVisible"
      :kanBanList="dragList"
      @closeSystem="handeCloseSystem"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, markRaw, watchEffect } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useProjectStore } from '@/store/modules/project'
  import { productKanBanPage, deleteProductKanBan } from '@/api/modules/project.ts'
  import { Edit, Delete, Setting, Plus, Aim } from '@element-plus/icons-vue'
  import { KanbanRightListA, KanbanIconListB } from '@/utils/public-data'

  // 公共下拉组件
  import DropdownMenu from '@/components/DropdownMenu/index.vue'
  // 看板头部输入框组件
  import boardHeaderInput from './board.header.input.vue'
  // 看板头部筛选、设置、组件
  import boardHeaderFiltrate from './board.header.filtrate.vue'
  // 新建看板弹框
  import addBoard from './add.board.vue'
  // 新建工作项
  import addWorkItem from './add.work.item.vue'
  // 看板管理弹框
  import kanbanSystem from './kanban.system.vue'
  // 看板拖拽、组件
  import boardDraggable from './board.draggable.vue'

  const route = useRoute()
  const Router = useRouter()
  const ProjectStore = useProjectStore()
  const DropdownLabel = ref('默认看板') // 看板标题
  const workItemVisible = ref(false) // 是否打开新建工作项
  const dialogAddVisible = ref(false) // 是否打开新建看板
  const dialogSystemVisible = ref(false) // 是否打开看板管理

  const dragList = ref([])
  const xuqiuA = ref([])

  // 下拉列表数据
  const dropdownList = markRaw({
    KanbanList: [],
  })

  const tableParams: any = reactive({
    pageNum: 1,
    pageSize: 10,
    orderColumn: '',
    order: '',
    id: ProjectStore.projectId,
    kanbanName: '',
    workTypes: '',
    cardColumns: '',
    delUser: '',
    kanbanModelNum: 0,
  })

  const total = ref(0)

  // 看板菜单切换
  const handleCommand = (selectedItem) => {
    console.log('当前选择的下拉菜单', selectedItem)
    // 打开新建看板
    if (selectedItem.command === 'New-signage') {
      dialogAddVisible.value = true
    }
    // 打开看板管理
    if (selectedItem.command === 'Kanban-system') {
      dialogSystemVisible.value = true
    }
    // 打开新建工作项-故事-缺陷-任务看板
    // eslint-disable-next-line no-constant-condition
    if (
      selectedItem.command === 'User-stories' ||
      selectedItem.command === 'User-tak' ||
      selectedItem.command === 'User-flaw'
    ) {
      workItemVisible.value = true
    }
    // 根据看板id 切换列表数据
    if (selectedItem.id) {
      let kanbanMenuSuccess = ProjectStore.projectGather.kanbanModelNum
      ProjectStore.projectGather.kanbanModelNum = kanbanMenuSuccess + 1
      // 存储看板当前选中的菜单数据
      ProjectStore.projectGather.kanbanMenuActive = selectedItem
    } else {
      ProjectStore.projectGather.kanbanMenuActive = {}
    }
    DropdownLabel.value = selectedItem.label
  }

  // 关闭工作项目弹框
  const handeCloseWorkItem = (childrenState) => {
    // 根据子组件传递的状态来判断是否新增或者编辑成功
    if (childrenState) {
      getKanBanPage()
    }
    workItemVisible.value = false
  }
  // 关闭新建看板弹框
  const handeCloseBoard = (childrenState) => {
    // 根据子组件传递的状态来判断是否新增或者编辑成功
    if (childrenState) {
      getKanBanPage()
    }
    dialogAddVisible.value = false
  }
  // 关闭看板管理弹框
  const handeCloseSystem = (childrenState) => {
    // 根据子组件传递的状态来判断是否新增或者编辑成功
    if (childrenState) {
      getKanBanPage()
    }
    dialogSystemVisible.value = false
  }

  // 获取列表数据-分页查询看板基础信息表
  const getKanBanPage = async () => {
    dropdownList.KanbanList = []
    await productKanBanPage(tableParams).then((res) => {
      if (res.code === 200) {
        let starArr = res.data?.records.map((item) => ({
          command: item.id,
          id: item.id,
          label: item.kanbanName,
          workTypes: item.workTypes,
        }))
        dragList.value = res.data?.records
        total.value = res.data.total
        dropdownList.KanbanList = dropdownList.KanbanList.concat(
          starArr,
          {
            command: 'Default-kanban',
            label: '默认看板',
            disabled: false,
            icon: Aim,
          },
          {
            command: 'New-signage',
            divided: true,
            label: '新建看板',
            disabled: false,
            icon: Plus,
          },
          {
            command: 'Kanban-system',
            divided: true,
            label: '看板管理',
            icon: Setting,
          },
        )
      }
    })
  }
  // 监听对象中的属性，并在属性发生变化时执行相应的操作。
  watchEffect(() => {
    tableParams.kanbanName = ProjectStore.projectGather.kanbanInputModel || DropdownLabel.value
    tableParams.kanbanModelNum = ProjectStore.projectGather.kanbanModelNum
    console.log('重置看板列表页接口', ProjectStore.projectGather)
    getKanBanPage()
  })

  onMounted(() => {
    // getKanBanPage()
  })
</script>

<style lang="scss" scoped>
  .project-board {
    background: #fff;
    position: relative;
    box-sizing: border-box;
    padding: 0 20px;
    height: 100%;
    &_header {
      border-bottom: 1px solid #eee;
      height: 48px;
      .board_left {
      }
      .board_right {
        // background-color: red;
      }
    }
    &_center {
      height: 48px;
      border-bottom: 1px solid #eee;
    }
    &_draggable {
      display: flex;
      height: calc(100% - 111px);
      margin-top: 15px;
      overflow: auto;
    }
  }
</style>
