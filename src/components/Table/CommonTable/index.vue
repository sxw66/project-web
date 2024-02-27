<script setup lang="ts">
  import { ref, reactive, computed, watch, defineAsyncComponent, useAttrs, nextTick } from 'vue'
  import { Search, Plus, ArrowDown } from '@element-plus/icons-vue'

  export interface Props {
    columns?: any
    data?: any
    total?: number
    totalName?: string //数据总数后面文案
    border?: boolean // 是否显示边框
    showCreateBtn?: boolean // 是否显示创建按钮
    pagination?: boolean // 是否显示分页
    layout?: string // 分页
    headerHeight?: number | string // 标题高度
    productTitle?: string // 产品标题
    createBtnText?: string // 产品按钮文案
    searchRadioList?: any // 产品类别
    pageSizes?: any // 分页 sizes
    rowKey?: any // 行数据的 Key，复选框多选分页记忆回显问题必加改字段
    tableKey?: number | string
    searchInfo?: any
    permission?: any
    showFilter?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    productTitle: '全部产品',
    createBtnText: '新建产品',
    searchRadioList: [],
    columns: [],
    labels: () => ['one', 'two'],
    total: 0,
    totalName: '个产品',
    pagination: true,
    layout: 'total, sizes, prev, pager, next, jumper',
    pageSizes: [15, 30, 60, 100],
    rowKey: 'id',
    tableKey: 0,
    border: false,
    headerHeight: null,
    showCreateBtn: true,
    searchInfo: () => ({}),
    showFilter: false,
  })

  const emit = defineEmits([
    'reset',
    'onSubmit',
    'selection-change',
    'current-page',
    'column-operation',
    'handeRadioChange',
    'handeSearchChange',
    'handeCreate',
    'clickFilter',
    'clickSort',
  ])

  const searchInput = ref('')
  const radioType = ref('全部')

  // 新建产品
  const handeCreate = (event: any) => {
    emit('handeCreate', event)
    console.log('你点击了新建')
  }

  // 把搜索框的值抛出去
  const handeSearchChange = (msg: any) => {
    emit('handeSearchChange', msg)
  }

  // 把单选框的值抛出去
  const handeRadioChange = (index: any) => {
    emit('handeRadioChange', index)
  }

  // 透传属性 attrs
  const attrs = useAttrs()
  const HrmsEmpty = defineAsyncComponent(() => import('@/components/Empty/index.vue'))
  // const FilterFormSimple = defineAsyncComponent(() => import('./filter.form.simple.vue'))
  const tableData = computed(() => props.data || [])
  const pageSizes = computed(() => {
    return props.pageSizes
  })

  // 计算标题高度
  const computedHeaderHeight = computed(() => {
    let style: any = {}
    const { headerHeight } = props
    if (headerHeight) {
      style.height = headerHeight + 'px'
      style.lineHeight = headerHeight + 'px'
    }
    return style
  })

  const tableRef = ref(null) // 表格元素

  const columnsList = computed(() => props.columns.filter((item: any) => !item.hide))
  const getEmpty = (data: any) => {
    if (data === 0) {
      return data
    } else {
      return '--'
    }
  }
  //过滤条件的数量
  const filterNumber = ref(0)
  //未处理的过滤条件数据
  const filterInfoList = ref([])
  //显示隐藏过滤弹窗
  const showFilterVisible = ref(false)
  //选中过滤样式
  const selectedFilter = ref(false)
  //过滤弹窗样式
  const customPoperStyle = {
    width: '500px',
    height: '400px',
  }

  //过滤组件Ref
  const RefFilter = ref()

  //回显选中过滤样式
  const handleShowFilter = () => {
    selectedFilter.value = true
  }

  //隐藏选中过滤样式
  const handleHideFilter = () => {
    selectedFilter.value = false
  }

  //获取过滤条件信息
  const handleGetFilterInfo = (info) => {
    filterInfoList.value = info
  }

  //取消过滤
  const handleFilterCancel = () => {
    showFilterVisible.value = false
    flag.value = false
  }

  //确认过滤
  const handleFilterComfirm = () => {
    const filterInfo = {}
    showFilterVisible.value = false
    flag.value = false
    filterNumber.value = filterInfoList.value?.filter((item) => item.field)?.length ?? 0
    const list = filterInfoList.value
    list?.forEach((item) => {
      filterInfo[item.field] = item.typeValue
    })
    emit('clickFilter', filterInfo)
  }

  const flag = ref(false)

  //点击过滤
  const handleClickFilter = () => {
    flag.value = !flag.value
    if (flag.value) {
      showFilterVisible.value = true
    } else {
      showFilterVisible.value = false
    }
  }

  //关闭过滤弹窗
  const handleCloseFilter = () => {
    showFilterVisible.value = false
    flag.value = false
  }

  //重置过滤条件
  const handleResetFilter = () => {
    RefFilter.value.resetFilter()
    const filterInfo = {}
    showFilterVisible.value = false
    flag.value = false
    nextTick(() => {
      filterNumber.value = filterInfoList.value?.filter((item) => item.field)?.length ?? 0
      const list = filterInfoList.value
      list?.forEach((item) => {
        item.field && (filterInfo[item.field] = item.typeValue)
      })
      emit('clickFilter', filterInfo)
    })
  }

  let obj: any = {}
  let search: any = []

  // 初始化筛查条件
  props.columns.forEach((item: any) => {
    if (item.inSearch) {
      obj[item.customName || item.name] = null
      search.push(item)
    }
  })

  const formInline = reactive(obj)

  watch(
    () => props.tableKey,
    (newVal) => {
      let formKey: any = Object.keys(formInline)
      if (!props.tableKey && props?.tableKey == null && formKey == 'zjmc') {
        formKey.includes('zjMc') &&
          ((formInline.zjMc = props?.searchInfo[props?.tableKey]), emit('onSubmit', formInline))
      }
      if (props.tableKey && formKey == 'zjmc') {
        formKey.includes('zjMc') &&
          ((formInline.zjMc = props?.searchInfo[props?.tableKey]), emit('onSubmit', formInline))
      }
    },
    {
      immediate: true,
    },
  )

  // 按钮是否可用
  const isDisabled = (disabledFn: any, row: any) => {
    if (disabledFn) {
      return disabledFn(row)
    }
    return false
  }
  // 分页current-page 改变时触发（解决改api与表格api冲突）
  const handleCurrentChange = (val: number) => {
    console.log(val)
    emit('current-page', val)
  }
  // 当前行操作
  const onColumnOperation = (btn: any, row: any, index: any) => {
    emit('column-operation', btn, row, index)
  }

  // 暴露属性|方法
  defineExpose({
    tableRef,
  })
