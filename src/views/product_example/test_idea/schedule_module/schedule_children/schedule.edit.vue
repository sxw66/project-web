<template>
  <div class="schedule-edit">
    <ScheduleEditHeader
      :fristBreadcrumbTitle="route.query?.selectedName"
      :scheduleBreadcrumbTitle="route.query?.planName"
    />
    <PropTable
      :loading="loading"
      @selection-change="selectionChange"
      @cell-click="handeCellClick"
      @current-page="handleCurrentChange"
      @size-change="handleSizeChange"
      :data="tableData"
      :columns="columnList"
      :isShowHeader="false"
      :multipleSelection="multipleSelection"
      default-expand-all
    >
      <!-- 表头筛选 -->
      <template v-slot:filtrate>
        <ScheduleEditScreen
          :amount="tableData.length"
          @handleFilterChange="handleFilterChange"
          @formLayout="handeTableLayout"
        />
      </template>
      <!-- 头部菜单 -->
      <template v-slot:Tablemenu>
        <ScheduleEditScreenTableHd :multipleIds="multipleSelection" />
      </template>
      <template v-slot:principalName="{ row }">
        <el-avatar :size="35" style="background-color: rgb(154, 126, 244)">
          {{ row.principalName }}
        </el-avatar>
      </template>
    </PropTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, watch, defineAsyncComponent } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useProductStore } from '@/store/modules/product'
  import { getProductPlanPages, getProductTreePlanPages } from '@/api/modules/product'
  // 异步加载面包屑组件
  const ScheduleEditHeader = defineAsyncComponent(() => import('./schedule.edit.header.vue'))
  // 异步加载筛选组件
  const ScheduleEditScreen = defineAsyncComponent(() => import('./schedule.edit.screen.vue'))
  // 异步加载表头筛选组件
  const ScheduleEditScreenTableHd = defineAsyncComponent(
    () => import('./schedule.edit.table.hd.vue'),
  )
  const ProductStore = useProductStore()
  const route = useRoute()
  const Router = useRouter()
  // 列表加载状态
  const loading = ref(true)
  // 表格表格的结构状态-树形-平铺
  const tableLayoutState = ref('树状')
  // 表格列表数据总数量
  const total = ref(null)
  // 表格列表的多选
  const multipleSelection = ref([])

  // 表格列表的参数
  const tableParams: any = reactive({
    pageNum: 1,
    pageSize: 10,
    planId: undefined,
    productId: ProductStore.productId,
  })
  // 表格列的key
  const columnList = ref([
    {
      type: 'selection',
      width: 60,
      fixed: 'left',
    },
    {
      name: 'demandTitle',
      label: '标题',
      align: 'left',
      inSearch: true,
      valueType: 'input',
      sortable: true,
    },
    {
      name: 'fraction',
      label: '分数',
      align: 'left',
      sortable: true,
    },
    {
      name: 'planTime',
      label: '计划时间',
      align: 'left',
      sortable: true,
      hideHeaderMenu: true,
    },
    {
      name: 'demandStatus',
      label: '状态',
    },
    {
      name: 'principal',
      label: '负责人',
    },
    {
      name: 'priority',
      label: '优先级',
    },
    {
      name: 'workLoad',
      label: '工作量',
    },
    {
      name: 'deValue',
      label: '价值',
    },
    // {
    //   name: 'deValue',
    //   label: '投票数',
    // },
  ])
  const tableData = ref([])

  // 表格表头筛选
  const handleFilterChange = (parms, state) => {
    if (state) {
      tableParams.industry = parms.industry
      tableParams.principal = parms.principal
      handeGetList()
    }
  }
  // 表格布局状态
  const handeTableLayout = (layout) => {
    tableLayoutState.value = layout
    handeGetList()
  }

  // 多选
  const selectionChange = (val) => {
    multipleSelection.value = val
  }

  // 当某个单元格被点击时会触发该事件
  const handeCellClick = async (row, column) => {
    console.log('当某个单元格被点击时会触发该事件', row)
  }

  // 表格列表-current-page 改变时触发
  const handleCurrentChange = (val: any) => {
    tableParams.pageNum = val
    handeGetList()
  }

  // 表格列表-page-size 改变时触发
  const handleSizeChange = (val: number) => {
    tableParams.pageNum = 1
    tableParams.pageSize = val
    handeGetList()
  }

  // 获取列表数据-分页查询产品基础信息表
  const handeGetList = async () => {
    try {
      let responseData
      if (tableLayoutState.value === '树状') {
        responseData = await getProductTreePlanPages(tableParams)
      } else {
        responseData = await getProductPlanPages(tableParams)
      }
      const { code, data } = responseData
      if (code === 200 && data) {
        if (tableLayoutState.value === '平铺') {
          data.forEach((item) => {
            if (item.planTime !== null) {
              item.planTime = new Date(item.planTime).toLocaleString()
            }
          })
          tableData.value = data
          total.value = data.total
        } else {
          const transformedData = Object.entries(data).map(([key, value], index) => ({
            id: index + 1,
            demandTitle: key,
            children: value,
          }))
          tableData.value = transformedData
        }
        loading.value = false
      }
    } catch (error) {
      console.error('Error:', error)
      loading.value = false
    }
  }

  onMounted(() => {
    if (route.query?.id) {
      tableParams.planId = route.query.id
      handeGetList()
    }
  })
</script>

<style scoped></style>
