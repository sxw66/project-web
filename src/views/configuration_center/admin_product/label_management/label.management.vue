<template>
  <!-- 配置中心-产品-标签管理 -->
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
      <!-- 列表内容 -->
      <template v-slot:labelName="{ row }">
        <div class="tb-head-product">
          <svg-icon name="product" :color="row.labelColor" style="margin-right: 8px" />
          <span>{{ row.labelName }}</span>
        </div>
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
    <!-- 新建标签 -->
    <addLabelManagement
      :labelAddVisible="dialogAddVisible"
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
  import { queryItemLabelist, delItemLabelist } from '@/api/modules/project.ts'
  import { useProductStore } from '@/store/modules/product'
  // 新建标签弹框
  import addLabelManagement from './add.label.management.vue'

  const ProductStore = useProductStore()
  const Router = useRouter()

  const selectedName: any = ref('项目管理')
  const dialogAddVisible = ref(false) // 是否打开新建标签
  const TableRows = ref() // 是否打开新建标签
  const loading = ref(true)
  const total = ref()
  const tableParams: any = reactive({
    pageNum: 1,
    pageSize: 10,
    orderColumn: '',
    order: '',
    labelName: '',
    labelColor: '',
    creater: '',
    createName: '',
    isDel: 0,
  })
  const steps = ref([
    {
      title: '通用',
      name: '项目管理',
    },
    {
      name: '项目集管理',
    },
    {
      name: '标签管理',
    },
    {
      title: '流程',
      name: 'Scrum 项目',
    },
    {
      name: 'Kanban 项目',
    },
    {
      name: '瀑布项目',
    },
    {
      title: '配置',
      name: '工作项配置',
    },
    {
      name: '项目配置',
    },
    {
      name: '发布配置',
    },
    {
      title: '权限',
      name: '权限配置',
    },
  ])
  const tableData = ref([])
  const columnList = ref([
    {
      name: 'labelName',
      label: '标签名',
      sortable: true,
      slot: true,
      align: 'left',
      inSearch: true,
      valueType: 'input',
      width: 300,
      hideHeaderMenu: true,
    },
    {
      name: 'creater',
      label: '创建人',
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
    tableParams.labelName = items.labelName
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
      const { code, data } = await queryItemLabelist(tableParams)
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
