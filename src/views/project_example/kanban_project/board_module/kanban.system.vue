<template>
  <!-- 看板管理 -->
  <el-dialog
    v-model="props.systemVisible"
    v-if="props.systemVisible"
    title="看板管理"
    :before-close="handleCancel"
    class="kanban-system"
  >
    <div class="kanban-header flex-justify-between">
      <span class="system_text">管理项目中的看板</span>
      <el-button type="primary" @click="handeNewSignage">新建看板</el-button>
    </div>
    <div class="system-table">
      <PropTable ref="myTableRef" :columns="columnList" :data="tableData" :isShowHeader="false">
        <template v-slot:workTypes="{ row }">
          <el-tag v-if="row.workTypes">
            {{ workTypeTag(row.workTypes) }}
          </el-tag>
        </template>
        <template v-slot:operation="scope">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="handleKanbanSettings(scope.row)"
          >
            看板设置
          </el-button>
          <el-button type="danger" size="small" icon="Delete" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </PropTable>
    </div>
    <!-- 
      看板管理不需要底部弹框暂时注释
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitForm"> 确定 </el-button>
      </span>
    </template> -->
  </el-dialog>
  <!-- 新建看板、弹框 -->
  <addBoard :boardAddVisible="dialogAddVisible" @closeBoard="handeCloseBoard" />
  <!-- 看板设置、弹框 -->
  <boardHeaderSetting
    :dialogBoardVisible="dialogSettingVisible"
    :kanbanRowData="kanbanSettingRows"
    @closeBoardVisible="closeBoardVisible"
  />
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, watch, watchEffect } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useProjectStore } from '@/store/modules/project'
  import { productKanBanPage, deleteProductKanBan } from '@/api/modules/project.ts'
  // 新建看板弹框
  import addBoard from './add.board.vue'
  // 看板设置
  import boardHeaderSetting from './board.header.setting.vue'

  const ProjectStore = useProjectStore()

  // 接收父组件传递的参数
  const props = defineProps({
    systemVisible: Boolean,
    kanBanId: String,
    kanBanList: Array,
  })

  //分发事件给父组件
  let emits = defineEmits(['closeSystem'])

  const columnList = ref([
    {
      name: 'kanbanName',
      label: '看板名称',
      sortable: true,
      hideHeaderMenu: true,
    },
    {
      name: 'workTypes',
      label: '工作项类型',
      slot: true,
      hideHeaderMenu: true,
    },
    {
      name: 'operation',
      slot: true,
      hideHeaderMenu: true,
      fixed: 'right',
      width: 200,
      label: '操作',
    },
  ])
  const dialogAddVisible = ref(false) // 是否打开新建看板
  const dialogSettingVisible = ref(false) // 是否打开看板设置
  const kanbanSettingRows = ref() // 看板设置行数据
  const tableData = ref([]) // 看板列表数据
  // 计算工作项类型
  const workTypeTag = (status) => {
    const typeMap = {
      '0': '史诗',
      '1': '特性',
      '2': '用户故事',
      '3': '任务',
      '4': '缺陷',
      '5': '事务',
    }
    if (!status) {
      return ''
    }
    const workTypes = status.split(',')
    const result = []
    for (const workType of workTypes) {
      if (typeMap.hasOwnProperty(workType)) {
        result.push(typeMap[workType])
      }
    }
    return result.join(' /  ')
  }

  //  新建看板
  const handeNewSignage = async () => {
    dialogAddVisible.value = true
  }

  // 关闭子组件新建看板弹框
  const handeCloseBoard = (childrenState) => {
    // 根据子组件传递的状态来判断是否新增或者编辑成功
    if (childrenState) {
      let AddSuccessNum = ProjectStore.projectGather.kanbanModelNum
      ProjectStore.projectGather.kanbanModelNum = AddSuccessNum + 1
    }
    dialogAddVisible.value = false
  }

  //  关闭子组件看板设置弹框
  const closeBoardVisible = async () => {
    dialogSettingVisible.value = false
  }

  //  看板设置
  const handleKanbanSettings = async (rows) => {
    dialogSettingVisible.value = true
    kanbanSettingRows.value = rows
  }

  // 删除看板
  const handleDelete = (row) => {
    console.log('row', row)
    const message = `确认删除看板 <span class="custom-highlight">${row.kanbanName}</span> 吗?`
    const additionalMessage = `<p> 看板删除后不可恢复，看板上的工作项将被移出。</p>`
    ElMessageBox.confirm(`${message}<br>${additionalMessage}`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
      dangerouslyUseHTMLString: true,
      customClass: 'messageStyle',
    }).then(async () => {
      const result = await deleteProductKanBan(row.id)
      if (result.code === 200 && result.data) {
        ElMessage.success(`看板删除成功`)
        let DeleteSuccessNum = ProjectStore.projectGather.kanbanModelNum
        ProjectStore.projectGather.kanbanModelNum = DeleteSuccessNum + 1
      }
    })
  }

  // 关闭-取消
  const handleCancel = () => {
    emits('closeSystem', '')
  }

  // 默认获取父组件传递的树列表-和表格数据-依赖项变化的时候，重新执行改函数。
  watchEffect(() => {
    if (props.kanBanList.length) {
      tableData.value = props.kanBanList
    }
  })
</script>

<style lang="scss">
  .messageStyle {
    .custom-highlight {
      color: #ff7575;
      background-color: #ff757526;
      padding: 0 10px;
      border-radius: 3px;
    }
  }
</style>
<style lang="scss" scoped>
  .kanban-system {
    .kanban-header {
      .system_text {
        color: #aaa;
      }
    }
    .system-table {
      display: flex;
      margin-top: 10px;
    }
  }
</style>
