<template>
  <div class="zb-pro-table">
    <div class="header">
      <div class="header-title" v-if="isShowHeader">
        <p>{{ tableTitle }}</p>
        <el-button type="primary" :icon="Plus" @click="addNew">新建</el-button>
      </div>
      <div class="header-form" v-if="formSearchData.length">
        <el-form
          :inline="true"
          class="search-form"
          :model="formInline"
          ref="ruleFormRef"
          @submit.native.prevent
        >
          <template v-for="(item, index) in formSearchData" :key="index">
            <!-- :label="item.label" -->
            <el-form-item v-show="isExpand ? isExpand : index < 5">
              <template v-if="item.valueType === 'input'">
                <el-input
                  v-model="formInline[item.name]"
                  :placeholder="`请输入${item.label}`"
                  clearable
                  :prefix-icon="Search"
                  @change="handeSearchChange"
                  maxlength="200"
                >
                  <!-- 提供后缀插槽 -->
                  <template #append v-if="item.append">
                    <slot name="append"></slot>
                  </template>
                </el-input>
              </template>
              <template v-if="item.valueType === 'select'">
                <el-select
                  clearable
                  style="width: 100%"
                  v-model="formInline[item.name]"
                  :placeholder="`请选择${item.label}`"
                  @change="handeSelectChange"
                >
                  <el-option
                    v-for="chlrenite in item.options"
                    :key="chlrenite.value"
                    :label="chlrenite.label"
                    :value="chlrenite.value"
                  >
                    <svg-icon
                      v-if="chlrenite.iconName"
                      :name="chlrenite.iconName"
                      :color="chlrenite.iconColor"
                      style="margin-right: 5px"
                    />
                    {{ chlrenite.label }}
                  </el-option>
                </el-select>
              </template>
              <template v-if="item.valueType === 'radio-button'">
                <el-radio-group v-model="formInline[item.name]" @change="handeRadioChange">
                  <el-radio-button
                    v-for="RadioList in item.options"
                    :label="RadioList.label"
                    :value="RadioList.value"
                    :key="RadioList"
                  />
                </el-radio-group>
              </template>
            </el-form-item>
          </template>
          <el-form-item v-if="$slots.filtrate">
            <slot name="filtrate"></slot>
          </el-form-item>
        </el-form>
        <!-- <div class="search">
          <el-button type="primary" @click="onSubmit" :icon="Search">查询</el-button>
          <el-button @click="reset(ruleFormRef)">重置</el-button>
          <el-button link type="primary" @click="isExpand = !isExpand"
            >{{ isExpand ? '合并' : '展开'
            }}<el-icon>
              <arrow-down v-if="!isExpand" />
              <arrow-up v-else /> </el-icon
          ></el-button>
        </div> -->
      </div>
    </div>
    <!----------底部---------------------->
    <div class="footer">
      <!-----------工具栏操作工具----------------->
      <div class="operator" v-if="$slots.btn">
        <slot name="btn"></slot>
      </div>
      <!-- ------------表格--------------->
      <div class="table">
        <!-- 表格头部菜单插槽 -->
        <div class="table-header-operation" v-if="$slots.Tablemenu">
          <div class="operation-selection" v-if="multipleSelection.length">
            <span>已选中 {{ multipleSelection.length }} 项 </span>
            <el-divider direction="vertical" />
            <slot name="Tablemenu"></slot>
            <el-button type="info" class="deselect" link @click="handeDeselect">取消选择</el-button>
          </div>
        </div>
        <el-table
          ref="tableRef"
          class="zb-table"
          v-loading="loading"
          @selection-change="selectionChange"
          :data="list"
          v-bind="attrs"
          :row-key="rowKey"
          :border="border"
          @cell-mouse-enter="handeCellEnter"
          @cell-mouse-leave="handeCellLeave"
          :header-row-class-name="customHeaderRowClass"
        >
          <template v-for="item in columnsList">
            <el-table-column
              v-if="item.type"
              :type="item.type"
              :width="item.width"
              :align="item.align != null ? item.align : 'center'"
              :fixed="item.fixed"
              :label="item.label"
              :sortable="item.sortable"
            >
              <template #default="scope">
                <template v-if="item.type === 'selection'">
                  <div
                    v-if="columnCheckedId == scope.row.id || checkedList[scope.$index]"
                    @click.stop
                  >
                    <el-checkbox
                      v-model="checkedList[scope.$index]"
                      @change="cellCheckbox(scope.row, scope.$index)"
                    ></el-checkbox>
                  </div>
                  <span v-else>{{ scope.$index + 1 }}</span>
                </template>
                <slot
                  v-else-if="item.slot"
                  :name="item.type"
                  :item="item"
                  :row="scope.row"
                  :column="scope.column"
                  :scope="scope"
                ></slot>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :prop="item.name"
              :width="item.width"
              :align="item.align != null ? item.align : 'center'"
              :fixed="item.fixed"
              :label="item.label"
              :sortable="item.sortable"
            >
              <!-- 表头操作 -->
              <template v-slot:header v-if="item.label && !item.slot && !item.hideHeaderMenu">
                <span
                  class="header-label"
                  :class="item.align ? `header-label_${item.align}` : ''"
                  @click="handleEdiPreventDefault"
                >
                  <el-dropdown trigger="click" @command="handleCommand">
                    <span class="tb-dropdown-menu">
                      <span>{{ item.label }}</span>
                      <el-icon class="el-icon--right">
                        <Operation />
                      </el-icon>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item
                          v-for="(item, index) in dropdownList"
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
                </span>
              </template>
              <!-- 表头Tag状态 -->
              <template v-slot:header v-else-if="headerTag && !item.headerHideTag">
                <el-tag effect="dark" round :type="item.headerTaType">{{ item.label }}</el-tag>
              </template>
              <template #default="scope">
                <span v-if="!item.slot">{{ scope.row[item.name] }}</span>
                <slot
                  v-else
                  :name="item.name"
                  :item="item"
                  :column="scope.column"
                  :row="scope.row"
                ></slot>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </div>
      <!-- ------------分页--------------->
      <div class="pagination">
        <el-pagination
          v-model:currentPage="currentPage1"
          :page-size="10"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="data.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, reactive, ref, nextTick, useAttrs } from 'vue'
  import {
    Plus,
    Sort,
    Delete,
    Operation,
    Search,
    Notebook,
    DArrowLeft,
    DArrowRight,
    ArrowLeftBold,
    ArrowRightBold,
  } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance } from 'element-plus'
  // 透传属性 attrs
  const attrs = useAttrs()
  const ruleFormRef = ref<FormInstance>()
  // 页码
  const currentPage1 = ref(1)
  // 收缩展开
  const isExpand = ref(false)
  const tableRef = ref(null) // 表格元素
  const columnCheckedId = ref('') // 表格列ID
  const columnSelection = ref([]) // 表格列选中部分
  const checkedList = ref([]) // 表格是否选中

  // 分发事件给父组件
  const emit = defineEmits([
    'reset',
    'onSubmit',
    'selection-change',
    'addNew',
    'handeFormChange',
    'handeDropdownChange',
    'current-page',
    'size-change',
  ])

  // 接收父组件传递的参数
  let props = defineProps({
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    dropdownList: {
      type: Array,
      default: () => [
        {
          command: 'sort-by',
          divided: false,
          label: '以此排序',
          icon: Sort,
        },
        {
          command: 'move-left',
          divided: true,
          label: '向左移动',
          icon: ArrowLeftBold,
        },
        {
          command: 'move-right',
          divided: false,
          label: '向右移动',
          icon: ArrowRightBold,
        },
        {
          command: 'left-insert-column',
          divided: false,
          label: `左侧插入列`,
          icon: DArrowLeft,
        },
        {
          command: 'right-insert-column',
          divided: false,
          label: `右侧插入列`,
          icon: DArrowRight,
        },
        {
          command: 'unfreeze',
          divided: false,
          label: `取消冻结`,
          icon: Notebook,
        },
        {
          command: 'remove-column',
          divided: false,
          label: `移除此列`,
          icon: Delete,
        },
      ],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    tableTitle: {
      type: String,
      default: '产品',
    },
    rowKey: {
      type: String,
      default: 'id',
    },
    border: {
      type: Boolean,
      default: true,
    },
    // 是否展示表头-默认展示
    isShowHeader: {
      type: Boolean,
      default: true,
    },
    // 已选项
    multipleSelection: {
      type: Array,
      default: () => [],
    },
    // 表头是否展示Tag 模式
    headerTag: {
      type: Boolean,
      default: false,
    },
  })

  // 列表数据
  const list = computed(() => {
    let arr = JSON.parse(JSON.stringify(props.data))
    return arr.splice((currentPage1.value - 1) * 10, 10)
  })

  // 提取重复的部分，用于设置默认值
  function setDefaultValue(item) {
    if (item.valueType === 'input') {
      return item.inputModel
    } else if (item.valueType === 'radio-button') {
      return item.radioModel
    } else if (item.valueType === 'select') {
      return item.selectModel
    }
    return null
  }

  const formSearchData = computed(() => {
    const search = []
    const obj = reactive({})
    for (let item of props.columns) {
      if (item.inSearch) {
        obj[item.name] = null // 设置默认值为null
        obj[item.name] = setDefaultValue(item) // 根据valueType设置对应的默认值
        search.push(item)
      }
    }
    return search
  })

  const formInline = computed(() => {
    const obj = reactive({})
    for (let item of props.columns) {
      if (item.inSearch) {
        obj[item.name] = null // 设置默认值为null
        obj[item.name] = setDefaultValue(item) // 根据valueType设置对应的默认值
      }
    }
    return obj
  })
  // let obj = {}
  // let search = []
  // for (let item of props.columns) {
  //   if (item.inSearch) {
  //     obj[item.name] = null
  //     // 输入框类型默认值
  //     if (item.valueType === 'input') {
  //       obj[item.name] = item.inputModel
  //     }
  //     // 单选框类型默认值
  //     if (item.valueType === 'radio-button') {
  //       obj[item.name] = item.radioModel
  //     }
  //     // 多选框类型默认值
  //     if (item.valueType === 'select') {
  //       obj[item.name] = item.selectModel
  //     }
  //   }
  //   if (item.inSearch) {
  //     search.push(item)
  //   }
  // }
  // const formSearchData = ref(search)
  // const formInline = reactive(obj)

  const columnsList = computed(() => props.columns.filter((item: any) => !item.hide))

  // 新建产品
  const addNew = (event: any) => {
    emit('addNew', event)
    console.log('你点击了新建')
  }

  // 搜索框的值发射给给父组件
  const handeSearchChange = () => {
    emit('handeFormChange', formInline.value)
  }

  // 单选框的值发射给父组件
  const handeRadioChange = () => {
    emit('handeFormChange', formInline.value)
  }

  // 多选框的值发射给父组件
  const handeSelectChange = () => {
    emit('handeFormChange', formInline.value)
  }

  // page-size 改变时触发
  const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
    emit('size-change', val)
  }
  // current-page 改变时触发
  const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
    currentPage1.value = val
    emit('current-page', val)
  }

  //添加表头行的自定义样式。
  const customHeaderRowClass = ({ rowIndex }) => {
    // 应用自定义的表头行类名
    if (rowIndex === 0 && columnSelection.value.length) {
      return 'custom-header-row'
    }
  }

  // 多选
  const selectionChange = (val) => {
    columnSelection.value = val
    if (columnSelection.value.length == list.value.length) {
      columnSelection.value.forEach((item, index) => {
        checkedList.value[index] = true
      })
    }
    if (columnSelection.value.length == 0) {
      checkedList.value = []
    }
    emit('selection-change', val)
  }

  //鼠标移入表格当前行
  const handeCellEnter = (row, column, cell, event) => {
    // 只有在移入多选或者序列时才展示
    if (column.type === 'selection') {
      columnCheckedId.value = row.id
    }
  }

  //鼠标移出表格当前行
  const handeCellLeave = (row, column, cell, event) => {
    columnCheckedId.value = ''
  }

  // 取消选择-清空所有选择
  const handeDeselect = () => {
    tableRef.value.clearSelection()
  }

  // 选中是与否塞数据
  const cellCheckbox = (row, index) => {
    nextTick(() => {
      if (checkedList.value[index]) {
        tableRef.value.toggleRowSelection(row, true)
      } else {
        tableRef.value.toggleRowSelection(row, false)
      }
    })
  }
  // 阻止事件冒泡
  const handleEdiPreventDefault = () => {
    event.stopPropagation()
  }

  // 表头列表-点击菜单项触发的事件回调
  const handleCommand = (command: string | number | object) => {
    console.log('dropdown-item点击菜单项触发的事件回调', command)
    emit('handeDropdownChange', command)
  }
  const onSubmit = () => {
    console.log('submit!', formInline)
    emit('onSubmit', formInline)
  }
  const reset = (formEl: FormInstance | undefined) => {
    formSearchData.value.forEach((item) => {
      formInline[item.name] = null
    })
    emit('reset')
  }
  // 暴露属性|方法
  defineExpose({
    tableRef,
  })