</script>

<template>
  <div class="p-table">
    <header class="layout-header">
      <div class="layout-header-title" :style="computedHeaderHeight">
        <svg-icon name="all" />
        <span class="title">{{ productTitle }}</span>
      </div>
      <el-button v-if="showCreateBtn" type="primary" :icon="Plus" @click="handeCreate">{{
        createBtnText
      }}</el-button>
      <slot name="headerRight"></slot>
    </header>
    <main>
      <div class="layout-content">
        <div class="layout-content-search">
          <el-input
            v-model="searchInput"
            class="search-btn"
            clearable
            placeholder="搜索（Ctrl+G）"
            :prefix-icon="Search"
            @change="handeSearchChange"
          />
        </div>
        <!-- 传入搜索条件 -->
        <slot name="otherSearch"></slot>
        <div class="layout-content-tabs" v-if="searchRadioList.length">
          <el-radio-group v-model="radioType" @change="handeRadioChange">
            <el-radio-button :label="item" v-for="item in searchRadioList" :key="item" />
          </el-radio-group>
        </div>
        <div v-if="showFilter" class="flex filter-table-wraper">
          <!-- 点击筛选 -->
          <el-popover
            :visible="showFilterVisible"
            @hide="handleHideFilter"
            @show="handleShowFilter"
            :popper-style="customPoperStyle"
            :show-arrow="false"
            trigger="click"
          >
            <template #reference>
              <div
                @click="handleClickFilter"
                class="filter"
                :class="{ filterActived: selectedFilter }"
              >
                <svg-icon size="15" :name="'filter'"></svg-icon>
                <span style="margin-left: 5px">筛选</span>
                <span class="number">{{ filterNumber }}</span>
              </div>
            </template>
            <div class="filter-header">
              <span style="font-size: 16px">筛选</span>
              <el-icon class="icon-close" @click="handleCloseFilter" size="20"><Close /></el-icon>
            </div>
            <div class="footer">
              <div class="left">
                <el-button @click="handleResetFilter" link type="primary">重置</el-button>
              </div>
              <div class="right">
                <el-button @click="handleFilterCancel">取消</el-button>
                <el-button @click="handleFilterComfirm" type="primary">确定</el-button>
              </div>
            </div>
          </el-popover>
        </div>
        <div class="layout-content-quantity">{{ `${total}${totalName}` }}</div>
      </div>
      <div class="layout-table">
        <!-- 默认插槽的内容 -->
        <el-table
          ref="tableRef"
          class="zb-table"
          :data="tableData"
          :border="border"
          v-bind="attrs"
          :row-key="rowKey"
          :key="tableKey"
          @selection-change="(val) => emit('selection-change', val)"
        >
          <template v-for="item in columnsList">
            <el-table-column
              v-if="item.type"
              :type="item.type"
              :reserve-selection="item.reserveSelection"
              :selectable="item.selectable"
              :align="item.align ? item.align : 'center'"
              :width="item.width"
              :fixed="item.fixed"
              :label="item.label"
              :key="item.label"
            >
              <template v-if="item.slot" #default="scope">
                <slot :name="item.type" :item="item" :row="scope.row"></slot>
              </template>
            </el-table-column>
            <!-- 日期时间戳转日期 -->
            <el-table-column
              v-else-if="item.format"
              :prop="item.name"
              :width="item.width"
              :align="item.align ? item.align : 'center'"
              :fixed="item.fixed"
              :label="item.label"
              :sortable="item.sortable"
              :key="item.name"
              show-overflow-tooltip
            />
            <el-table-column
              v-else-if="item.name != 'operation'"
              :prop="item.name"
              :width="item.width"
              :align="item.align ? item.align : 'center'"
              :fixed="item.fixed"
              :label="item.label"
              :sortable="item.sortable"
              :key="item.name || item.customName"
              show-overflow-tooltip
            >
              <template #default="scope">
                <slot
                  v-if="item.slot"
                  :name="item.name"
                  :item="item"
                  :row="scope.row"
                  :column="scope.column"
                ></slot>
                <template v-else>{{
                  scope.row[item.name] || getEmpty(scope.row[item.name])
                }}</template>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
              v-else
              :prop="item.name"
              :width="item.width"
              :align="item.align ? item.align : 'center'"
              :fixed="item.fixed"
              :label="item.label"
              :sortable="item.sortable"
              :key="item.name ? item.name : item.customName"
              show-overflow-tooltip
            >
              <template #default="scope">
                <slot v-if="item.slot" :name="item.name" :item="item" :row="scope.row"></slot>
                <template v-else>
                  <el-button
                    v-for="el in item?.operation?.slice(0, 2) || []"
                    :key="el.type"
                    type="primary"
                    link
                    :disabled="isDisabled(el.disabled, scope.row)"
                    @click.stop="onColumnOperation(el, scope.row, scope.$index)"
                  >
                    {{ el.label }}
                  </el-button>
                  <template v-if="item?.operation?.length > 2">
                    <el-dropdown trigger="click">
                      <div class="column-operation-box">
                        <el-icon size="15" color="#5cb4eb"><arrow-down /></el-icon>
                      </div>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item
                            v-for="el in item?.operation?.slice(2)"
                            :key="el.type"
                            :disabled="isDisabled(el.disabled, scope.row)"
                            @click="onColumnOperation(el, scope.row, scope.$index)"
                          >
                            {{ el.label }}
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </template>
                </template>
              </template>
            </el-table-column>
          </template>
          <template #empty>
            <hrms-empty></hrms-empty>
          </template>
        </el-table>
      </div>
      <!-- 分页 -->
      <div v-if="pagination" class="pro-pagination-box">
        <el-pagination
          v-bind="attrs"
          @current-change="handleCurrentChange"
          :layout="layout"
          :total="total"
          :page-sizes="pageSizes"
        />
      </div>
    </main>
    <!-- <footer></footer> -->
  </div>
