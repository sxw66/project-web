<template>
  <!-- 看板拖拽组件 -->
  <div class="board-draggable">
    <el-card class="box-card" shadow="always">
      <!-- 看板头部菜单 -->
      <template #header>
        <div class="flex-justify-between">
          <span>{{ title }}</span>
          <DropdownMenu :items="draggableMenuList" @command="handleCommand">
            <template #dropdownTrigger>
              <svg-icon name="more" />
            </template>
          </DropdownMenu>
        </div>
      </template>
      <!-- 看板拖拽 -->
      <el-scrollbar max-height="600px">
        <div class="group">
          <!-- :clone="cloneYellow" -->
          <draggable
            itemKey="id"
            :list="state.draggableData"
            ghost-class="ghost"
            handle=".move"
            filter=".forbid"
            :force-fallback="true"
            chosen-class="chosenClass"
            class="drag-content"
            animation="300"
            @change="handleDrag(state.groupA.name, $event)"
            @start="onStart"
            @end="onEnd"
            :group="state.groupA"
            :fallback-class="true"
            :fallback-on-body="true"
            :touch-start-threshold="50"
            :fallback-tolerance="50"
            :move="onMove"
            :sort="true"
          >
            <template #item="{ element }">
              <el-card class="move">
                <template #header>
                  <div class="card-box-header">
                    <svg-icon name="kb-affair" color="rgb(48, 209, 252)" right="8px" />
                    <span class="draggable-text">{{ element.kanbanName }}</span>
                    <DropdownMenu
                      :items="draggabMoreList"
                      dropdownType="menuIcon"
                      @command="handleCommand"
                    >
                      <template #dropdownTrigger>
                        <svg-icon name="more" color="#ccc" left="6px" />
                      </template>
                    </DropdownMenu>
                  </div>
                </template>
                <div class="card-desc" @click="handleCard(element)">嘎腰子</div>
                <DropdownMenu
                  :items="draggableListState"
                  dropdownType="menuSearch"
                  @command="handleCommand"
                  @handeSetting="handeSetting"
                >
                  <template #dropdownTrigger>
                    <el-tag effect="dark" round :type="kanbanState.type">
                      {{ kanbanState.label }}
                    </el-tag>
                  </template>
                </DropdownMenu>
              </el-card>
            </template>
          </draggable>
        </div>
        <!-- 新建工作项 -->
        <el-card class="add-card" v-if="addKanbanVisb">
          <el-input
            v-model="addKanban.itemDesc"
            :autosize="{ minRows: 3, maxRows: 5 }"
            type="textarea"
          />
          <div class="add-content flex-justify-between">
            <DropdownMenu
              :items="KanbanRightListA"
              :label="addKanban.DropdownLabel"
              @command="handleAddCommand"
              text
            ></DropdownMenu>
            <ClientPrincipal v-model="addKanban.FocusList" :multiple="false" />
          </div>
          <div class="add-content">
            <el-button type="primary" @click="handeNewConfirm"> 确定 </el-button>
            <el-button @click="addKanbanVisb = false">取消</el-button>
          </div>
        </el-card>
      </el-scrollbar>
      <el-button type="primary" text :icon="Plus" style="margin: 10px 0" @click="handeNewWorkItem"
        >新建工作项</el-button
      >
    </el-card>
    <!-- 看板设置-弹框组件 -->
    <boardDrawer :showDrawer="showDrawerVisb" />
    <!-- 看板详情-弹框组件 -->
    <boardDetailsDialog
      :boardDetailsVisible="dialogDetailsVisible"
      @closeBoardDetailsDialog="closeBoardDetailsDialog"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, watchEffect, computed } from 'vue'
  import draggable from 'vuedraggable'
  import { Edit, Plus, Search, Setting } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    draggableMenuList,
    draggableListState,
    draggabMoreList,
    KanbanRightListA,
  } from '@/utils/public-data'
  import { useProjectStore } from '@/store/modules/project'
  import { addWorkitemList } from '@/api/modules/project'

  // 加载公共下拉组件
  import DropdownMenu from '@/components/DropdownMenu/index.vue'
  // 加载人员选择器组件
  import ClientPrincipal from '@/components/principal/index.vue'
  // 加载看板设置-弹框组件
  import boardDrawer from './list-pop-up/kanban-settings/board.drawer.vue'
  // 加载看板详情-弹框组件
  import boardDetailsDialog from './list-pop-up/Kanban-details/board.details.dialog.vue'

  const props = defineProps({
    title: {
      type: String,
      required: false,
    },
    // 当前拖拽组件的状态
    draggableState: {
      type: String,
    },
    draggableList: {
      type: Array,
      default: () => [],
    },
  })

  const ProjectStore = useProjectStore()
  const addKanbanVisb = ref(false) // 新建看板是否展示
  const showDrawerVisb = ref(false) // 看板设置弹框是否展示
  const dialogDetailsVisible = ref(false) // 看板基础信息表详情弹框

  // 看板的状态
  const kanbanState = reactive({
    label: '已完成',
    type: 'success',
  })

  // 新增看板的数据
  const addKanban = reactive({
    itemDesc: '',
    FocusList: [''], // 人员选择器的值
    DropdownLabel: '用户故事', // 新建看板标题
    itemType: 2, // 工作项类型 0:史诗 1:特性 2:用户故事 3:任务 4:缺陷 5:事务
    draggableState: props.draggableState, // 是哪个类别的看板新增
  })

  const state = reactive({
    groupA: {
      name: 'taskboard',
      put: true, //允许拖入
      //   pull: () => {
      //     let res = state.draggableData.length > 2
      //     //当A组元素小于等于3个时，不允许再拖出元素了
      //     state.message = res ? '只能拖出1个' : '不能再拖了'
      //     return res
      //   },
    },
    draggableData: [],
  })
  // 当 clone 选项为true时, 在源组件上调用函数来克隆元素。唯一的参数是要克隆的viewModel元素, 返回值是它的克隆版本。
  const cloneYellow = (e) => {
    console.log('开始clone', e)
    return e
  }

  // 新建工作项
  const handeNewWorkItem = () => {
    addKanbanVisb.value = true
  }

  // 新建工作项选择事务
  const handleAddCommand = (command: any) => {
    addKanban.DropdownLabel = command.label
    addKanban.itemType = command.type
  }

  // 确定新建工作项
  const handeNewConfirm = async () => {
    addKanbanVisb.value = false
    console.log('addKanban', addKanban)
    const { code, data } = await addWorkitemList(addKanban)
    if (code === 200 && data) {
      addKanban.itemDesc = ''
      ElMessage.success('工作项新建成功')
    }
  }

  const handleDrag = (groupName, event) => {
    const addedItem = event.added
    const fromGroup = event.from
    if (fromGroup !== groupName && addedItem) {
      console.log('拖动的数据:', addedItem)
      console.log('目标分组:', groupName)
      console.log('来源分组:', fromGroup)
      console.log('哪个组件拖拽', props.draggableState)
    }
  }

  //拖拽开始的事件
  const onStart = () => {
    console.log('开始拖拽')
  }

  //拖拽结束的事件
  const onEnd = () => {
    console.log('结束拖拽')
  }

  // 如果不为null的话, 那此函数的调用方式与 Sortable onMove callback 类似。
  // 返回false将取消拖动操作。
  const onMove = (e) => {
    //不允许停靠
    // if (e.relatedContext.element.disabledPark == true) return false
    // return true
  }
  // 打开看板详情
  const handleCard = (element) => {
    console.log('=你点击了卡片', element)
    dialogDetailsVisible.value = true
  }
  // 关闭看板详情
  const closeBoardDetailsDialog = () => {
    dialogDetailsVisible.value = false
  }

  // 拖拽看板中菜单切换
  const handleCommand = (command: any) => {
    console.log('======', command)
    if (command.label) {
      kanbanState.label = command.label
      kanbanState.type = command.type
    }
  }
  // 拖拽看板中设置点击
  const handeSetting = () => {
    showDrawerVisb.value = !showDrawerVisb.value
  }

  watchEffect(() => {
    if (props.draggableList.length) {
      state.draggableData = props.draggableList
      console.log('初始化', props.draggableList)
    }
  })

  onMounted(() => {})
</script>
<style scoped>
  .ghost {
    border: solid 1px rgb(19, 41, 239) !important;
  }
  .chosenClass {
    opacity: 1;
    border: solid 1px red;
  }
</style>
<style lang="scss" scoped>
  .board-draggable {
    display: flex;
    .box-card {
      width: 400px;
      margin-right: 12px;
      box-sizing: border-box;
      .group {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-content: center;
        width: 100%;
        margin-right: 20px;
        box-sizing: border-box;
        // height: 655px;
        // overflow-y: auto;
        .drag-content {
          height: 100%; //建议是外层嵌套一层div，div固定高，此处再设为100%
          .el-card {
            // user-select: none;
            cursor: pointer;
            margin: 10px 0;
            box-sizing: border-box;
            .card-box-header {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              .draggable-text {
                font-size: 14px;
                color: #aaa;
              }
            }
            .el-card__body {
              .card-desc {
                margin-bottom: 8px;
              }
            }
          }
        }
      }
    }
    .add-card {
      .add-content {
        margin-top: 10px;
      }
    }
  }
</style>
