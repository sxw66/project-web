# 表格 PropTable

用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作。

## 基础表格

::: demo

```html
<template>
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
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, defineAsyncComponent, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  // 异步加载表头筛选组件
  const TableHeaderSearch = defineAsyncComponent(() => import('./components/table-header-search.vue'))
  // 异步加载表格标题筛选组件
  const TableHeaderMenu = defineAsyncComponent(() => import('./components/table-header-menu.vue'))

  // 表格选项数据
  const myTableRef = ref(null)
  // table多选数据
  const multipleSelection = ref([]) 

  const loading = ref(true)
  const ProductStore = useProductStore()
  const Router = useRouter()
  const selectedName: any = ref('全部产品')
  const total = ref()
  const tableParams: any = reactive({
    pageNum: 1,
    pageSize: 10,
    productName: '',
    fromType: 0,
  })
  const CreateVisible = ref(false)
  const steps = ref([])
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
      inSearch: true,
      hide: true, // 不展示当前列
      valueType: 'filtrate',
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
    console.log('点击菜单项触发的事件回调', command)
    // 产品信息
    if (command === 'productInformation') {
      console.log('产品信息')
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
</script>
```

:::

## 属性说明 - PropTable

| 事件名   | 说明                        | 参数    |
| -------- | --------------------------- | ------- |
| isShowHeader  | 是否展示表头-默认展示    | `Boolean` |
| columns  | 表格列数据可配置如下：        | `Array` |
| name     | 字段名称 对应列内容的字段名 | string  |
| label    | 显示的标题                  | string  |
| sortable | 对应列是否可以排序          | boolean |
| slot     | 自定义列的插槽              | boolean |
| hide | 不展示当前列 | boolean |
| hideHeaderMenu     | 是否默认隐藏表头配置              | boolean |
| dropdownList     | 表头列表配置数据源              | Array |
| tableTitle     | 表格表头标题              | string |
| multipleSelection     | 已选X项只有在Tablemenu插槽存在时才展示             | Array |
| inSearch | 是否配置可搜索项            | boolean |
| valueType| 可搜索项类型可选`input`-`radio-button`-`select`-`filtrate`     | string |
| valueType| 如果valueType=`filtrate`则需要配置指定的插槽过滤详情见demo     | string |
| inputModel| 如果valueType=`input`默认值   | string |
| radioModel| 如果valueType=`radio-button`的默认值   | string |
| selectModel| 如果valueType=`select`的默认值   | string |
| options   | valueType如果为列表或者单选类型的数据源   | Array |



## 事件说明 - PropTable

| 事件名        | 说明                            | 参数              |
| ------------- | ------------------------------- | ----------------- |
| addNew | 表格新建按钮事件         |                   |
| handeFormChange   | 表单的回调函数   | form  |
| handeDropdownChange   | dropdown-item点击菜单项触发的事件回调   | dropdown-item 的指令 |
| selection-change   | 当选择项发生变化时会触发该事件   | selection  |
| size-change  | page-size 改变时触发 | 当前选择的size-change |
| current-page   | current-page 改变时触发               | 当前选择的current-page        |

## Slot 说明 - PropTable

| Slot 名称     | 说明                 |
| ------------- | -------------------- |
| filtrate      | 表单右侧插槽     |
| btn         | 工具栏操作工具           |
| Tablemenu   | 表格头部菜单插槽 |
