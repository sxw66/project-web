<template>
  <div class="schedule-edit-header flex-justify-between">
    <div class="left-header">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="previousRoutePath">{{ fristBreadcrumbTitle }}</el-breadcrumb-item>
        <el-dropdown
          trigger="click"
          @command="handleCommandState"
          @visible-change="handeDropdownShow"
        >
          <span class="el-dropdown-link">
            <el-breadcrumb-item>
              {{ scheduleBreadcrumbTitle }}
              <el-icon><ArrowDownBold /></el-icon>
            </el-breadcrumb-item>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-input
                v-model="searchHeader"
                clearable
                :suffix-icon="Search"
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
                  >{{ item.label }}
                </el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-breadcrumb>
    </div>
    <div class="right-header flex-align-center">
      <el-button type="primary" :icon="Plus">选择需求</el-button>
      <el-divider direction="vertical" />
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-icon :size="23" class="el-icon--right">
            <Menu />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :icon="Expand">导入需求</el-dropdown-item>
            <el-dropdown-item :icon="Fold">导出需求</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watchEffect } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import {
    Expand,
    Fold,
    Search,
    ArrowRight,
    ArrowDownBold,
    Menu,
    Plus,
  } from '@element-plus/icons-vue'

  // 表格列表-等级
  import { plannedStatusOptions } from '@/utils/public-data'

  // 接收父组件传递的参数
  let props = defineProps({
    fristBreadcrumbTitle: {
      type: String,
      default: '',
    },
    scheduleBreadcrumbTitle: {
      type: String,
      default: '',
    },
  })

  const route = useRoute()
  const router = useRouter()
  // 获取上一个页面的路由信息
  const previousRoutePath = ref('/product/test/schedule')
  // 搜索值过滤条件
  const searchHeader = ref('')
  // 计划下拉列表初始数据源
  const changeStateData = ref(plannedStatusOptions)
  // 过滤后的计划状态
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
      searchHeader.value = ''
      filteredOptions.value = changeStateData.value
    }
  }
  onMounted(() => {
    filteredOptions.value = changeStateData.value
  })
</script>
<style lang="scss" scoped>
  .schedule-edit-header {
    border-bottom: 1px solid #eee;
    background: #fff;
    padding: 0 20px;
    height: 48px;
    box-sizing: border-box;
    .left-header {
      .el-breadcrumb {
        .el-breadcrumb__item {
          font-size: 17px;
        }
      }
    }
    .right-header {
      .el-divider {
        margin: 0 16px;
      }
    }
  }
  .dropdown-menus-input {
    width: 260px;
    display: flex;
    padding: 20px 20px 10px;
  }
</style>