</script>
<style scoped lang="scss">
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .zb-pro-table {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .header {
      box-sizing: border-box;
      .header-title {
        display: flex;
        align-items: center;
        padding: 0 16px;
        box-sizing: border-box;
        p {
          font-size: 22px;
          color: #333333;
          flex: 1;
        }
      }
      .header-form {
        display: flex;
        padding: 16px 16px 0 16px;
        margin: 10px 0;
        border-radius: 4px;
        background: white;
        box-shadow: 0 0 12px rgb(0 0 0 / 5%);
        .search-form {
          flex: 1;
          ::v-deep(.el-input--default) {
            width: 200px;
          }
        }
        .search {
          flex-shrink: 0;
          white-space: nowrap;
        }
      }
    }
    .footer {
      flex: 1;
      display: flex;
      padding: 16px;
      flex-direction: column;
      border-radius: 4px;
      overflow: hidden;
      background: white;
      box-shadow: 0 0 12px rgb(0 0 0 / 5%);
      min-height: 300px;
      .operator {
        margin-bottom: 15px;
      }
      .table {
        position: relative;
        flex: 1;
        .table-header-operation {
          position: absolute;
          top: 10px;
          left: 70px;
          z-index: 999;
          width: 100%;
          .operation-selection {
            display: flex;
            align-items: center;
            .deselect {
              position: absolute;
              right: 100px;
            }
          }
        }
      }
      .zb-table {
        position: absolute;
        height: 100%;
        .header-label {
          display: inline-flex;
          width: calc(100% - 24px);
          justify-content: center;
          &_left {
            justify-content: flex-start;
          }
          &_right {
            justify-content: right;
          }
        }

        .tb-dropdown-menu {
          display: flex;
          align-items: center;
        }
        :deep(.custom-header-row) {
          th {
            // 选择 custom-header-row 类下的所有 th 元素
            &:not(.el-table-column--selection) {
              // 排除 el-table-column--selection 类的 th 元素
              display: none;
            }
          }
        }
      }
    }
    ::v-deep(.el-table__header) {
      border: solid 1px #ebeef5;
    }
    ::v-deep(.el-table__header th) {
      font-size: 15px;
      font-weight: 700;
      color: #252525;
    }
    .pagination {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      padding-top: 20px;
      box-sizing: border-box;
    }
  }
</style>
