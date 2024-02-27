<template>
  <div class="team-box">
    <el-tree
      ref="RefTree"
      :data="teamList"
      node-key="id"
      :props="{ label: 'label', children: 'children' }"
      :check-strictly="true"
      show-checkbox
      highlight-current
      @check-change="handleCheckChange"
    >
      <template #default="{ data }">
        <div class="custom-row">
          <!-- 区分团队和个人svg -->
          <div class="custom-row-item" v-if="data.level == 0">
            <svg-icon class="team-svg" name="team" color="#5dcfff"></svg-icon>
            <span>{{ data.label }}</span>
            <span class="custom-row-point">.</span>
            <span>{{ data.children?.length ?? '' }}</span>
          </div>
          <div v-else>
            <!-- 区分名称中英文 -->
            <span :style="{ background: data.bgc }" class="team-bgc">
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
  import { ref, withDefaults, watch, nextTick, onMounted } from 'vue'
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
  const reg = /[a-z,A-Z]/
  const emit = defineEmits(['select-change'])
  const reflowKeys: any = ref([])
  const RefTree = ref()
  //处理多次触发删除的开关
  const delChange = ref(false)
  const list = []
  const teamList = ref([
    {
      id: '01',
      label: '测试团队',
      level: 0,
      unit: 'team',
      children: [
        {
          id: 'ss1',
          label: '彭峰4',
          level: 1,
          unit: 'team',
          bgc: '#9a7ff2',
        },
        {
          id: 'ss2',
          label: 'loash',
          level: 1,
          unit: 'team',
          bgc: '#fd9e76',
        },
      ],
    },
    {
      id: '02',
      label: '测试团队2',
      level: 0,
      unit: 'team',
      children: [
        {
          id: 'ss3',
          label: '彭峰1',
          level: 1,
          unit: 'team',
          bgc: '#9a7ff2',
        },
        {
          id: 'ss4',
          label: '彭峰2',
          level: 1,
          unit: 'team',
          bgc: '#9a7ff2',
        },
      ],
    },
  ])
  onMounted(() => {
    Object.assign(list, teamList.value)
  })
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
  //过滤
  watch(
    () => props.searchInfo,
    (value) => {
      if (value != '') {
        teamList.value = teamList.value?.filter((item) => item.label.includes(value))
        return
      }
      teamList.value = list
    },
    {
      deep: true,
    },
  )
  //已选中的数据
  const checkedList: any = ref([])
  //tree change时触发函数
  const handleCheckChange = (data, current) => {
    //渲染列表删除时多次触发开关
    if (delChange.value) {
      return
    }
    // 添加
    if (current) {
      checkedList.value.push({ ...data, date: Date.now() })
    } else {
      //删除
      nextTick(() => {
        let idx = checkedList.value.findIndex((item) => item.id == data.id)
        checkedList.value.splice(idx, 1)
      })
    }
    emit('select-change')
  }
  //回显
  const handleSetNodeKeys = (data) => {
    const list =
      Array.isArray(data) && data?.length > 0
        ? data?.map((item) => (typeof item != 'string' ? item.id : item))
        : []
    nextTick(() => {
      RefTree.value.setCheckedKeys(list)
      const reflow = RefTree.value.getCheckedNodes().map((item) => ({ ...item, date: Date.now() }))
      checkedList.value = [...reflow]
      emit('select-change')
    })
  }
  //手动删除数据
  const handleDeleteTeamList = (data) => {
    nextTick(() => {
      const idx = checkedList.value.findIndex((item) => item.id == data.id)
      checkedList.value?.splice(idx, 1)
      const listKey = checkedList.value
        ?.filter((item) => item.id !== data.id)
        ?.map((item) => item.id)
      RefTree.value.setCheckedKeys(listKey)
    })
    emit('select-change')
  }
  //获取列表
  const handleGetTeamList = () => checkedList.value
  //
  const handleSetTeamList = () => {
    nextTick(() => {
      RefTree.value.setCheckedKeys([])
    })
  }
  defineExpose({ handleSetNodeKeys, handleDeleteTeamList, handleGetTeamList, handleSetTeamList })
</script>

<style scoped lang="scss">
  .team-box {
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
      .team-bgc {
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
  }
  :deep(.el-tree-node__content) {
    height: 40px;
    font-size: 14px;
    margin: 4px 0;
  }
</style>
