<template>
  <div class="select-box">
    <el-row>
      <el-col :span="24">
        <el-tree
          ref="RefTree"
          :data="memberList"
          node-key="id"
          :default-expand-all="true"
          :check-on-click-node="true"
          show-checkbox
          :props="{ label: 'label', children: 'children' }"
          @node-click="handleNodeClick"
        >
          <template #default="{ data }">
            <div style="margin: 10px 0">
              <!-- 区分中英文名称 -->
              <span :style="{ background: data.bgc }" class="member-bgc">
                {{ data.label?.substring(0, 2)?.toUpperCase() }}
              </span>
              <span>{{ data.label }}</span>
            </div>
          </template>
        </el-tree>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import { ref, withDefaults, watch, nextTick, onMounted } from 'vue'
  interface Iprops {
    searchInfo: string
    multiple?: boolean
  }
  const emit = defineEmits(['select-change', 'radio-change'])
  const props = withDefaults(defineProps<Iprops>(), {
    searchInfo: '',
    multiple: true,
  })
  const RefTree = ref()
  const memberList = ref([
    {
      label: '彭峰',
      id: '1',
      bgc: '#9a7ff2',
      unit: 'member',
    },
    {
      label: 'loash',
      id: '2',
      bgc: '#fd9e76',
      unit: 'member',
    },
  ])
  const list = []
  onMounted(() => {
    Object.assign(list, memberList.value)
  })
  // 过滤数据
  watch(
    () => props.searchInfo,
    (value) => {
      if (value !== '') {
        memberList.value = memberList.value.filter((item) => item.label.includes(value))
        return
      }
      memberList.value = list
    },
  )
  //已有的数据
  const checkedList: any = ref([])
  //点击节点选中
  const handleNodeClick = (data: any, current) => {
    //多选
    if (props.multiple) {
      if (current.checked) {
        checkedList.value.push({ ...data, date: Date.now() })
      } else {
        let idx = checkedList.value.findIndex((item) => item.id == data.id)
        checkedList.value.splice(idx, 1)
      }
      emit('select-change')
    } else {
      //单选
      if (current.checked) {
        nextTick(() => {
          // RefTree.value.setCheckedKeys([])
          // checkedList.value = []
          // checkedList.value.push({ ...data })
          RefTree.value.setCheckedKeys([data.id])
          emit('radio-change', data)
        })
      } else {
        nextTick(() => {
          RefTree.value.setCheckedKeys([])
          emit('radio-change', [])
        })
      }
    }
  }
  //回显
  const handleSetNodeKeys = (data) => {
    nextTick(() => {
      const list =
        Array.isArray(data) && data?.length > 0
          ? data?.map((item) => (typeof item != 'string' ? item.id : item))
          : []
      RefTree.value.setCheckedKeys(list)
      const reflow = RefTree.value.getCheckedNodes().map((item) => ({ ...item, date: Date.now() }))
      checkedList.value = [...reflow]
      // props.multiple && emit('select-change')
      emit('select-change')
    })
  }
  //删除数据
  const handleDeleteMemberList = (data) => {
    const list = checkedList.value.filter((item) => item.id !== data.id).map((item) => item.id)
    const idx = checkedList.value.findIndex((item) => item.id === data.id)
    checkedList.value.splice(idx, 1)
    nextTick(() => {
      RefTree.value.setCheckedKeys(list)
      emit('select-change')
    })
  }
  //获取已勾选的数据
  const handleGetMemberList = () => checkedList.value
  //清空数据
  const handleSetMemberList = () => {
    nextTick(() => {
      RefTree.value.setCheckedKeys([])
    })
  }
  defineExpose({
    handleSetNodeKeys,
    handleDeleteMemberList,
    handleGetMemberList,
    handleSetMemberList,
  })
</script>

<style scoped lang="scss">
  .select-box {
    width: 100%;
    height: 200px;
    overflow-y: scroll;
    .member-bgc {
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
    :deep(.el-tree-node__content) {
      position: relative;
      height: 40px;
      margin: 4px 0;
      padding-left: 10px !important;
      user-select: none;
      .el-checkbox__inner {
        border: none;
        background: transparent;
      }
      .el-checkbox__inner::after {
        border-color: #1e80ff;
      }
      .el-checkbox,
      .el-checkbox.is-checked {
        position: absolute;
        right: 4px;
      }
      .el-tree-node__expand-icon {
        display: none;
      }
    }
  }
</style>
