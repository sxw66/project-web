<template>
  <div class="department-box">
    <el-tree
      ref="RefTree"
      :data="departmentList"
      node-key="id"
      :props="{ label: 'label', children: 'children' }"
      :accordion="!multiple"
      show-checkbox
      highlight-current
      :check-strictly="!multiple"
      :filter-node-method="filterNode"
      @check="handleCheck"
      @check-change="handleCheckChange"
      :class="{ 'department-tree': !multiple }"
    >
      <template #default="{ data }">
        <div class="custom-row">
          <!-- 区分部门和个人 -->
          <div class="custom-row-item" v-if="data.level == 0">
            <svg-icon class="team-svg" name="company" color="#999"></svg-icon>
            <span v-if="data.label?.length > 7">{{ `${data.label.substring(0, 7)}...` }}</span>
            <span v-else>{{ data.label }}</span>
            <span class="custom-row-point">.</span>
            <span>{{ data.children?.length ?? '' }}</span>
          </div>
          <div v-else>
            <!-- 区分名称中英文 -->
            <span :style="{ background: data.bgc }" class="department-bgc">
              {{
                reg.test(data.label)
                  ? data.label?.substring(0, 2)?.toUpperCase()
                  : data.label.slice(-2)
              }}
            </span>
            <span>{{ data.label }}</span>
          </div>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script setup lang="ts">
  import { ref, nextTick, withDefaults, watch, onMounted } from 'vue'
  interface Iprops {
    searchInfo?: any
    status?: boolean
    multiple?: boolean
  }
  const props = withDefaults(defineProps<Iprops>(), {
    searchInfo: [],
    status: false,
    multiple: true,
  })
  const list = []
  const reg = /[a-z,A-Z]/
  const emit = defineEmits(['select-change', 'radio-change'])
  const RefTree = ref()
  //已有的数据
  const checkedList: any = ref([])
  //处理多次触发删除的开关
  const delChange = ref(false)
  const departmentList = ref([
    {
      id: '011',
      label: '深圳致赢科技有限公司',
      level: 0,
      unit: 'department',
      children: [
        {
          id: '0111',
          label: '彭峰4',
          level: 1,
          unit: 'department',
          bgc: '#9a7ff2',
        },
        {
          id: '0112',
          label: 'loash',
          level: 1,
          unit: 'department',
          bgc: '#fd9e76',
        },
      ],
    },
    {
      id: '003',
      label: '软件部门',
      level: 0,
      unit: 'department',
      children: [],
    },
    {
      id: '002',
      label: '测试部门',
      level: 0,
      unit: 'department',
      children: [
        {
          id: '0023',
          label: '彭峰1',
          level: 1,
          unit: 'department',
          bgc: '#9a7ff2',
        },
        {
          id: '0024',
          label: '彭峰2',
          level: 1,
          unit: 'department',
          bgc: '#9a7ff2',
        },
      ],
    },
  ])
  onMounted(() => {
    Object.assign(list, departmentList.value)
  })
  //过滤
  watch(
    () => props.searchInfo,
    (value) => {
      if (value != '') {
        departmentList.value = departmentList.value?.filter((item) => item.label.includes(value))
        return
      }
      departmentList.value = list
    },
    {
      deep: true,
    },
  )
  //处理多次触发删除的开关
  watch(
    () => props.status,
    (value) => {
      delChange.value = value
    },
    {
      immediate: true,
    },
  )
  //过滤节点
  const filterNode = (...arg) => {
    console.log(arg, 'arg')
    return true
  }
  //tree change时触发函数
  const handleCheckChange = (data, current) => {
    //多选
    if (props.multiple) {
      //渲染列表删除时多次触发开关
      if (delChange.value) {
        return
      }
      if (!current) {
        let idx = checkedList.value.findIndex((item) => item.id == data.id)
        checkedList.value.splice(idx, 1)
      }
      emit('select-change')
    } else {
      //单选
      if (current) {
        nextTick(() => {
          RefTree.value.setCheckedKeys([])
          checkedList.value = []
          checkedList.value = [{ ...data }]
          RefTree.value.setCheckedKeys([data.id])
          emit('radio-change', data)
        })
      } else {
        RefTree.value.setCheckedKeys([])
        checkedList.value = []
        emit('radio-change', [])
      }
    }
  }
  //选中触发
  const handleCheck = (data, node) => {
    if (delChange.value) {
      return
    }
    if (node.checkedNodes.length) {
      checkedList.value = []
      node.checkedNodes.forEach((item) => {
        if (item.level != 0) {
          checkedList.value.push({ ...item, date: Date.now() })
        }
      })
    }
    emit('select-change')
  }
  //回显
  const handleSetNodeKeys = (data) => {
    nextTick(() => {
      const list =
        Array.isArray(data) && data?.length > 0
          ? data?.map((item) => (typeof item != 'string' ? item.id : item))
          : []
      RefTree.value.setCheckedKeys(list)
      const reflow = RefTree.value.getCheckedNodes()?.map((item) => ({ ...item, date: Date.now() }))
      checkedList.value = [...reflow]
      // props.multiple && emit('select-change')
      emit('select-change')
    })
  }
  //获取数据列表
  const handleGetDepartmentList = () => checkedList.value
  //手动删除数据
  const handleDeleteDepartmentList = (data) => {
    const idx = checkedList.value.findIndex((item) => item.id == data.id)
    checkedList.value?.splice(idx, 1)
    const listKey = checkedList.value?.filter((item) => item.id !== data.id)?.map((item) => item.id)
    RefTree.value.setCheckedKeys(listKey)
    emit('select-change')
  }
  //
  const handleSetDepartmentList = () => {
    nextTick(() => {
      RefTree.value.setCheckedKeys([])
    })
  }
  defineExpose({
    handleSetNodeKeys,
    handleGetDepartmentList,
    handleDeleteDepartmentList,
    handleSetDepartmentList,
  })
</script>

<style scoped lang="scss">
  .department-box {
    width: 100%;
    height: 200px;
    overflow-y: scroll;
    .custom-row {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 40px;
      &-item {
        display: flex;
        align-items: center;
        .custom-row-point {
          display: inline-block;
          width: 5px;
          height: 10px;
          line-height: 1px;
          margin: 0 3px;
        }
      }
      .department-bgc {
        display: inline-block;
        text-align: center;
        color: #fff;
        width: 27px;
        height: 27px;
        line-height: 27px;
        font-size: 12px;
        margin-right: 10px;
        border-radius: 50%;
      }
      .team-svg {
        margin-right: 6px;
      }
    }
    :deep(.el-tree-node__content) {
      position: relative;
      height: 40px;
      margin: 4px 0;
      padding-left: 10px !important;
      user-select: none;
    }
  }
  :deep(.el-tree-node__content) {
    height: 40px;
    font-size: 14px;
  }
  :deep(.department-tree) > .el-tree-node > .el-tree-node__content .el-checkbox {
    display: none;
  }
</style>
