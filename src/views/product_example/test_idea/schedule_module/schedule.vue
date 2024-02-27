<template>
  <div class="app-container">
    <!-- 排期 -->
    <div class="flex schedule-box">
      <div class="left">
        <SideMenuList
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
          <template v-slot:planName="{ row }">
            <div class="table-planname">
              {{ row.planName }}
              <el-tooltip placement="top">
                <template #content> 更多</template>
                <el-dropdown @command="handleTableCommand" trigger="click">
                  <svg-icon name="more" />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="(item, index) in chilrenMoreMenu"
                        :key="index"
                        :command="item.command"
                        :divided="item.divided"
                        :icon="item.icon"
                        >{{ item.label }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-tooltip>
            </div>
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
      <addSchedule
        :TypeList="collapseList"
        :EditFormData="tableRows"
        :dialogFormVisible="dialogAddVisible"
        @closeDialogVisible="handeCloseDialogVisible"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getSchedulePages, delSchedulePages, getKindTreeList } from '@/api/modules/product'
  import { useProductStore } from '@/store/modules/product'
  import { Edit, Plus, Delete, ArrowRight } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import SideMenuList from '@/components/SideMenuList/index.vue'
  import addSchedule from './add.schedule.vue'
  const ProductStore = useProductStore()
  const route = useRoute()
  const Router = useRouter()
  const loading = ref(true)
  const selectedName: any = ref('全部计划')
  const total = ref() // 表格的总数量
  const tableRows = ref() // 表格的行数据
  const collapseList = ref([]) // Nav 数据列表
  const dialogAddVisible = ref(false) // 新建计划弹框

  // 表格列表的参数
  const tableParams: any = reactive({
    pageNum: 1,
    pageSize: 10,
    planKind: 0,
    kindValue: ProductStore.productId,
    moduleId: '',
  })
  // 表格列的key
  const columnList = ref([
    {
      name: 'planName',
      label: '计划名称',
      width: '450',
      align: 'left',
      sortable: true,
      slot: true,
      hideHeaderMenu: true,
    },
    {
      name: 'planKind',
      label: '类别',
      align: 'left',
      sortable: true,
      slot: true,
      hideHeaderMenu: true,
    },
    {
      name: 'principalName',
      label: '负责人',
      align: 'left',
      sortable: true,
      slot: true,
      hideHeaderMenu: true,
    },
    {
      name: 'startTime',
      label: '计划开始',
      hideHeaderMenu: true,
    },
    {
      name: 'endTime',
      label: '计划结束',
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
      // location.reload()
      selectedName.value = '全部计划'
      tableParams.moduleId = ''
    }
  }
  // 菜单激活回调
  const handeSelectMenu = (items: any, index) => {
    if (items && index != 'all') {
      selectedName.value = items.moduleName
      tableParams.moduleId = items.id
    } else {
      selectedName.value = '全部计划'
      tableParams.moduleId = ''
    }
    console.log('菜单激活回调', items)
  }

  // Nav列表根据绑定Id及类别获取组件树
  const handeTreeList = async (data: any) => {
    const parms = {
      bindId: ProductStore.productId,
      moduleKind: data?.moduleKind || 1,
    }
    const result = await getKindTreeList(parms)
    if (result.code === 200 && result.data) {
      collapseList.value = result.data.map((obj) => ({
        ...obj,
        contenteditable: false,
        subList:
          obj.subList !== null
            ? obj.subList.map((subObj) => ({
                ...subObj,
                contenteditable: false,
              }))
            : null,
      }))
      console.log('collapseList', collapseList.value)
    }
  }

  // 表格列表【更多-编辑】el-dropdown
  const handleTableCommand = async (command: string | number | object) => {
    // 表格删除
    if (command === 'sideDel') {
      const result = await delSchedulePages(tableRows.value.id)
      if (result.code === 200 && result.data) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        handeGetList()
      }
    }
    // 表格编辑
    if (command === 'sideEdit') {
      dialogAddVisible.value = true
      console.log('表格编辑')
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
    Router.push({
      path: '/product/edit/schedule',
      query: {
        id: row.id,
        selectedName: selectedName.value,
        planName: row.planName,
      },
    })
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

  .schedule-box {
    height: 100%;

    .left {
      min-width: 270px;
      background-color: #fbfbfb;
      box-sizing: border-box;
      max-width: 270px;
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
