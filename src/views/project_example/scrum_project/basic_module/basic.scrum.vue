<template>
  <div class="flex basic-box">
    <!--项目管理- 基线 -->
    <div class="left">
      <SideMenuList
        SideMenuTitle="基线"
        :SideMenuList="collapseList"
        @handeSideChange="handeSideChange"
        @handeSelectMenu="handeSelectMenu"
      />
    </div>
    <div class="right">
      <PropTable
        :loading="loading"
        @handeFormChange="handeFormChange"
        @cell-click="handeCellClick"
        @cell-dblclick="handeCellDblClick"
        @current-page="handleCurrentChange"
        @size-change="handleSizeChange"
        @addNew="handleAdd"
        :data="tableData"
        :tableTitle="selectedName"
        :columns="columnList"
      >
        <!-- 表头筛选 -->
        <template v-slot:filtrate>
          <TableHeaderSearch :amount="tableData.length" />
        </template>
        <!-- 头部菜单 -->
        <template v-slot:Tablemenu>
          <TableHeaderMenu />
        </template>
        <template v-slot:planKind="{ row }">
          <el-tag type="info" round effect="plain">
            {{ row.planKind ? '产品排期' : '测试计划' }}
          </el-tag>
        </template>
        <template v-slot:principalName="{ row }">
          <el-avatar :size="35" style="background-color: rgb(154, 126, 244)">
            {{ row.principalName }}
          </el-avatar>
        </template>
      </PropTable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, watch, defineAsyncComponent } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getSchedulePages, delSchedulePages, getKindTreeList } from '@/api/modules/product'
  import { useProjectStore } from '@/store/modules/project'
  import { Edit, Plus, Delete, ArrowRight } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import SideMenuList from '@/components/SideMenuList/index.vue'

  // 异步加载表头筛选组件
  const TableHeaderSearch = defineAsyncComponent(
    () => import('../../../table/ComprehensiveTable/components/table-header-search.vue'),
  )

  // 异步加载表格标题筛选组件
  const TableHeaderMenu = defineAsyncComponent(
    () => import('../../../table/ComprehensiveTable/components/table-header-menu.vue'),
  )

  const ProjectStore = useProjectStore()
  const route = useRoute()
  const Router = useRouter()
  const loading = ref(true)
  const selectedName: any = ref('全部基线')
  const total = ref() // 表格的总数量
  const tableRows = ref() // 表格的行数据
  const collapseList = ref([
    {
      id: '123725422326975733760',
      moduleName: '工作项基线',
      moduleType: 0,
      moduleKind: 1,
      bindId: '1719683804822151168',
      moduleSuperiorId: '1723982078651572224',
      creater: null,
      createTime: 1700207714000,
      subList: null,
      contenteditable: false,
    },
    {
      id: '1725425453234799280128',
      moduleName: '规划基线',
      moduleType: 0,
      moduleKind: 1,
      bindId: '1719683804822151168',
      moduleSuperiorId: '1723982078651572224',
      creater: null,
      createTime: 1700207931000,
      subList: null,
      contenteditable: false,
    },
  ])
  const dialogAddVisible = ref(false) // 新建计划弹框

  // 表格列表的参数
  const tableParams: any = reactive({
    pageNum: 1,
    pageSize: 10,
    planKind: 0,
    kindValue: ProjectStore.projectId,
    moduleId: '',
  })
  // 表格列的key
  const columnList = ref([
    {
      name: 'planName',
      label: '基线名称',
      sortable: true,
      inSearch: true,
      valueType: 'input',
      inputModel: '我是默认值',
      width: 280,
      align: 'left',
    },
    {
      name: 'productCode',
      label: '阶段',
      sortable: true,
      hideHeaderMenu: true,
    },
    {
      name: 'fromType',
      label: '进度',
      sortable: true,
    },
    {
      name: '负责人',
      label: '类别',
      hideHeaderMenu: true,
    },
    {
      name: 'createTime',
      label: '开始时间',
      hideHeaderMenu: true,
    },
    {
      name: 'endTime',
      label: '基线时间',
      hideHeaderMenu: true,
    },
  ])
  const tableData = ref([])
  // Nav列表子孙菜单
  const chilrenMoreMenu = computed(() => {
    return [
      {
        command: 'sideEdit',
        divided: false,
        label: '编辑',
        icon: Edit,
      },
      {
        command: 'sideDel',
        divided: false,
        label: `删除`,
        icon: Delete,
      },
    ]
  })
  // 新建计划
  const handleAdd = () => {
    tableRows.value = null
    dialogAddVisible.value = true
  }
  // 关闭新建
  const handeCloseDialogVisible = (childrenState) => {
    // 根据子组件传递的状态来判断是否新增或者编辑成功
    if (childrenState) {
      handeGetList()
    }
    dialogAddVisible.value = false
  }

  // 类别新建、删除、编辑成功回显页面
  const handeSideChange = (items: any, successDeleteState) => {
    // handeGetList()
    selectedName.value = items.moduleName
    handeTreeList(items)
    // 删除成功后回显页面
    if (successDeleteState) {
      selectedName.value = '全部基线'
      tableParams.moduleId = ''
    }
  }
  // 菜单激活回调
  const handeSelectMenu = (items: any, index) => {
    if (items && index != 'all') {
      selectedName.value = items.moduleName
      tableParams.moduleId = items.id
    } else {
      selectedName.value = '全部基线'
      tableParams.moduleId = ''
    }
    console.log('菜单激活回调', items)
  }

  // Nav列表根据绑定Id及类别获取组件树
  const handeTreeList = async (data: any) => {
    const parms = {
      bindId: ProjectStore.projectId,
      moduleKind: data?.moduleKind || 1,
    }
    const result = await getKindTreeList(parms)
    if (result.code === 200 && result.data) {
      // 暂时注释
      // collapseList.value = result.data.map((obj) => ({
      //   ...obj,
      //   contenteditable: false,
      //   subList:
      //     obj.subList !== null
      //       ? obj.subList.map((subObj) => ({
      //           ...subObj,
      //           contenteditable: false,
      //         }))
      //       : null,
      // }))
      // console.log('collapseList', collapseList.value)
    }
  }

  // 表格头部搜索框
  const handeFormChange = (items: any) => {
    tableParams.productName = items.productName
    handeGetList()
  }

  // 表格列表-当某个单元格被点击时会触发该事件
  const handeCellClick = (row, column) => {
    // 克隆表格行数据
    tableRows.value = row
    console.log(111, row, column)
  }

  // 表格列表-当某个单元格被双击击时会触发该事件
  const handeCellDblClick = (row, column) => {
    console.log('row', row)
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
      const { code, data } = await getSchedulePages(tableParams)
      if (code === 200) {
        data?.records?.map((item) => {
          if (item.startTime !== null && item.endTime !== null) {
            item.startTime = new Date(item.startTime)?.toLocaleString()
            item.endTime = new Date(item.endTime)?.toLocaleString()
          }
        })
        tableData.value = data?.records
        total.value = data?.total
        loading.value = false
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  // 监听 selectedName 的变化并重新调用接口
  watch(
    () => selectedName.value,
    () => {
      handeGetList()
    },
  )
  onMounted(() => {
    handeGetList()
    // 默认获取树列表
    handeTreeList()
  })
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
  }

  .basic-box {
    height: 100%;

    .left {
      min-width: 270px;
      background-color: #fbfbfb;
      box-sizing: border-box;
      max-width: 270px;
      :deep(.el-menu-item.is-active) {
        background: rgba(102, 152, 255, 0.1);
      }
    }

    .right {
      width: 100%;
      background: #fff;
      .table-planname {
        justify-content: space-between;
        display: flex;
        align-items: center;
      }
      .el-tooltip__trigger {
        outline: none;
        margin-top: 1.5px;
      }
    }
  }
</style>