</template>

<style lang="scss" scoped>
  .flex {
    display: flex;
  }
  .p-table {
    width: 100%;
    box-sizing: border-box;
    position: relative;
    .layout-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 40px;
      box-sizing: border-box;

      &-title {
        display: flex;
        align-items: center;
        cursor: pointer;
        height: 100px;
        line-height: 100px;
        .title {
          max-width: 170px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 20px;
          margin-left: 8px;
        }
      }
    }

    main {
      padding: 0 40px 10px 40px;
      box-sizing: border-box;
      .layout-content {
        padding: 0 0 10px 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        &-search {
          margin-right: 30px;
          .search-btn {
            width: 300px;
          }
        }
        &-tabs {
          width: 100%;
        }
        &-quantity {
          display: flex;
          justify-content: flex-end;
          width: 100%;
          color: #999;
          font-size: 14px;
        }
        .filter-table {
          &-wraper {
            position: relative;
            justify-content: space-between;
            width: 270px;
            box-sizing: border-box;
            .filter {
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 5px;
              margin-right: 5px;
              cursor: pointer;
              user-select: none;
              .number {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 18px;
                height: 18px;
                padding: 2px;
                font-size: 13px;
                margin-left: 7px;
                color: #6698ff;
                background-color: rgba(104, 153, 252, 0.1);
                border-radius: 50%;
              }
              &:hover {
                color: #6698ff;
                background-color: rgba(104, 153, 252, 0.1);
                border-radius: 4px;
                .number {
                  background-color: transparent;
                }
              }
            }
            .sort {
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 5px 10px;
              cursor: pointer;
              user-select: none;
              &:hover {
                color: #6698ff;
                background-color: rgba(104, 153, 252, 0.1);
                border-radius: 4px;
              }
            }
          }
        }
      }
      .layout-table {
        box-sizing: border-box;
        margin-top: 12px;
      }
      .pro-pagination-box {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding-top: 20px;
        box-sizing: border-box;
      }
    }
  }
  .filterActived {
    color: #6698ff;
    background-color: rgba(104, 153, 252, 0.1);
    border-radius: 4px;
    .number {
      background-color: transparent;
    }
  }

  :deep(.el-popover) {
    overflow: hidden;
    height: 400px;
    box-sizing: border-box;
  }
  .filter-header {
    width: 97%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 22px;
    box-sizing: border-box;
    .icon-close {
      cursor: pointer;
      :hover {
        color: #6698ff;
      }
    }
  }
  .footer {
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 22px;
    box-sizing: border-box;
    width: 97%;
    bottom: 15px;
  }
</style>
