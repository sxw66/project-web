<template>
  <div class="tb-header">
    <el-dropdown trigger="click" @command="handleCommandState" @visible-change="handeDropdownShow">
      <span class="el-dropdown-link">
        <el-icon><Operation /></el-icon>
        变更状态
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-input
            v-model="input"
            clearable
            :prefix-icon="Search"
            class="dropdown-menus-input"
            placeholder="请输入"
            @input="handleInput"
          />
          <div class="seacrh-dropdown">
            <el-dropdown-item
              v-for="(item, index) in filteredOptions"
              :key="index"
              :command="item.command"
              :divided="item.divided"
              :icon="item.icon"
              :disabled="item.disabled"
              style="padding: 10px 20px"
            >
              <el-tag :key="item.label" :color="item.color" effect="light" round>
                {{ item.label }}
              </el-tag>
            </el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        <el-icon><Check /></el-icon>
        移入基线
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-input
            v-model="input"
            clearable
            :prefix-icon="Search"
            class="dropdown-menus-input"
            placeholder="请输入"
          />
          <div class="seacrh-dropdown">
            <el-dropdown-item
              v-for="(item, index) in operationOptions"
              :key="index"
              :command="item.command"
              :divided="item.divided"
              :icon="item.icon"
              :disabled="item.disabled"
              style="padding: 10px 20px"
            >
              <div class="base-line">
                <div class="base-line_label">{{ item.label }}</div>
                <el-button type="primary" size="small" round>打开</el-button>
              </div>
            </el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
  // 在子组件内处理数据交互
  import { ref, reactive, onMounted, nextTick } from 'vue'
  import { ArrowDown, Search, Check, Operation, Plus } from '@element-plus/icons-vue'
  // 表格列表-等级
  import { operationOptions } from '@/utils/public-data'
  // 接收父组件传递的参数
  let props = defineProps({
    multipleIds: {
      type: Array,
      default: () => [],
    },
  })
  // 分发事件给父组件
  // const emit = defineEmits(['test...'])

  const input = ref('')
  // 变更状态
  const changeStateData = ref(operationOptions)
  // 过滤后的变更状态
  const filteredOptions = ref([])
  // 过滤输入框
  const handleInput = (value) => {
    if (value) {
      filteredOptions.value = changeStateData.value.filter((option) => option.label.includes(value))
    } else {
      filteredOptions.value = changeStateData.value
    }
  }

  // 变更状态
  const handleCommandState = (command: string | number | object) => {
    console.log('======', command)
    // 产品信息
    if (command === 'productInformation') {
      console.log('产品信息')
    }
  }

  // 下拉框出现/隐藏时触发
  const handeDropdownShow = (val) => {
    if (!val) {
      input.value = ''
      filteredOptions.value = []
      filteredOptions.value = changeStateData.value
    }
  }

  onMounted(() => {
    filteredOptions.value = changeStateData.value
    console.log('multipleIds', props.multipleIds)
  })
</script>

<style scoped lang="scss">
  .tb-header {
    display: flex;
    align-items: center;
  }
  .el-dropdown-link {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 0 15px;
  }
  .seacrh-dropdown {
    max-height: 280px;
    min-height: 60px;
    overflow-y: auto;
  }
  .base-line {
    display: flex;
    align-items: center;
    width: 100%;
    &_label {
      flex: 1;
    }
  }

  .dropdown-menus-input {
    width: 260px;
    display: flex;
    padding: 20px 20px 10px;
  }
</style>
