<template>
  <div class="app-container">
    <!-- 需求 -->
    <div class="flex schedule-box">
      <div class="left">
        <!-- Nav列表父菜单 -->
        <nav-list :steps="scheduleSteps" @selected="handeSelected" titleIconAlgin="between">
          <template v-slot:titleRight>
            <el-dropdown @command="handleCommand" trigger="click">
              <svg-icon name="plus" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(item, index) in creatMenu"
                    :key="index"
                    :command="item.command"
                    :icon="item.icon"
                    >{{ item.label }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </nav-list>
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
          <!-- Nav列表子孙菜单 rightMore-->
          <div v-for="(items, index) in collapseList" :key="index">
            <el-input
              v-if="items.contenteditable"
              v-model="items.moduleName"
              @change="handeInputMedit(items)"
              placeholder="Please input"
            />
            <el-collapse-item :name="items.id" v-else>
              <nav-list
                :steps="items.subList"
                @selected="handeSelected"
                @handeInputModel="handeInputModel"
              >
                <template v-slot:rightMore>
                  <el-tooltip placement="top">
                    <template #content> 更多</template>
                    <el-dropdown @command="handleCommand" trigger="click">
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
                </template>
              </nav-list>
              <!-- Nav列表子菜单 -->
              <template #title>
                <span class="collapse-title">{{ items.moduleName }}</span>
                <el-tooltip placement="top">
                  <template #content> 更多</template>
                  <el-dropdown @command="handleCommand" trigger="click">
                    <svg-icon name="more" @click="handeMoreSideClick(items)" />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          v-for="(item, index) in sideMoreMenu"
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
              </template>
            </el-collapse-item>
          </div>
          <el-input
            v-show="showInputType !== 0"
            v-model="addInput"
            :placeholder="showInputType === 1 ? '请输入类别名称' : '输入分组名称'"
            maxlength="30"
            @change="handeAddNavList"
            @blur="handeBlurInput"
          />
        </el-collapse>
      </div>
      <div class="right">
        <PropTable
          @selection-change="selectionChange"
          @handeFormChange="handeFormChange"
          @cell-click="handeCellClick"
          @current-page="handleCurrentChange"
          @size-change="handleSizeChange"
          @addNew="handleCreateDemand"
          :data="tableData"
          :tableTitle="selectedName"
          :columns="columnList"
          :multipleSelection="multipleSelection"
        >
          <!-- 表头筛选 -->
          <template v-slot:filtrate>
            <el-popover :visible="popoverShow" trigger="click" :popper-style="customPoperStyle">
              <template #reference>
                <el-button text type="primary" @click="handleClickFilter">
                  <svg-icon size="15" name="filter"></svg-icon>
                  <span style="margin-left: 5px">筛选</span>
                </el-button>
              </template>
              <FilterFormSimple @handleFilterChange="handleFilterChange"></FilterFormSimple>
            </el-popover>
            <span>{{ tableData.length }}条需求</span>
          </template>
          <!-- 头部菜单 -->
          <template v-slot:Tablemenu>
            <TableHeaderMenu :multipleIds="multipleSelection" @changeMore="handleChangeMore" />
          </template>
          <!-- 状态 -->
          <template #demandStatus="{ row }">
            <div
              v-if="row.statusEditable"
              @click="handleClickDemandStatus(row)"
              class="status"
              :style="{ background: statusColorList[row.demandStatus] }"
            >
              {{ statusList[row.demandStatus] }}
            </div>
            <div v-else>
              <el-select
                ref="RefDemandSelect"
                style="width: 100%"
                :automatic-dropdown="true"
                v-model="row.demandStatus"
                @click="handleClickDemandSelect(row)"
                @visible-change="handeDemandVisibleChange(row, $event)"
              >
                <el-option
                  style="margin: 4px 0; height: 40px"
                  v-for="item in selectStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  @click="hanldeClickDemandOption(row)"
                >
                  <span class="select-status" :style="{ background: item.bgc, color: '#fff' }">
                    {{ item.label }}
                  </span>
                </el-option>
              </el-select>
            </div>
          </template>
          <!-- 进度 -->
          <template #deSchedule="{ row }">
            <el-progress
              v-if="row.deSchedule != null"
              :stroke-width="8"
              :percentage="row.deSchedule"
            >
            </el-progress>
          </template>
          <!-- 标题 -->
          <template #demandTitle="{ row }">
            <div>
              <svg-icon
                style="margin-right: 6px"
                color="rgb(249, 138, 124)"
                size="16"
                name="demandTitle"
              >
              </svg-icon>
              <span>{{ row.demandTitle }}</span>
            </div>
          </template>
          <template #principal="{ row }">
            <div>
              <principal
                text="未设置"
                :multiple="false"
                :showTeam="false"
                v-model="row.principal"
              />
            </div>
          </template>
          <!-- 优先级 -->
          <template #priority="{ row }">
            <div
              v-if="row.priorityEditable"
              class="priority"
              :style="{ background: priorityColorList[row.priority] }"
              @click="hanldeClickPrioity(row)"
            >
              {{ prioityList[row.priority] }}
            </div>
            <div v-else>
              <el-select
                style="width: 100%"
                ref="RefPrioitySelect"
                :automatic-dropdown="true"
                v-model="row.priority"
                @click="handleClickPrioitySelect(row)"
                @visible-change="handlePrioityVisibleChange(row, $event)"
              >
                <el-option
                  v-for="item in selectPriorityList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  @click="handleClickPrioityOption(row)"
                >
                  <div class="select-prioity" :style="{ background: item.bgc }">
                    {{ item.label }}
                  </div>
                </el-option>
              </el-select>
            </div>
          </template>
        </PropTable>
      </div>
      <div>
        <DemandForm
          ref="RefDemandForm"
          v-model:visible="createDialog"
          v-model="formInfo"
          @comfirm="handleComfirmAdd"
        >
        </DemandForm>
      </div>
      <div>
        <UpdateDemandDialog
          :TypeList="collapseList"
          :ListFormData="tableRows"
          :dialogListVisible="dialogListVisible"
          @closeDialogList="closeDialogList"
        >
        </UpdateDemandDialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, watch, nextTick, defineAsyncComponent } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import {
    getDemandList,
    addDemandList,
    addProductModuleList,
    getKindTreeList,
    delKindTreeList,
    updateKindTreeList,
    deleteDemandList,
    updateDemandList,
  } from '@/api/modules/product'
  import { useProductStore } from '@/store/modules/product'
  import { Edit, InfoFilled, Plus, Delete, ArrowRight } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    statusColorList,
    statusList,
    selectStatusList,
    priorityColorList,
    prioityList,
    selectPriorityList,
    columnList,
    scheduleSteps,
    detailFields,
  } from './static.ts'
  const DemandForm = defineAsyncComponent(() => import('./add.demand.vue'))
  // 异步加载筛选组件
  const FilterFormSimple = defineAsyncComponent(
    () => import('@/components/FilterForm/filter.form.simple.vue'),
  )
  // 异步加载表头筛选组件
  const TableHeaderMenu = defineAsyncComponent(() => import('./demand.header.menu.vue'))
  const UpdateDemandDialog = defineAsyncComponent(() => import('./demand.list.dialog.vue'))
  const ProductStore = useProductStore()
  const route = useRoute()
  const Router = useRouter()
  const RefDemandSelect = ref()
  const RefPrioitySelect = ref()
  const dialogListVisible = ref(false)
  const selectedName: any = ref('全部需求')
  const createDialog = ref(false) // 显示新增弹窗
  const RefDemandForm = ref()
  const multipleSelection = ref([]) //table多选数据
  const tableRows = ref()
  //过滤弹窗样式
  const customPoperStyle = {
    width: '500px',
    height: '400px',
  }
  const popoverShow = ref(false)
  //新增的字段
  const formInfo: any = ref({
    demandTitle: '',
    deMark: '',
    productId: '',
    productModuleId: '',
    principal: '',
    fromType: '',
    demandType: '',
  })
  const total = ref() // 表格的总数量
  const addInput = ref('') // 新增分组的值
  const delGroupParms = ref() // 删除分组的参数
  const showInputType = ref(0) // 类别和分组的标志位
  const collapseList = ref([]) // Nav 数据列表
  const activeNames = ref('') // 当前展开的Collapse
  // 表格列表的参数
  const tableParams: any = reactive({
    pageNum: 1,
    pageSize: 10,
    // planKind: 0,
    // kindValue: ProductStore.productId,
    // moduleId: '',
  })
  // 表格列的key
  const tableData = ref([])
  // Nav列表父菜单
  const creatMenu = computed(() => {
    return [
      {
        command: 'newsGroup',
        label: `新建分组`,
        icon: ArrowRight,
      },
    ]
  })
  // Nav列表子菜单
  const sideMoreMenu = computed(() => {
    return [
      {
        command: 'newsType',
        label: '新建类别',
        icon: Plus,
      },
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

  // 	Collapse Events 当前激活面板改变时触发
  const handleChange = (val: string[]) => {
    console.log(val)
    // 每次面板改变时关闭input 编辑输入框
    if (delGroupParms.value) {
      delGroupParms.value.contenteditable = false
    }
  }
  //回显选中过滤样式
  const handleClickFilter = () => {
    popoverShow.value = true
  }
  // 取消过滤
  const handleFilterChange = (flag, datas) => {
    popoverShow.value = flag
    console.log('过滤后的数据', datas)
  }
  // 多选
  const selectionChange = (val) => {
    multipleSelection.value = val
  }
  // Nav列表-左侧标签-点击事件父子共用
  const handeMoreSideClick = (items) => {
    event.stopPropagation()
    delGroupParms.value = items
  }
  // Nav列表-侧边菜单列表选择的数据
  const handeSelected = (items: any) => {
    console.log('侧边菜单列表选择的数据', items)
    selectedName.value = items.name
    delGroupParms.value = items
    tableParams.moduleId = items.id
  }
  // Nav列表-侧边【子】菜单列表-编辑-input输入框
  const handeInputMedit = async (items: any) => {
    console.log('items', items)
    const { code, data } = await updateKindTreeList(items)
    if (code === 200 && data) {
      ElMessage({
        showClose: true,
        message: '修改成功',
        type: 'success',
      })
      items.contenteditable = false
    }
  }
  // Nav列表-侧边【子孙】菜单列表-编辑-input输入框
  const handeInputModel = async (items: any) => {
    items.moduleName = items.name
    selectedName.value = items.moduleName
    const { code, data } = await updateKindTreeList(items)
    if (code === 200 && data) {
      ElMessage({
        showClose: true,
        message: '修改成功',
        type: 'success',
      })
    }
  }

  // Nav列表-新增输入框-失焦事件
  const handeBlurInput = () => {
    showInputType.value = 0
  }

  // Nav列表-新建-分组-类别
  const handeAddNavList = async (val: any) => {
    let addParms = {
      moduleName: val,
      moduleType: 0,
      moduleKind: 0,
      bindId: ProductStore.productId,
      moduleSuperiorId: '0',
    }
    // 1类别、
    if (showInputType.value === 1) {
      addParms.moduleSuperiorId = delGroupParms.value.id
      const { code, data } = await addProductModuleList(addParms)
      if (code === 200 && data) {
        console.log('1类别、', data)
        // 根据绑定Id获取类别树
        handeTreeList(data)
      }
    }
    // 2分组、
    if (showInputType.value === 2) {
      addParms.moduleType = 1
      const { code, data } = await addProductModuleList(addParms)
      if (code === 200 && data) {
        // 根据绑定Id获取分组树
        handeTreeList(data)
      }
    }
    showInputType.value = 0
    addInput.value = ''
  }

  // 根据绑定Id及类别获取组件树
  const handeTreeList = async (data?: any) => {
    const params = {
      bindId: ProductStore.productId,
      moduleKind: data?.moduleKind || 0,
    }
    const result = await getKindTreeList(params)
    if (result.code === 200 && result.data) {
      collapseList.value = result.data.map((obj) => ({
        ...obj,
        contenteditable: false,
        subList:
          obj.subList !== null
            ? obj.subList.map((subObj) => ({
                ...subObj,
                name: subObj.moduleName,
                icon: 'all',
              }))
            : null,
      }))
    }
  }

  /* 
   el-dropdown 公用点击事件
   每个类型下做不同的操作
  */
  const handleCommand = (command: string | number | object) => {
    console.log('======', command)
    // 新建类别
    if (command === 'newsType') {
      showInputType.value = 1
      activeNames.value = delGroupParms.value.id
    }
    // 新建分组
    if (command === 'newsGroup') {
      showInputType.value = 2
    }
    // 编辑分组
    if (command === 'sideEdit') {
      delGroupParms.value.contenteditable = true
      console.log('编辑分组', delGroupParms.value)
    }
    // 删除分组
    if (command === 'sideDel') {
      console.log('调用删除分组接口', delGroupParms.value)
      ElMessageBox.confirm(
        `${delGroupParms.value.moduleType ? '确认删除分组吗?' : '确认删除类别吗?'}`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
          draggable: true,
        },
      ).then(async () => {
        // 根据ID删除产品模块详情表
        let treeId = delGroupParms.value.id
        const result = await delKindTreeList(treeId)
        if (result.code === 200 && result.data) {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          await handeTreeList()
          selectedName.value = '全部计划'
        }
      })
    }
  }
  // 表格头部搜索框
  const handeFormChange = (items: any) => {
    tableParams.planName = items.planName
    handeGetDemandList()
  }
  // 当某个单元格被点击时会触发该事件
  const handeCellClick = (row, column) => {
    tableRows.value = row
    if (detailFields.includes(column.label)) {
      dialogListVisible.value = true
    }
  }
  // current-page 改变时触发
  const handleCurrentChange = (val: any) => {
    tableParams.pageNum = val
    handeGetDemandList()
  }
  // page-size 改变时触发
  const handleSizeChange = (val: number) => {
    tableParams.pageNum = 1
    tableParams.pageSize = val
    handeGetDemandList()
  }
  //触发新增需求
  const handleCreateDemand = () => {
    formInfo.value = {
      productId: ProductStore.productId,
    }
    createDialog.value = true
  }
  //确认新增需求
  const handleComfirmAdd = () => {
    try {
      RefDemandForm.value.validate(async () => {
        const { code }: any = await addDemandList(formInfo.value)
        handeGetDemandList()
        createDialog.value = false
      })
    } catch (error) {
      console.log(error, 'Error')
    }
  }
  //表格点击状态选择
  const handleClickDemandStatus = (row) => {
    row.statusEditable = !row.statusEditable
    nextTick(() => {
      RefDemandSelect.value.focus()
    })
  }
  const handleClickDemandSelect = (row) => {
    row.statusEditable = !row.statusEditable
  }
  const hanldeClickDemandOption = (row) => {
    row.statusEditable = !row.statusEditable
  }
  const handeDemandVisibleChange = (row, status) => {
    if (!status) {
      row.statusEditable = true
    }
  }
  //表格点击优先级选择
  const hanldeClickPrioity = (row) => {
    row.priorityEditable = !row.priorityEditable
    nextTick(() => {
      RefPrioitySelect.value.focus()
    })
  }
  const handleClickPrioitySelect = (row) => {
    row.priorityEditable = !row.priorityEditable
  }
  const handleClickPrioityOption = (row) => {
    row.priorityEditable = !row.priorityEditable
  }
  const handlePrioityVisibleChange = (row, status) => {
    if (!status) {
      row.priorityEditable = true
    }
  }
  const handleUpdateDemanList = async () => {
    try {
      let params = {}
      const { code, data }: any = await updateDemandList(params)
      if (code === 200) {
        console.log(data, 'data')
      }
    } catch (error) {
      console.log(error, 'Error')
    }
  }
  // 关闭列表弹框
  const closeDialogList = (ListState) => {
    if (ListState) {
      handeGetDemandList()
    }
    dialogListVisible.value = false
  }
  //删除需求列表
  const handleDeleteDemandList = async (id) => {
    try {
      await deleteDemandList({ id })
      await handeGetDemandList()
    } catch (error) {
      console.log(error, 'Error')
    }
  }
  //操作更多
  const handleChangeMore = async (data) => {
    // let ids = multipleSelection.value.map((item) => item.id)
    let obj = multipleSelection.value.pop()
    // console.log('%c [ id ]-601', 'font-size:13px; background:pink; color:#bf2c9f;', id)
    const { code } = data
    switch (code) {
      case 'delete':
        handleDeleteDemandList(obj.id)
        break
    }
  }
  // 获取需求信息列表
  const handeGetDemandList = async () => {
    try {
      const { code, data } = await getDemandList(tableParams)
      if (code === 200) {
        // console.log(data, 'data')
        data?.records?.forEach((item) => {
          item.createTime = new Date(item.createTime)?.toLocaleString()
          item.actualTime = new Date(item.actualTime)?.toLocaleString()
          item.planTime = new Date(item.planTime)?.toLocaleString()
          item.statusEditable = true
          item.priorityEditable = true
          item.principal = [item.principal]
        })
        tableData.value = data?.records
        total.value = data?.total
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  // 监听 selectedName 的变化并重新调用接口
  watch(
    () => selectedName.value,
    () => {
      handeGetDemandList()
    },
  )
  onMounted(() => {
    handeGetDemandList()
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
      border-right: 1px solid #eee;
      overflow-y: auto;
      max-width: 270px;
      .el-tooltip__trigger {
        outline: none;
      }
      .el-collapse {
        margin: 5px 12px;
        .el-collapse-item {
          :deep(.collapse-title) {
            width: 80%;
            display: flex;
          }
          :deep(.el-collapse-item__header) {
            background: #fbfbfb;
          }
          :deep(.el-collapse-item__wrap) {
            background: #fbfbfb;
          }
          :deep(.el-collapse-item__content) {
            background: #fbfbfb;
            padding-bottom: 0px;
          }
        }
      }
    }

    .right {
      width: 100%;
      background: #fff;
      overflow: scroll;
      .table-planname {
        padding-right: 320px;
      }
      .el-tooltip__trigger {
        outline: none;
        margin-top: 1.5px;
      }
    }
  }
  .status {
    width: 70px;
    height: 27px;
    padding: 0 4px;
    display: grid;
    place-items: center;
    border-radius: 27px;
    font-size: 12px;
    color: #fff;
  }
  .select-status {
    display: inline-block;
    text-align: center;
    width: 70px;
    height: 27px;
    line-height: 27px;
    padding: 0 4px;
    box-sizing: border-box;
    border-radius: 27px;
    font-size: 12px;
  }
  .priority {
    width: 40px;
    height: 23px;
    padding: 0 4px;
    display: grid;
    place-items: center;
    border-radius: 23px;
    font-size: 12px;
    color: #fff;
  }
  .select-prioity {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 23px;
    padding: 0 4px;
    box-sizing: border-box;
    border-radius: 23px;
    font-size: 12px;
    color: #fff;
  }
</style>
