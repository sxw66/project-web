<template>
  <!--配置中心-产品-工作项配置 -->
  <div class="label-management">
    <PropTable
      :loading="loading"
      @addNew="handleAdd"
      @handeFormChange="handeFormChange"
      @current-page="handleCurrentChange"
      @size-change="handleSizeChange"
      :tableTitle="selectedName"
      :columns="columnList"
      :data="tableData"
      :border="false"
    >
      <!-- 表头筛选 -->
      <template v-slot:filtrate>
        <!-- 项目总数量 -->
        <span class="filtrate-text">{{ tableData.length }}个标签</span>
      </template>
      <template v-slot:operation="scope">
        <el-button type="primary" size="small" icon="Edit" @click="handleEdits(scope.row)">
          编辑
        </el-button>
        <el-button type="danger" size="small" icon="Delete" @click="handleDelete(scope.row)">
          删除
        </el-button>
      </template>
    </PropTable>
    <!-- 新建工作项配置 -->
    <addWorkItem
      :workItemAddVisible="dialogAddVisible"
      :EditFormData="TableRows"
      @closeLabel="handeCloseLabel"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, defineAsyncComponent, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Edit, User, Plus, Delete, Operation } from '@element-plus/icons-vue'
  import { getWorkitemList, delItemLabelist } from '@/api/modules/project.ts'
  import { useProductStore } from '@/store/modules/product'
  // 新建工作项配置弹框
  import addWorkItem from './add.work.item.vue'

  const ProductStore = useProductStore()
  const Router = useRouter()

  const selectedName: any = ref('工作项配置')
  const dialogAddVisible = ref(false) // 是否打开新建工作项配置
  const TableRows = ref() // 是否打开新建工作项配置
  const loading = ref(true)
  const total = ref()
  const tableParams: any = reactive({
    pageNum: 1,
    pageSize: 10,
    orderColumn: '',
    order: '',
    id: '',
    itemName: '',
    itemCode: '',
    codeNum: 0,
    itemDesc: '',
    itemStatus: 0,
    projectId: '',
    projectName: '',
    itemType: 0,
    needType: 0,
    needFrom: 0,
    kanbanId: '',
    swimlaneId: '',
    priority: 0,
    riskLevel: 0,
    workLoad: 0,
    itemSchedule: 0,
    businessValue: 0,
    labels: '',
    taskType: 0,
    severityLevel: 0,
    occurPer: 0,
    defectType: 0,
    principal: '',
    principalName: '',
    creater: '',
    createName: '',
    updater: '',
    updateName: '',
    followUser: '',
    archiver: '',
    archiveName: '',
    isDel: 0,
    delUser: '',
  })
  const tableData = ref([])
  const columnList = ref([
    {
      name: 'itemName',
      label: '属性名称',
      sortable: true,
      align: 'left',
      inSearch: true,
      valueType: 'input',
      width: 300,
      hideHeaderMenu: true,
    },
    {
      name: 'creater',
      label: '属性类型',
      sortable: true,
      hideHeaderMenu: true,
    },
    {
      name: 'createTime',
      label: '时间',
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

  // 表格头部搜索框
  const handeFormChange = (items: any) => {
    tableParams.itemName = items.itemName
    handeGetList()
  }

  // 侧边菜单列表选择的数据
  const handeSelected = async (items: any) => {
    console.log('侧边菜单列表选择的数据', items)
    selectedName.value = items.name
  }

  // current-page 改变时触发
  const handleCurrentChange = (val: any) => {
    tableParams.pageNum = val
    handeGetList()
  }
  // page-size 改变时触发
  const handleSizeChange = (val: number) => {
    tableParams.pageNum = 1
    tableParams.pageSize = val
    handeGetList()
  }

  // 新建标签
  const handleAdd = () => {
    dialogAddVisible.value = true
  }

  // 编辑标签
  const handleEdits = async (row) => {
    TableRows.value = row
    dialogAddVisible.value = true
  }
  // 删除标签
  const handleDelete = async (row) => {
    const result = await delItemLabelist(row.id)
    if (result.code === 200 && result.data) {
      ElMessage.success(`标签删除成功`)
      handeGetList()
    }
  }

  // 关闭新建标签弹框
  const handeCloseLabel = (childrenState) => {
    // 根据子组件传递的状态来判断是否新增或者编辑成功
    if (childrenState) {
      handeGetList()
    }
    dialogAddVisible.value = false
  }

  // 获取列表数据-分页查询产品基础信息表
  const handeGetList = async () => {
    try {
      const { code, data } = await getWorkitemList(tableParams)
      if (code === 200) {
        data?.records?.map((item) => {
          item.createTime = new Date(item.createTime)?.toLocaleString()
        })
        tableData.value = data?.records
        total.value = data?.total
        loading.value = false
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  onMounted(() => {
    handeGetList()
  })
</script>

<style scoped></style>
