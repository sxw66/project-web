<template>
  <div class="block-box">
    <div class="header">
      <div class="search-wraper">
        <el-input
          style="width: 200px"
          placeholder="搜索"
          :prefix-icon="Search"
          v-model="searchInfo"
          clearable
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
        >
        </el-input>
        <el-select
          placeholder="启用状态"
          class="custom-select"
          clearable
          v-model="searchStatus"
          @change="handleStatusChange"
        >
          <el-option
            v-for="item in statusList"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="trigger-btn">
        <el-button style="width: 100%" type="primary" @click="handleAddTrigger">
          新建触发器
        </el-button>
      </div>
    </div>
    <div class="content-container">
      <el-table
        :data="tableInfo.list"
        style="width: 100%"
        header-row-class-name="custom-header"
        @cell-mouse-enter="handleCellMouseEnter"
        @cell-mouse-leave="handleCellMouseLeave"
      >
        <template v-for="item in tableInfo.colunm" :key="item.prop">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :align="item?.align ?? 'left'"
            :width="item?.width"
          >
            <template #default="{ row, column }">
              <div v-if="column.label == '启用状态'">
                <span class="enable-status" :class="{ 'disabled-status': row.status == '0' }">
                  {{ row.status == '1' ? '启用' : '禁用' }}
                </span>
              </div>
              <div v-else-if="column.label == ''">
                <DropdownMenu
                  v-show="row.showMore"
                  popper-class="custom-dropdown"
                  :items="draggableMenuList"
                  @command="handleCommand"
                  @visible-change="handleVisibleChange"
                >
                  <template #dropdownTrigger>
                    <div>
                      <el-tooltip :enterable="false" content="更多" placement="top">
                        <div class="more-wraper">
                          <svg-icon
                            size="20"
                            class="more"
                            :class="{ 'more-actived': isShowMore }"
                            @click="handleClickMore(row)"
                            name="more"
                          />
                        </div>
                      </el-tooltip>
                    </div>
                  </template>
                </DropdownMenu>
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <AddTriggerForm v-model="showAddTriggerForm"></AddTriggerForm>
  </div>
</template>

<script setup lang="ts" name="card">
  import { ref, reactive, shallowRef, watch, onMounted, defineAsyncComponent } from 'vue'
  import { Search, VideoPlay, Edit, DocumentCopy, Delete, Hide } from '@element-plus/icons-vue'
  import DropdownMenu from '@/components/DropdownMenu/index.vue'
  const AddTriggerForm = defineAsyncComponent(() => import('./add.trigger.vue'))
  const searchInfo = ref('')
  const searchStatus = ref('')
  const showAddTriggerForm = ref(false)
  const statusList = [
    {
      label: '启用',
      value: '1',
    },
    {
      label: '禁用',
      value: '0',
    },
  ]
  const draggableMenuList = shallowRef([
    {
      label: '启用',
      command: 'enable',
      icon: VideoPlay,
    },
    {
      label: '编辑',
      command: 'disabled',
      divided: 'divided',
      icon: Edit,
    },
    {
      label: '复制',
      command: 'copy',
      icon: DocumentCopy,
    },
    {
      label: '删除',
      command: 'delete',
      icon: Delete,
    },
  ])
  const tableInfo: any = reactive({
    list: [
      {
        name: '关联工作项',
        trigger: '设计',
        status: '1',
        showMore: false,
      },
      {
        name: '测试',
        trigger: '设计',
        status: '1',
        showMore: false,
      },
      {
        name: '工时',
        trigger: '设计',
        status: '1',
        showMore: false,
      },
      {
        name: 'Branches',
        trigger: '设计',
        status: '1',
        showMore: false,
      },
      {
        name: 'Commits',
        trigger: '设计',
        status: '0',
        showMore: false,
      },
      {
        name: 'Pull Requests',
        trigger: '设计',
        status: '1',
        showMore: false,
      },
    ],
    colunm: [
      {
        prop: 'name',
        label: '名称',
      },
      {
        prop: 'trigger',
        label: '触发栏',
      },
      {
        prop: 'status',
        label: '启用状态',
      },
      {
        prop: 'operation',
        label: '',
        width: '50',
      },
    ],
  })
  const staticList = []
  onMounted(() => {
    Object.assign(staticList, tableInfo.list)
  })
  const handleKeyup = (e) => {
    if (e.keyCode == '13') {
      tableInfo.list = searchInfo.value
        ? tableInfo.list.filter((item) =>
            item.name.toLowerCase().includes(searchInfo.value.toLowerCase()),
          )
        : staticList
    }
  }
  //搜索框获取焦点时触发
  const handleSearchFocus = () => {
    window.addEventListener('keyup', handleKeyup)
  }
  //搜索框失去焦点时触发
  const handleSearchBlur = () => {
    window.removeEventListener('keyup', handleKeyup)
  }
  //选择状态改变时触发
  const handleStatusChange = (e) => {
    tableInfo.list = staticList
    tableInfo.list = e ? tableInfo.list.filter((item) => item.status == e) : staticList
  }
  const handleAddTrigger = () => {
    showAddTriggerForm.value = true
    console.log('新增触发器')
  }
  const isShowMore = ref(false)
  const clickShowMore = ref(false)
  watch(
    () => isShowMore.value,
    (value) => {
      if (!value) {
        !clickShowMore.value &&
          tableInfo.list.forEach((item) => {
            item.showMore = false
          })
      }
    },
  )
  watch(
    () => clickShowMore.value,
    (value) => {
      if (!value) {
        tableInfo.list.forEach((item) => {
          item.showMore = false
        })
      }
    },
  )
  const handleCellMouseEnter = (row) => {
    if (isShowMore.value) {
      return
    }
    row.showMore = true
    clickShowMore.value = false
  }
  const handleCellMouseLeave = (row) => {
    if (isShowMore.value) {
      return
    }
    row.showMore = false
    clickShowMore.value = false
  }
  const handleClickMore = (row) => {
    if (row.showMore) {
      clickShowMore.value = true
      row.showMore = true
    }
    if (row.status == '启用') {
      draggableMenuList.value.shift()
      draggableMenuList.value.unshift({ command: 'disabled', label: '禁用', icon: Hide })
    } else {
      draggableMenuList.value.shift()
      draggableMenuList.value.unshift({ command: 'enble', label: '启用', icon: VideoPlay })
    }
  }
  const handleVisibleChange = (visible) => {
    isShowMore.value = visible
  }
  const handleCommand = (command) => {
    console.log(command, 'command')
  }
</script>

<style scoped lang="scss">
  :global(.custom-dropdown .el-dropdown-menu) {
    width: 200px;
  }
  .block-box {
    width: 100%;
    height: 100%;
    .header {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      .search-wraper {
        flex: 1;
        display: flex;
        .custom-select {
          width: 120px;
          margin-left: 20px;
        }
      }
      .trigger-btn {
        width: 100px;
      }
    }
    .content-container {
      width: 100%;
      //   height: 510px;
      //   border: 1px solid;
      .enable-status {
        color: #6698ff;
      }
      .disabled-status {
        color: #cacaca;
      }
      .more-wraper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 100%;
        &:has(:hover, .more-actived) {
          background-color: #e8f3ff;
        }
        .more {
          &:hover {
            color: #6698ff;
            background-color: #e8f3ff;
          }
        }
        .more-actived {
          color: #6698ff;
          background-color: #e8f3ff;
        }
      }
    }
  }
  :deep(.el-table__header) {
    .custom-header {
      th {
        background-color: #fff !important;
        color: #666;
        font-size: 14px;
        font-weight: normal;
      }
    }
  }
</style>
