<template>
  <div class="app-container">
    <div class="flex product-box">
      <div class="left">
        <nav-list :steps="steps" @selected="handeSelected" @handeRightIcon="handeRightIcon" />
      </div>
      <div class="right">
        <PropTable
          ref="myTableRef"
          :loading="loading"
          @selection-change="selectionChange"
          @addNew="handleAdd"
          @handeFormChange="handeFormChange"
          @cell-click="handeCellClick"
          @current-page="handleCurrentChange"
          @size-change="handleSizeChange"
          :tableTitle="selectedName"
          :columns="columnList"
          :data="tableData"
          :multipleSelection="multipleSelection"
        >
          <!-- 表头筛选 -->
          <template v-slot:filtrate>
            <TableHeaderSearch
              :amount="tableData.length"
              @handleFilterChange="handleFilterChange"
            />
          </template>
          <!-- 头部菜单 -->
          <template v-slot:Tablemenu>
            <TableHeaderMenu :multipleIds="multipleSelection" />
          </template>
          <!-- 列表内容 -->
          <template v-slot:iconShow="{ row }">
            <div class="tb-icon-list">
              <div v-show="row.isStar === 1">
                <el-tooltip placement="top">
                  <template #content> 取消星标</template>
                  <svg-icon
                    @click="handeStarTarget(row, 0)"
                    name="check-target"
                    color="#ffcd5d"
                    style="margin-right: 25px"
                  />
                </el-tooltip>
              </div>
              <div v-show="row.isStar === 0" class="tb-icon-star">
                <el-tooltip placement="top">
                  <template #content> 星标</template>
                  <svg-icon
                    @click="handeStarTarget(row, 1)"
                    name="star-target"
                    style="margin-right: 25px"
                  />
                </el-tooltip>
              </div>
              <div class="tb-icon-star">
                <el-tooltip placement="top">
                  <template #content> 新窗口打开 </template>
                  <svg-icon name="wicket" @click="handeOpenWindow" style="margin-right: 25px" />
                </el-tooltip>
                <el-tooltip placement="top">
                  <template #content> 更多</template>
                  <el-dropdown @command="handleCommand" trigger="click">
                    <svg-icon name="more" />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          v-for="(item, index) in moreMenu"
                          :key="index"
                          :command="item.command"
                          :divided="item.divided"
                          :icon="item.icon"
                          :disabled="item.disabled"
                          >{{ item.label }}</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </el-tooltip>
              </div>
            </div>
          </template>
          <template v-slot:productName="{ row }">
            <div class="tb-head-product">
              <svg-icon name="product" :color="row.productColor" style="margin-right: 8px" />
              <span>{{ row.productName }}</span>
              <span class="copy-box">
                <el-tooltip placement="top" content="点击复制">
                  <el-button
                    class="copy-btn"
                    text
                    :icon="DocumentCopy"
                    @click="handleCopy(row.productName, $event)"
                  />
                </el-tooltip>
              </span>
            </div>
          </template>
          <template v-slot:fromType="{ row }">
            <el-tag :type="row.fromType === 0 ? 'success' : 'danger'">
              {{ row.fromType === 0 ? '组织' : '团队' }}
            </el-tag>
          </template>
          <template v-slot:operation="scope">
            <el-button type="primary" size="small" icon="Edit"> 编辑 </el-button>
            <el-button type="danger" size="small" icon="Delete"> 删除 </el-button>
          </template>
        </PropTable>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, onMounted, computed, defineAsyncComponent, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElNotification } from 'element-plus'
  import clip from '@/utils/clipboard'
  import { Edit, User, Plus, Delete, Operation, DocumentCopy } from '@element-plus/icons-vue'
  import { getProductPages, updateProductPages, getsListAllStars } from '@/api/modules/product'
  import { useProductStore } from '@/store/modules/product'
  import PropTable from '@/components/Table/PropTable/index.vue'
  // 异步加载表头筛选组件
  const TableHeaderSearch = defineAsyncComponent(() => import('./components/table-header-search.vue'))
  // 异步加载表格标题筛选组件
  const TableHeaderMenu = defineAsyncComponent(() => import('./components/table-header-menu.vue'))

  // 表格选项数据
  const myTableRef = ref(null)
  const multipleSelection = ref([]) //table多选数据

  const loading = ref(true)
  const ProductStore = useProductStore()
  const Router = useRouter()
  const steps = ref([])
  const selectedName = ref('全部产品')
  const total = ref()
  const tableParams: any = reactive({
    pageNum: 1,
    pageSize: 10,
    productName: '',
    fromType: 0,
  })
  const CreateVisible = ref(false)
  const tableData = ref([])
  const columnList = ref([
    {
      type: 'selection',
      width: 60,
      fixed: 'left',
    },
    {
      name: 'productName',
      label: '产品',
      sortable: true,
      slot: true,
      inSearch: true,
      valueType: 'input',
      inputModel: '我是输入框类型默认值',
      width: 280,
      align: 'left',
    },
    {
      name: 'iconShow',
      slot: true,
      width: 200,
    },
    {
      name: 'productCode',
      label: '标识',
      sortable: true,
      inSearch: true,
      hideHeaderMenu: true,
      options: [
        {
          value: 1,
          label: '全部',
        },
        {
          value: 0,
          label: '星标',
        },
      ],
      radioModel: '星标',
      valueType: 'radio-button',
    },
    {
      name: 'fromType',
      label: '所属',
      sortable: true,
      slot: true,
      inSearch: true,
      valueType: 'input',
    },
    {
      name: 'sex',
      label: '性别',
      slot: true,
      inSearch: true,
      options: [
        {
          value: 1,
          label: '男',
        },
        {
          value: 0,
          label: '女',
        },
      ],
      selectModel: 1,
      valueType: 'select',
    },
    {
      name: 'createTime',
      label: '时间',
    },
    { name: 'operation', slot: true, fixed: 'right', width: 200, label: '操作' },
  ])

  // 数据源
  const moreMenu = computed(() => {
    return [
      {
        command: 'productInformation',
        divided: false,
        label: '产品信息',
        icon: Plus,
      },
      {
        command: 'productMember',
        divided: true,
        label: '产品成员',
        icon: User,
      },
      {
        command: 'editBasic',
        divided: false,
        label: '编辑基本信息',
        icon: Edit,
      },
      {
        command: 'moreSetting',
        divided: false,
        label: `更多设置`,
        icon: Operation,
      },
      {
        command: 'recycleBin',
        divided: false,
        label: `回收站`,
        icon: Delete,
      },
    ]
  })

  // 多选
  const selectionChange = (val) => {
    multipleSelection.value = val
  }

  // 复制
  const handleCopy = (text, event) => {
    if (typeof text === 'string') {
      clip(text, event)
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
  // 表格头部搜索框
  const handeFormChange = (items: any) => {
    tableParams.productName = items.productName
    if (items.productCode === '星标') {
      tableParams.isStar = 1
    } else {
      tableParams.isStar = ''
    }
    console.log('items', items)
    handeGetList()
  }

  // 侧边菜单列表选择的数据
  const handeSelected = async (items: any) => {
    console.log('侧边菜单列表选择的数据', items)
    selectedName.value = items.name
    if (items.name === '组织产品') {
      tableParams.fromType = 0
      handeGetList()
    }
    if (items.name === '团队产品') {
      tableParams.fromType = 1
      handeGetList()
    }
    if (items.name === '配置中心') {
      Router.push('/admin')
    }
    // 点击了星标的tabs
    if (items.id) {
      ProductStore.handleSetProductId(items.id)
      Router.push('/home')
    }
  }
  // LI 左侧列表的icon点击事件
  const handeRightIcon = (items: any) => {
    // 取消星标
    handeStarTarget(items, 0)
  }

  // 当某个单元格被点击时会触发该事件
  const handeCellClick = async (row, column) => {
    console.log('当某个单元格被点击时会触发该事件', row)
    await ProductStore.handleSetProductId(row.id)
    // Router.push('test/demand')
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

  // 选择星标-取消星标
  const handeStarTarget = async (row, index) => {
    let rowParms = {
      id: row.id,
      isStar: index,
    }
    // 更新产品基础信息表
    await updateProductPages(rowParms).then(async (res) => {
      if (res.code === 200) {
        if (res.data) {
          // 获取选中的星标列表
          handleUpdateStarList(index)
          // 分页查询产品基础信息表
          handeGetList()
        }
      }
    })
  }

  // 新窗口打开
  const handeOpenWindow = () => {
    // let routeUrl = Router.resolve({
    //   path: 'test/demand',
    // })
    // window.open(routeUrl.href, '_blank')
  }

  // 新建项目
  const handleAdd = () => {
    CreateVisible.value = true
  }
  // 新建成功刷新列表
  const handleSubmit = () => {
    handeGetList()
  }
  // 个人中心切换
  const handleCommand = (command: string | number | object) => {
    console.log('======', command)
    // 产品信息
    if (command === 'productInformation') {
      console.log('产品信息')
    }
    // 产品成员
    if (command === 'productMember') {
      Router.push('settings/members')
    }
    // 编辑基本信息
    if (command === 'editBasic') {
      Router.push('settings/members')
    }
    // 更多设置
    if (command === 'moreSetting') {
      Router.push('settings/members')
    }
    // 回收站
    if (command === 'recycleBin') {
      Router.push('recycle/bin')
    }
  }

  // 获取列表数据-分页查询产品基础信息表
  const handeGetList = async () => {
    try {
      const { code, data } = await getProductPages(tableParams)
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

  // 获取所有星标列表
  const handleUpdateStarList = async (index) => {
    try {
      steps.value = [
        {
          title: '产品',
          name: '全部产品',
          icon: 'borrow',
          iconColor: '#6698ff',
        },
        {
          name: '组织产品',
          icon: 'take-over',
          iconColor: '#73d897',
        },
        {
          name: '团队产品',
          icon: 'synchronous',
          iconColor: '#5dcfff',
        },
        {
          name: '配置中心',
          icon: 'todo',
          iconColor: '#ee6723',
        },
      ]
      const res = await getsListAllStars()
      if (res.code === 200) {
        // 只有在取消星标时展示公告
        if (!index) {
          ElNotification({
            position: 'bottom-left',
            message: '取消星标成功',
            type: 'success',
            duration: 2000,
          })
        }
        let starArr = res.data.map((item) => ({
          name: item.productName,
          iconColor: item.productColor,
          icon: 'product',
          id: item.id,
          rightIcon: 'check-target',
          rightIconColor: 'ffcd5d',
          rightTooltip: '取消星标',
        }))
        if (starArr.length) {
          starArr.unshift({
            titleIcon: 'check-target',
            title: '星标',
          })
        }
        steps.value = steps.value.concat(starArr)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  onMounted(() => {
    handeGetList()
    handleUpdateStarList(1)
  })
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
  }

  .product-box {
    height: 100%;

    .left {
      min-width: 240px;
      background-color: #fbfbfb;
      box-sizing: border-box;
      border-right: 1px solid #eee;
      overflow-y: auto;
    }

    .right {
      width: 100%;
      background: #fff;
      box-sizing: border-box;
      .el-tooltip__trigger {
        outline: none;
      }
      .tb-icon-list {
        min-height: 32px;
        display: flex;
        align-items: center;
        &:hover {
          transition: all 5.5s ease;
          .tb-icon-star {
            display: flex;
          }
        }
        .tb-icon-star {
          display: none;
        }
      }

      .tb-head-product {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        min-height: 32px;
        &:hover {
          .copy-box {
            display: flex;
            align-items: center;
            margin-left: 10px;
            justify-content: flex-end;
            flex: 1;
          }
        }
        .copy-box {
          display: none;
          .copy-btn {
            :deep(.el-icon) {
              pointer-events: none;
            }
          }
        }
      }
    }
  }
</style>
