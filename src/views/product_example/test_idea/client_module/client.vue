<template>
  <div class="app-container">
    <!-- 客户 -->
    <div class="flex client-box">
      <div class="left">
        <!-- Nav列表父菜单 -->
        <el-tabs v-model="tabsActiveName" class="client-tabs">
          <el-tab-pane label="客户" name="1">
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
          </el-tab-pane>
          <el-tab-pane label="用户" name="2">
            <nav-list :steps="scheduleSteps" :selectedIndex="0" @selected="handeSelected" />
          </el-tab-pane>
        </el-tabs>
        <el-dropdown @command="handleCommand" class="d-dropdown-icon">
          <svg-icon name="plus" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="newsGroup" :icon="ArrowRight">新建分组</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="right">
        <PropTable
          ref="clientTable"
          @addNew="handleNewCustomerClick"
          @handeFormChange="handeFormChange"
          @cell-click="handeCellClick"
          @cell-dblclick="handeCellDbClick"
          @current-page="handleCurrentChange"
          @size-change="handleSizeChange"
          @selection-change="handeSelectionChange"
          :data="tableData"
          :tableTitle="selectedName"
          :columns="columnList"
          :multipleSelection="multipleSelection"
        >
          <!-- <template v-slot:headerRight>
            <el-dropdown split-button type="primary" @click="handleNewCustomerClick">
              新建客户
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>添加外部用户</el-dropdown-item>
                  <el-dropdown-item>添加内部用户</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template> -->
          <!-- 表头筛选 -->
          <template v-slot:filtrate>
            <ClientHeaderScreen
              :amount="tableData.length"
              @handleFilterChange="handleFilterChange"
            />
          </template>
          <!-- 头部菜单 -->
          <template v-slot:Tablemenu>
            <ClientHeaderMenu
              :TypeList="collapseList"
              :multipleIds="multipleSelection"
              @handeDeleteSuccess="handeDeleteSuccess"
              @handeCategorySettingSuccess="handeCategorySettingSuccess"
            />
          </template>
          <template v-slot:customerName="{ row }">
            <div class="flex-justify-between">
              {{ row.customerName }}
              <el-tooltip placement="top">
                <template #content> 更多</template>
                <el-dropdown @command="handleTableCommand" trigger="click">
                  <svg-icon name="more" />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="(item, index) in tableMoreMenu"
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
          <template v-slot:level="{ row, column }">
            <el-select
              v-model="row.level"
              v-if="tableRowEditId === row.id && tableColumnEditIndex == column.id"
              @keyup.enter="
                ($event) => {
                  $event.target.blur()
                }
              "
              @blur="onInputTableBlur(row)"
            >
              <el-option
                v-for="item in operationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <el-tag :key="item.label" :color="item.color" effect="light" round>
                  {{ item.label }}
                </el-tag>
              </el-option>
            </el-select>
            <el-tag effect="light" round v-else> {{ row.level }}</el-tag>
          </template>
          <template v-slot:scale="{ row, column }">
            <el-input-number
              v-if="tableRowEditId === row.id && tableColumnEditIndex == column.id"
              v-model="row.scale"
              controls-position="right"
              @keyup.enter="
                ($event) => {
                  $event.target.blur()
                }
              "
              @blur="onInputTableBlur(row)"
            />
            <span v-else> {{ row.scale }}</span>
          </template>
          <template v-slot:industry="{ row, column }">
            <el-select
              v-model="row.industry"
              v-if="tableRowEditId === row.id && tableColumnEditIndex == column.id"
              @keyup.enter="
                ($event) => {
                  $event.target.blur()
                }
              "
              @blur="onInputTableBlur(row)"
            >
              <el-option
                v-for="item in industryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-tag effect="light" v-else> {{ getIndustryLabel(row.industry) }}</el-tag>
          </template>
          <template v-slot:moduleName="{ row }">
            <el-tag effect="plain" round type="info">
              <span class="flex-align-center">
                <svg-icon name="all" style="margin-right: 5px" />
                {{ row.moduleName }}
              </span>
            </el-tag>
          </template>
          <template v-slot:principalName="{ row }">
            <!-- {{ row.principalName }} -->
            <ClientPrincipal v-model="focusList" />
          </template>
          <template v-slot:orderEndNum="{ row }">
            <el-tooltip placement="top">
              <template #content>
                已完成：{{ row.orderEndNum }}<br />总数：{{ row.orderTotalNum }}
              </template>
              <el-progress :percentage="row.orderTotalNum" :format="format" />
            </el-tooltip>
          </template>
        </PropTable>
      </div>
      <!-- 新建客户弹框 -->
      <addClient
        :TypeList="collapseList"
        :EditFormData="tableRows"
        :dialogFormVisible="dialogAddVisible"
        @closeDialogVisible="handeCloseDialogVisible"
      />
      <!-- 列表弹框 -->
      <ClientListDialog
        :TypeList="collapseList"
        :ListFormData="tableRows"
        @closeDialogList="closeDialogList"
        :dialogListVisible="dialogListVisible"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, defineAsyncComponent, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import {
    getCustomerPages,
    delCustomerPages,
    updateCustomerPages,
    addProductModuleList,
    getKindTreeList,
    delKindTreeList,
    updateKindTreeList,
  } from '@/api/modules/product'
  import { useProductStore } from '@/store/modules/product'
  import { Edit, Plus, Delete, ArrowRight } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  // 表格列表-等级-行业
  import { operationOptions, industryOptions } from '@/utils/public-data'
  // 异步新建客户弹框组件
  const addClient = defineAsyncComponent(() => import('./add.client.vue'))
  // 异步加载客户表头菜单组件
  const ClientHeaderMenu = defineAsyncComponent(() => import('./client.header.menu.vue'))
  // 异步加载客户表头筛选组件
  const ClientHeaderScreen = defineAsyncComponent(() => import('./client.header.screen.vue'))
  // 异步加载表格列表弹框组件
  const ClientListDialog = defineAsyncComponent(() => import('./client.list.dialog.vue'))
  // 异步加载表格列表人员选择器组件
  const ClientPrincipal = defineAsyncComponent(() => import('@/components/principal/index.vue'))

  const ProductStore = useProductStore()
  const route = useRoute()
  const Router = useRouter()
  const selectedName: any = ref('全部客户')
  const total = ref() // 表格的总数量
  const tableRows = ref() // 表格的行数据
  const addInput = ref('') // 新增分组的值
  const delGroupParms = ref() // 删除分组的参数
  const showInputType = ref(0) // 类别和分组的标志位
  const collapseList = ref([]) // Nav 数据列表
  const activeNames = ref('') // 当前展开的Collapse
  const tabsActiveName = ref('1') // 当前打开的tabs
  const dialogAddVisible = ref(false) // 新建计划弹框
  const dialogListVisible = ref(false) // 表格列表弹框
  const multipleSelection = ref([]) // 表格数据-多选
  const tableRowEditId = ref(null) // 表格数据-控制可编辑的每一行
  const tableColumnEditIndex = ref(null) // 表格数据-控制可编辑的每一列
  const clientTable = ref(null) // 表格的实例
  const focusList = ref(['1']) // 表格人员选择器的值

  // 指定进度条文字内容
  const format = (percentage) => (percentage === 100 ? 'Full' : `${percentage}%`)
  // 表格列表的参数
  const tableParams: any = reactive({
    pageNum: 1,
    pageSize: 10,
    customerName: '',
    industry: '',
    principal: '',
  })
  // 表格列的key
  const columnList = ref([
    {
      type: 'selection',
      width: 55,
      fixed: 'left',
    },
    {
      name: 'customerName',
      label: '客户名称',
      width: '500',
      align: 'left',
      sortable: true,
      slot: true,
      inSearch: true,
      valueType: 'input',
      hideHeaderMenu: true,
    },
    {
      name: 'level',
      label: '等级',
      sortable: true,
      slot: true,
    },
    {
      name: 'scale',
      label: '规模',
      slot: true,
      width: '180',
    },
    {
      name: 'industry',
      label: '行业',
      slot: true,
    },
    {
      name: 'moduleName',
      label: '类别',
      align: 'left',
      sortable: true,
      slot: true,
      hideHeaderMenu: true,
    },
    {
      name: 'orderEndNum',
      label: '工单数',
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
  ])
  const tableData = ref([])

  // NAV列表-用户
  const scheduleSteps = ref([
    {
      name: '全部用户',
      icon: 'all',
    },
    {
      icon: 'user',
      name: '外部用户',
    },
    {
      icon: 'user',
      name: '内部用户',
    },
    {
      icon: 'user',
      name: '未分组用户',
    },
  ])
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
  // 表格列表更多菜单
  const tableMoreMenu = computed(() => {
    return [
      {
        command: 'table-category',
        divided: false,
        label: '设置类别',
        icon: Edit,
      },
      {
        command: 'table-del',
        divided: false,
        label: `删除`,
        icon: Delete,
      },
    ]
  })

  // 关闭列表弹框
  const closeDialogList = (ListState) => {
    if (ListState) {
      handeGetList()
    }
    dialogListVisible.value = false
  }

  // 关闭新建
  const handeCloseDialogVisible = (childrenState) => {
    // 根据子组件传递的状态来判断是否新增或者编辑成功
    if (childrenState) {
      handeGetList()
    }
    dialogAddVisible.value = false
  }
  // 	Collapse Events 当前激活面板改变时触发
  const handleChange = (val: string[]) => {
    console.log(val)
    // 每次面板改变时关闭input 编辑输入框
    if (delGroupParms.value) {
      delGroupParms.value.contenteditable = false
    }
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
    tableParams.productId = items.id
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
      moduleKind: 2,
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

  // Nav列表根据绑定Id及类别获取组件树
  const handeTreeList = async (data: any) => {
    const parms = {
      bindId: ProductStore.productId,
      moduleKind: data?.moduleKind || 2,
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
                name: subObj.moduleName,
                icon: 'all',
              }))
            : null,
      }))
    }
  }

  /*
   Nav列表 - el-dropdown 公用点击事件
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
          selectedName.value = '全部客户'
        }
      })
    }
  }
  // 表格表头筛选
  const handleFilterChange = (parms, state) => {
    if (state) {
      tableParams.industry = parms.industry
      tableParams.principal = parms.principal
      handeGetList()
    }
  }
  // 表格列表多选
  const handeSelectionChange = (val: any) => {
    multipleSelection.value = val
  }
  // 表格列表多选删除
  const handeDeleteSuccess = (val) => {
    if (val) {
      handeGetList()
    }
  }
  // 客户类别设置成功
  const handeCategorySettingSuccess = (val) => {
    if (val) {
      clientTable.value.tableRef.clearSelection()
      handeTreeList()
      handeGetList()
    }
  }
  // 表格列表【更多-编辑】el-dropdown
  const handleTableCommand = async (command: string | number | object) => {
    // 表格删除
    if (command === 'table-del') {
      const result = await delCustomerPages(tableRows.value.id)
      if (result.code === 200 && result.data) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        handeGetList()
      }
    }
    // 表格设置类别
    if (command === 'table-category') {
      console.log('表格设置类别')
    }
  }

  // 新建客户
  const handleNewCustomerClick = (msg: any) => {
    dialogAddVisible.value = true
  }
  // 表格头部搜索框
  const handeFormChange = (items: any) => {
    tableParams.customerName = items.customerName
    handeGetList()
  }

  // 表格列表-当某个单元格被点击时会触发该事件
  const handeCellClick = (row, column) => {
    // 克隆表格行数据-删除的时候使用
    tableRows.value = row
    if (column.label === '类别') {
      dialogListVisible.value = true
    }
    // console.log(111, row, column)
    // 1.跳转到商城后台根据当前行字段
    // 2.跳转到商城首页根据当前行字段
    // 3.跳转到订单管理根据当前行字段
    // 4.跳转到账号管理根据当前行字段
  }
  // 表格列表-当某个单元格被双击击时会触发该事件
  const handeCellDbClick = (row, column) => {
    tableRowEditId.value = row.id //确定点击的单元格在哪行 如果数据中有ID可以用ID判断，没有可以使用其他值判断，只要能确定是哪一行即可
    tableColumnEditIndex.value = column.id //确定点击的单元格在哪列
  }
  // 表格列表-input取消焦点
  const onInputTableBlur = async (row) => {
    tableRowEditId.value = null
    tableColumnEditIndex.value = null
    const { code, data } = await updateCustomerPages(row)
    if (code === 200 && data) {
      ElMessage({
        type: 'success',
        message: '更新成功',
      })
    }
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
  // 获取列表数据-分页查询客户信息表
  const handeGetList = async () => {
    try {
      const { code, data } = await getCustomerPages(tableParams)
      if (code === 200) {
        tableData.value = data?.records
        total.value = data?.total
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  // 辅助函数：根据value查找对应的行业标签
  const getIndustryLabel = (val: any) => {
    const industry = industryOptions.value.find((item) => item.value === val)
    return industry ? industry.label : ''
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

  .client-box {
    height: 100%;

    .left {
      min-width: 270px;
      background-color: #fbfbfb;
      box-sizing: border-box;
      border-right: 1px solid #eee;
      overflow-y: auto;
      max-width: 270px;
      position: relative;
      .el-tooltip__trigger {
        outline: none;
      }
      .client-tabs {
        height: 48px;
        :deep(.el-tabs__header) {
          margin: 8px 15px 15px;
        }
      }
      .d-dropdown-icon {
        position: absolute;
        right: 10px;
        top: 20px;
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
      .el-tooltip__trigger {
        outline: none;
      }
      .el-tag--info {
        cursor: pointer;
      }
    }
  }
</style>
