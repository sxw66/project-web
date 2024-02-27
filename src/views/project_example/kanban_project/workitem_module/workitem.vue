<template>
  <div class="app-container">
    <div class="workitem-box">
      <div class="workitem-tabs-header">
        <el-tabs
          v-model="activeName"
          @tab-click="hanldeTabClickMore"
          @tab-change="handleTabChange"
          :before-leave="handleBeforeLeave"
        >
          <el-tab-pane
            v-for="item in tabList"
            :key="item.name"
            :label="item.label"
            :name="item.name"
          >
            <template #label>
              <div class="more-wraper" v-if="item.name == '4'">
                <span>{{ item.label }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <div v-else>
                <span>{{ item.label }}</span>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
        <div class="custom-dropdown">
          <el-dropdown
            ref="RefMoreDropdown"
            trigger="click"
            @command="handleMoreCommand"
            @visible-change="handleMoreVisibleChange"
          >
            <span></span>
            <template #dropdown>
              <el-dropdown-menu style="width: 220px">
                <el-dropdown-item
                  v-for="item in tabMoreList"
                  style="position: relative"
                  :key="item.label"
                  :icon="item.icon"
                  :command="item"
                  :divided="item.divided"
                >
                  <span>{{ item.label }}</span>
                  <el-checkbox
                    style="margin-left: 20px; position: absolute; top: 1px; right: 20px"
                    v-model="item.checked"
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="workitem-right-content">
          <el-dropdown trigger="click" @command="handleAddCommand">
            <el-button type="primary" :icon="Plus" class="add">
              新建<el-icon style="margin-left: 6px"><CaretBottom /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  style="width: 160px; margin: 2px 0; padding: 10px 16px"
                  v-for="item in addSelectList"
                  :key="item.label"
                  :command="item"
                >
                  {{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-divider style="height: 20px" direction="vertical" />
          <el-icon size="24"><Operation /></el-icon>
        </div>
      </div>
      <div class="table-box">
        <PropTable
          :data="tableData"
          :isShowHeader="false"
          :columns="columnList"
          :multipleSelection="multipleSelection"
          @selection-change="selectionChange"
          @current-page="handleCurrentPage"
          @size-change="handleSizeChange"
          @cell-click="handeCellClick"
          @handeSearchChange="handeSearchChange"
        >
          <!-- filter -->
          <template #filtrate>
            <div>
              <span>{{ tableData?.length }}条工作项</span>
            </div>
          </template>
          <!-- 头部菜单 -->
          <template #Tablemenu>
            <TableHeaderMenu :multipleIds="multipleSelection" @changeMore="handleChangeMore">
            </TableHeaderMenu>
          </template>
          <!-- 标题 -->
          <template #itemName="{ row }">
            <div>
              <svg-icon size="14" color="rgb(115, 216, 151)" name="finishWorkItem"></svg-icon>
              <span style="margin-left: 6px">{{ row.itemName }}</span>
            </div>
          </template>
          <!-- 状态 -->
          <template #itemStatus="{ row }">
            <div
              v-if="row.statusEditable"
              @click.stop="handleClickWorkitemStatus(row)"
              class="status"
              :style="{ background: statusColorList[row.itemStatus] }"
            >
              {{ statusList[row.itemStatus] }}
            </div>
            <div v-else>
              <el-select
                ref="RefStatusSelect"
                style="width: 100%"
                :automatic-dropdown="true"
                v-model="row.itemStatus"
                @click="handleClickWorkitemSelect(row)"
                @visible-change="handeWorkitemVisibleChange(row, $event)"
              >
                <el-option
                  style="margin: 4px 0; height: 40px"
                  v-for="item in selectStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  @click="hanldeClickStatusOption(row)"
                >
                  <span class="select-status" :style="{ background: item.bgc, color: '#fff' }">
                    {{ item.label }}
                  </span>
                </el-option>
              </el-select>
            </div>
          </template>
          <!-- 负责人 -->
          <template #principal="{ row }">
            <principal v-model="row.principal" :multiple="false" :showTeam="false" text="未设置" />
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
      <div v-show="createDialog">
        <AddWorkitemForm
          ref="RefAddWorkitemForm"
          v-model:visible="createDialog"
          v-model="formInfo"
          @confirm="handleComfirmAdd"
        >
        </AddWorkitemForm>
      </div>
      <div>
        <UpdateWorkitemDialog
          :TypeList="collapseList"
          :ListFormData="tableRows"
          :dialogListVisible="dialogListVisible"
          @closeDialogList="closeDialogList"
        >
        </UpdateWorkitemDialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, defineAsyncComponent, nextTick } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { Plus } from '@element-plus/icons-vue'
  import {
    columnList,
    addSelectList,
    detailFields,
    selectStatusList,
    statusColorList,
    statusList,
    prioityList,
    priorityColorList,
    selectPriorityList,
    moreList,
  } from './static'
  import { getWorkitemList, addWorkitemList, deleteWorkitemList } from '@/api/modules/project'
  import { useProjectStore } from '@/store/modules/project'
  const route = useRoute()
  const Router = useRouter()
  const Store = useProjectStore()
  const AddWorkitemForm = defineAsyncComponent(() => import('./add.workitem.vue'))
  const TableHeaderMenu = defineAsyncComponent(() => import('./workitem.header.menu.vue'))
  const UpdateWorkitemDialog = defineAsyncComponent(() => import('./workitem.list.dialog.vue'))
  const RefAddWorkitemForm = ref()
  const RefStatusSelect = ref()
  const RefPrioitySelect = ref()
  const RefMoreDropdown = ref()
  const multipleSelection = ref([])
  const dialogListVisible = ref(false)
  const collapseList = ref([])
  const tableRows = ref()
  const createDialog = ref(false)
  const formInfo = ref({})
  const activeName = ref('0')
  const tabMoreList = ref(moreList)
  const tableParams = ref({
    pageNum: 1,
    pageSize: 15,
  })
  const tableData = ref([])
  const tabList = [
    {
      label: '全部工作项',
      name: '0',
    },
    {
      label: '打开工作项',
      name: '1',
    },
    {
      label: '我负责的工作项',
      name: '2',
    },
    {
      label: '我创建的工作项',
      name: '3',
    },
    {
      label: '更多',
      name: '4',
    },
  ]
  //是否显示下拉
  const isDropdown = ref(false)
  //首次加载不触发下拉
  let firstLoad = ref(true)
  const handleBeforeLeave = (activedName) => {
    Store.handleSetWorkItemTabChecked(activedName)
    if (activedName == '4') {
      if (!firstLoad.value) {
        nextTick(() => {
          RefMoreDropdown.value.handleOpen()
        })
      } else {
        isDropdown.value = true
      }
    } else if (activedName != '4') {
      Store.handleSetWorkItemMoreChecked({})
      isDropdown.value = false
      nextTick(() => {
        RefMoreDropdown.value.handleClose()
      })
    }
  }
  const handleTabChange = (tab) => {
    firstLoad.value = false
    if (tab == '4') {
      nextTick(() => {
        RefMoreDropdown.value.handleOpen()
      })
    } else {
      Store.handleSetWorkItemMoreChecked({})
      tabMoreList.value.forEach((item) => {
        item.checked = false
      })
    }
  }
  const hanldeTabClickMore = () => {
    firstLoad.value = false
    if (activeName.value == '4' && isDropdown.value) {
      isDropdown.value = !isDropdown.value
      nextTick(() => {
        RefMoreDropdown.value.handleOpen()
      })
    } else if (activeName.value == '4' && !isDropdown.value) {
      isDropdown.value = !isDropdown.value
      nextTick(() => {
        RefMoreDropdown.value.handleClose()
      })
    }
  }
  //更多的下拉框显示隐藏触发
  const handleMoreVisibleChange = (isShow) => {
    if (!isShow) {
      isDropdown.value = true
    } else {
      isDropdown.value = false
    }
    if (isShow) {
      const cache = Store.workItemMoreChecked
      tabMoreList.value.forEach((item) => {
        if (item.value == cache.value) {
          item.checked = true
        }
      })
    }
  }
  const handleMoreCommand = (data) => {
    tabMoreList.value.forEach((item) => {
      item.checked = false
    })
    data.checked = true
    Store.handleSetWorkItemMoreChecked({ ...data })
  }
  // 表格头部搜索框
  const handeSearchChange = (msg: any) => {
    // tableParams.value.productName = msg
    handleGetWorkitemList()
  }
  // 多选
  const selectionChange = (val) => {
    multipleSelection.value = val
  }
  //操作更多
  const handleChangeMore = async (data) => {
    // let ids = multipleSelection.value.map((item) => item.id)
    let obj = multipleSelection.value.pop()
    const { code } = data
    switch (code) {
      case 'delete':
        await handleDeleteWorkitemList(obj.id)
        break
    }
  }
  // 当某个单元格被点击时会触发该事件
  const handeCellClick = (row, column) => {
    tableRows.value = row
    dialogListVisible.value = true
    // if (detailFields.includes(column.label)) {
    //   dialogListVisible.value = true
    // }
  }
  // 关闭列表弹框
  const closeDialogList = (ListState) => {
    if (ListState) {
      handleGetWorkitemList()
    }
    dialogListVisible.value = false
  }
  //删除工作项列表信息
  const handleDeleteWorkitemList = async (id) => {
    try {
      const { code }: any = await deleteWorkitemList({ id })
      if (code === 200) {
        handleGetWorkitemList()
        ElMessage({
          showClose: true,
          message: '删除成功',
          type: 'success',
        })
      }
    } catch (error) {
      console.log('Error', error)
    }
  }
  //新增工作项列表信息
  const handleAddCommand = (item) => {
    createDialog.value = true
    switch (item.label) {
      case '史诗':
        break

      case '特性':
        break

      case '用户故事':
        break
    }
  }
  const handleComfirmAdd = () => {
    try {
      console.log('新增')
      RefAddWorkitemForm.value.validate(() => {
        createDialog.value = false
        const params = {
          ...formInfo.value,
        }
        const { code }: any = addWorkitemList(params)
        if (code === 200) {
          handleGetWorkitemList()
          ElMessage({
            showClose: true,
            message: '新增成功',
            type: 'success',
          })
        }
      })
    } catch (error) {
      console.log('Error', 'error')
    }
  }

  //表格点击状态选择
  const handleClickWorkitemStatus = (row) => {
    row.statusEditable = !row.statusEditable
    nextTick(() => {
      RefStatusSelect.value.focus()
    })
  }
  const handleClickWorkitemSelect = (row) => {
    row.statusEditable = !row.statusEditable
  }
  const hanldeClickStatusOption = (row) => {
    row.statusEditable = !row.statusEditable
  }
  const handeWorkitemVisibleChange = (row, status) => {
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

  //获取工作项列表信息
  const handleGetWorkitemList = async () => {
    try {
      let params = {
        ...tableParams.value,
      }
      const { code, data }: any = await getWorkitemList(params)
      if (code === 200) {
        data?.records.forEach((item) => {
          if (Array.isArray(item.principal) && item.principal?.length > 0) {
            item.principal = item.principal.split(',')
          } else {
            item.principal = []
          }
          item.statusEditable = true
          item.priorityEditable = true
        })
        tableData.value = data.records
      }
    } catch (error) {
      console.log('Error', error)
    }
  }
  //当前页
  const handleCurrentPage = (val) => {
    console.log('%c [ val ]-148', 'font-size:13px; background:pink; color:#bf2c9f;', val)
    tableParams.value.pageNum = val
    handleGetWorkitemList()
  }
  //当前页条数
  const handleSizeChange = (val) => {
    tableParams.value.pageNum = 1
    tableParams.value.pageSize = val
    handleGetWorkitemList()
  }
  onMounted(() => {
    console.log('=======', route.query)
    nextTick(() => {
      const cacheTab = Store.workItemTabChecked
      activeName.value = cacheTab
    })
    handleGetWorkitemList()
  })
</script>

<style lang="scss" scoped>
  .workitem-box {
    width: 100%;
    height: 100%;
    background-color: #fff;
    .workitem-tabs-header {
      position: relative;
      .workitem-right-content {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        top: 16px;
        right: 20px;
        .add {
          padding: 6px 14px;
        }
      }
    }
    .table-box {
      width: 100%;
      height: 800px;
      overflow: hidden;
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
  :deep(.el-tabs) {
    .el-tabs__nav-scroll {
      padding-left: 20px;
      height: 60px;
      .el-tabs__nav {
        height: 60px;
        .el-tabs__item {
          padding-top: 26px;
        }
        #tab-4 {
          position: relative !important;
        }
      }
    }
    .el-tabs__content {
      height: 0;
    }
  }
  .custom-dropdown {
    position: absolute;
    top: 40px;
    left: 530px;
  }
  .more-wraper {
    display: flex;
    width: 44px;
    align-items: center;
    justify-content: space-between;
  }
  :deep(.el-dropdown-menu__item) {
    .el-checkbox {
      --el-checkbox-checked-icon-color: #1e80ff;
      .el-checkbox__input,
      .el-checkbox__input.is-checked {
        .el-checkbox__inner {
          border: none;
          background-color: transparent !important;
        }
      }
    }
  }
</style>
