<template>
  <div class="app-container">
    <div class="flex worder-order-box">
      <div class="left">
        <nav-list :steps="steps" @selected="handeSelected" />
      </div>
      <div class="right">
        <PropTable
          @selection-change="selectionChange"
          @handeSearchChange="handeSearchChange"
          @cell-click="handeCellClick"
          @current-page="handleCurrentChange"
          @size-change="handleSizeChange"
          @clickFilter="handleClickFilter"
          @addNew="handleCreateWorkOrder"
          :data="tableData"
          :tableTitle="selectedName"
          :total="total"
          border
          :columns="columnList"
          :page-size="tableParams.pageSize"
          :current-page="tableParams.pageNum"
          :multipleSelection="multipleSelection"
        >
          <!-- 头部菜单 -->
          <template #Tablemenu>
            <TableHeaderMenu :multipleIds="multipleSelection" @changeMore="handleChangeMore" />
          </template>
          <!-- 投票数 -->
          <template #voteNum="{ row }">
            <div class="voteNum" v-if="row.voteNum != null">
              <svg-icon color="#73d897" style="transform: rotate(180deg)" name="voteNum"></svg-icon>
              <span style="margin-left: 4px">{{ row.voteNum }}</span>
            </div>
            <span v-else>--</span>
          </template>
          <!-- 标题 -->
          <template #orderTitle="{ row }">
            <div>
              <svg-icon
                style="margin-right: 6px"
                size="16"
                name="workorderTitle"
                color="rgb(246, 198, 89)"
              >
              </svg-icon>
              <span>{{ row.orderTitle }}</span>
            </div>
          </template>
          <!-- 状态 -->
          <template #orderStatus="{ row }">
            <div
              v-if="row.statusEditable"
              @click="handleClickWorkOrderStatus(row)"
              class="order-status"
              :style="{ background: orderStatusList[row.orderStatus]?.color }"
            >
              {{ orderStatusList[row.orderStatus].label }}
            </div>
            <div v-else>
              <el-select
                ref="RefStatusSelect"
                style="width: 100%"
                :automatic-dropdown="true"
                v-model="row.orderStatus"
                @click="handleClickStatusSelect(row)"
                @visible-change="handeStatusVisibleChange(row, $event)"
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
          <template #principalName="{ row }">
            <div v-if="row.principalName" class="principal-name">
              <span class="principal-name-bgc" :style="{ background: '#9a7ff2' }">
                {{ row.principalName?.substring(0, 2)?.toUpperCase() }}
              </span>
              <span>{{ row.principalName }}</span>
            </div>
            <span v-else>--</span>
          </template>
          <!-- 提交人 -->
          <template #createName="{ row }">
            <div v-if="row.createName" class="principal-name">
              <span class="principal-name-bgc" :style="{ background: '#9a7ff2' }">
                {{ row.createName?.substring(0, 2)?.toUpperCase() }}
              </span>
              <span>{{ row.createName }}</span>
            </div>
            <span v-else>--</span>
          </template>
          <!-- 客户 -->
          <template #customerName="{ row }">
            <div v-if="row.customerName">
              <div class="customer-icon-bgc">
                <svg-icon color="#fff" size="15" name="landmark"></svg-icon>
              </div>
              <span>{{ row.customerName }}</span>
            </div>
            <span v-else>--</span>
          </template>
          <!-- 客户类别 -->
          <template #customerModule="{ row }">
            <div v-if="row.customerModule" class="customer-module">
              {{ row.customerModule }}
            </div>
            <span v-else>--</span>
          </template>
          <!-- 类型 -->
          <template #orderType="{ row }">
            <div v-if="row.orderType != null">
              <svg-icon
                color="#999"
                size="16"
                style="margin-right: 8px"
                :name="orderTypeList[row.orderType].icon"
              >
              </svg-icon>
              <span>{{ orderTypeList[row.orderType].label }}</span>
            </div>
            <span v-else>--</span>
          </template>
          <!-- 渠道 -->
          <template #channel="{ row }">
            {{ channelList[row.channel] || '--' }}
          </template>
        </PropTable>
      </div>
      <div>
        <worderOrderForm
          ref="RefWorkOrderForm"
          v-model:visible="createDialog"
          v-model="formInfo"
          @confirm="handleComfirmAdd"
        >
        </worderOrderForm>
      </div>
      <div>
        <UpdateWorkOrderDialog
          :TypeList="collapseList"
          :ListFormData="tableRows"
          :dialogListVisible="dialogListVisible"
          @closeDialogList="closeDialogList"
        >
        </UpdateWorkOrderDialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, defineAsyncComponent, nextTick } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { selectStatusList } from './static'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { getWorkOrderList, addWorkOrderList, deleteWorkOrderList } from '@/api/modules/product.ts'
  const route = useRoute()
  const Router = useRouter()
  const selectedName: any = ref('全部计划')
  const total = ref()
  const dialogListVisible = ref(false)
  const collapseList = ref([]) // Nav 数据列表
  const tableRows = ref()
  const RefStatusSelect = ref()
  //新增的字段
  const formInfo: any = ref({
    orderTitle: '',
    orderMark: '',
    productId: '',
    orderType: '',
    customerId: '',
    creater: '',
    // focusName: '',
  })
  const multipleSelection = ref([])
  const RefWorkOrderForm = ref()
  const worderOrderForm = defineAsyncComponent(() => import('./add.work.order.vue'))
  const TableHeaderMenu = defineAsyncComponent(() => import('./workorder.header.menu.vue'))
  const UpdateWorkOrderDialog = defineAsyncComponent(() => import('./workorder.list.dialog.vue'))
  //显示新增弹窗
  const createDialog = ref(false)
  const detailFields = ['编号', '投票数', '标题']
  // 状态列表
  const orderStatusList = [
    {
      label: '待处理',
      color: '#5aacf9',
    },
    {
      label: '处理中',
      color: '#fd9e76',
    },
    {
      label: '已计划',
      color: '#f5c560',
    },
    {
      label: '已完成',
      color: '#76d899',
    },
    {
      label: '已关闭',
      color: '#d4d4d4',
    },
  ]
  //类型列表
  const orderTypeList = [
    {
      icon: 'demand',
      label: '需求',
    },
    {
      icon: 'defect',
      label: '缺陷',
    },
    {
      icon: 'listen',
      label: '技术支持',
    },
  ]
  //渠道列表
  const channelList = ['内部提交']
  const tableParams: any = ref({
    pageNum: 1,
    pageSize: 10,
    // voteNum: '',
    // planName: '',
    // orderTitle: 0,
    // principalName: 0,
    // createName: '',
    // customerName: '',
    // customerModule: '',
    // labels: '',
  })
  const steps = ref([
    {
      title: '排期',
      name: '全部计划',
      icon: 'all',
      iconColor: '#6698ff',
    },
    // {
    //   name: '待计划的工单',
    //   icon: 'borrow',
    //   iconColor: '#bbbbbb',
    // },
    // {
    //   name: '进行中的工单',
    //   icon: 'borrow',
    //   iconColor: '#bbbbbb',
    // },
    // {
    //   name: '我负责的工单',
    //   icon: 'borrow',
    //   iconColor: '#bbbbbb',
    // },
    // {
    //   name: '我提交的工单',
    //   icon: 'borrow',
    //   iconColor: '#bbbbbb',
    // },
  ])
  const tableData = ref([])
  const columnList = ref([
    {
      type: 'selection',
      width: 55,
      fixed: 'left',
    },
    {
      name: 'orderCode',
      label: '编号',
      sortable: true,
      fixed: 'left',
      width: 140,
    },
    {
      name: 'voteNum',
      label: '投票数',
      sortable: true,
      fixed: 'left',
      width: 140,
      slot: true,
    },
    {
      name: 'orderTitle',
      label: '标题',
      align: 'left',
      fixed: 'left',
      width: 260,
      slot: true,
    },
    {
      name: 'orderStatus',
      label: '状态',
      slot: true,
      width: 140,
    },
    {
      name: 'principalName',
      label: '负责人',
      align: 'left',
      width: 140,
      slot: true,
    },
    {
      name: 'createName',
      label: '提交人',
      width: 140,
      align: 'left',
      slot: true,
    },
    {
      name: 'customerName',
      label: '客户',
      width: 140,
      align: 'left',
      slot: true,
    },
    {
      name: 'customerModule',
      label: '客户类别',
      slot: true,
      width: 140,
    },
    {
      name: 'orderType',
      label: '类型',
      slot: true,
      align: 'left',
      width: 140,
    },
    {
      name: 'channel',
      label: '渠道',
      slot: true,
      width: 140,
    },
    {
      name: 'labels',
      label: '标签',
      width: 140,
    },
  ])
  // 侧边菜单列表选择的数据
  const handeSelected = (items: any) => {
    console.log('侧边菜单列表选择的数据', items)
    selectedName.value = items.name
    switch (items.name) {
      case '全部计划':
        console.log('全部计划列表')
        break
      case '待计划的工单':
        console.log('待计划的工单列表')
        break
      case '进行中的工单':
        console.log('进行中的工单列表')
        break
      case '我负责的工单':
        console.log('我负责的工单列表')
        break
      case '我提交的工单':
        console.log('我提交的工单列表')
        break
    }
  }
  // 多选
  const selectionChange = (val) => {
    multipleSelection.value = val
  }
  // 表格头部搜索框
  const handeSearchChange = (msg: any) => {
    tableParams.value.productName = msg
    handeGetWorkOrderList()
  }
  // 当某个单元格被点击时会触发该事件
  const handeCellClick = (row, column) => {
    tableRows.value = row
    if (detailFields.includes(column.label)) {
      dialogListVisible.value = true
    }
  }
  // 关闭列表弹框
  const closeDialogList = (ListState) => {
    if (ListState) {
      handeGetWorkOrderList()
    }
    dialogListVisible.value = false
  }
  // current-page 改变时触发
  const handleCurrentChange = (val: any) => {
    tableParams.value.pageNum = val
    handeGetWorkOrderList()
  }
  // page-size 改变时触发
  const handleSizeChange = (val: number) => {
    tableParams.value.pageNum = 1
    tableParams.value.pageSize = val
    handeGetWorkOrderList()
  }
  //触发新增工单
  const handleCreateWorkOrder = () => {
    formInfo.value = {
      productId: '',
      orderType: '',
    }
    createDialog.value = true
  }
  //确认新增工单
  const handleComfirmAdd = () => {
    try {
      RefWorkOrderForm.value?.validate(async () => {
        const { code }: any = await addWorkOrderList(formInfo.value)
        if (code === 200) {
          createDialog.value = false
          handeGetWorkOrderList()
          ElMessage({
            showClose: true,
            message: '新增成功',
            type: 'success',
          })
        }
      })
    } catch (error) {
      console.log(error, 'Error')
    }
  }
  //表格点击状态选择
  const handleClickWorkOrderStatus = (row) => {
    row.statusEditable = !row.statusEditable
    nextTick(() => {
      RefStatusSelect.value.focus()
    })
  }
  const handleClickStatusSelect = (row) => {
    row.statusEditable = !row.statusEditable
  }
  const hanldeClickStatusOption = (row) => {
    row.statusEditable = !row.statusEditable
  }
  const handeStatusVisibleChange = (row, status) => {
    if (!status) {
      row.statusEditable = true
    }
  }
  //删除工单列表
  const handleDeleteWorkOrderList = async (id) => {
    console.log(id)
    try {
      const { code }: any = await deleteWorkOrderList({ id })
      handeGetWorkOrderList()
      if (code === 200) {
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
  //操作更多
  const handleChangeMore = async (data) => {
    // let ids = multipleSelection.value.map((item) => item.id)
    let obj = multipleSelection.value.pop()
    // console.log('%c [ id ]-601', 'font-size:13px; background:pink; color:#bf2c9f;', id)
    const { code } = data
    switch (code) {
      case 'delete':
        handleDeleteWorkOrderList(obj.id)
        break
    }
  }
  // 获取列表数据-分页查询产品基础信息表
  const handeGetWorkOrderList = async () => {
    try {
      const { code, data }: any = await getWorkOrderList(tableParams.value)
      if (code === 200) {
        data?.records.forEach((item) => {
          item.statusEditable = true
        })
        tableData.value = data?.records
        total.value = data?.totals
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  const paramsInfo = {
    pageNum: 1,
    pageSize: 10,
  }
  //过滤搜索
  const handleClickFilter = (info) => {
    tableParams.value = { ...paramsInfo, ...info }
    handeGetWorkOrderList()
  }
  // //排序
  // const handleClickSort = (sort) => {
  //   tableParams.value = { ...tableParams.value, ...sort }
  //   handeGetWorkOrderList()
  // }
  onMounted(() => {
    // console.log(1, route.query)
    handeGetWorkOrderList()
  })
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
  }

  .worder-order-box {
    width: 100%;
    height: 100%;

    .left {
      min-width: 240px;
      // width: 240px;
      background-color: #fbfbfb;
      // background-color: red;
      box-sizing: border-box;
      border-right: 1px solid #eee;
      overflow-y: auto;
    }

    .right {
      width: 100%;
      background: #fff;
      overflow: scroll;
      .el-tooltip__trigger {
        outline: none;
      }
    }
  }
  .voteNum {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 54px;
    height: 22px;
    padding: 0 5px;
    border-radius: 22px;
    border: 1px solid #eee;
  }
  .order-status {
    display: grid;
    place-items: center;
    width: 70px;
    height: 27px;
    padding: 0 4px;
    border-radius: 27px;
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
  .principal-name {
    &-bgc {
      display: inline-block;
      text-align: center;
      line-height: 26px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      font-size: 12px;
      margin-right: 8px;
      color: #fff;
    }
  }
  .customer-icon-bgc {
    display: inline-block;
    text-align: center;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #6698ff;
    margin-right: 8px;
  }
  .customer-module {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 77px;
    height: 27px;
    padding: 0 4px;
    color: #666;
    border-radius: 5px;
    background-color: #f5f5f5;
  }
</style>
