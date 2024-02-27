<template>
  <el-popover :visible="popoverShow" trigger="click" width="650px" placement="bottom-start">
    <template #reference>
      <el-button text type="primary" @click="handleClickFilter">
        <svg-icon size="15" name="filter"></svg-icon>
        <span style="margin-left: 5px">筛选</span>
      </el-button>
    </template>
    <el-scrollbar height="400px" style="position: relative">
      <el-form :model="formInDataLIst" label-width="100px" class="demo-form-screen">
        <el-form-item>
          <div class="filter-header">
            <span style="font-size: 16px">筛选</span>
            <el-icon class="icon-close" size="20" @click="handleFilterChange(false)"
              ><Close
            /></el-icon>
          </div>
        </el-form-item>
        <el-form-item v-for="(item, index) in formInDataLIst" :key="index">
          <!-- 类别 -->
          <el-select
            class="select-item"
            v-model="item.principal"
            placeholder="请选择"
            @change="handleChange"
            clearable
          >
            <el-option
              v-for="option in typeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
          <!-- 行业 -->
          <el-select
            class="last-select-item"
            v-model="item.industry"
            placeholder="请选择"
            @change="handleChange"
            clearable
          >
            <el-option
              v-for="option in industryOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
          <svg-icon
            v-if="index"
            color="#999"
            name="delete"
            @click="deleteRow(index)"
            class="icon-delete"
          ></svg-icon>
        </el-form-item>
        <el-form-item>
          <div class="filter-add flex-center">
            <el-icon size="18"><Plus /></el-icon>
            <span @click="handleAddFilter" class="add-text">新增筛选条件</span>
          </div>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div class="filter-footer flex-justify-between">
      <el-button link type="primary" @click="resetFilter">重置</el-button>
      <div>
        <el-button @click="handleFilterChange(false)">取消</el-button>
        <el-button @click="handleFilterChange(true)" type="primary">确定</el-button>
      </div>
    </div>
  </el-popover>
  <span class="filtrate-text">{{ amount }}条需求</span>
</template>

<script setup lang="ts">
  import { watch, onMounted, onUnmounted, ref } from 'vue'
  import { Check, Delete } from '@element-plus/icons-vue'
  import { typeOptions, industryOptions } from '@/utils/public-data'
  // 接收父组件传递的参数
  let props = defineProps({
    amount: {
      type: Number,
      default: 0,
    },
  })
  const popoverShow = ref(false) // 筛选的弹框状态
  const emit = defineEmits(['handleFilterChange'])
  const formInDataLIst = ref([
    {
      principal: 4,
      industry: '',
    },
  ])

  // 回显选中过滤样式
  const handleClickFilter = () => {
    popoverShow.value = true
  }
  // 将属性值添加到该属性对应的数组中；如果属性不存在，我们创建一个新的数组，并将属性值添加到其中
  const combineProperties = (arr) => {
    const result = {}
    const uniqueValues = new Set()
    arr.forEach((obj) => {
      for (const key in obj) {
        const value = obj[key]
        if (!uniqueValues.has(value)) {
          if (result.hasOwnProperty(key)) {
            result[key].push(value)
          } else {
            result[key] = [value]
          }
          uniqueValues.add(value)
        }
      }
    })
    for (const key in result) {
      result[key] = result[key].join(',')
    }
    return result
  }

  // 新增筛选
  const handleAddFilter = () => {
    formInDataLIst.value.push({
      principal: '',
      industry: '',
    })
  }

  // 选择
  const handleChange = (index) => {
    console.log('Selected option:', formInDataLIst.value)
  }

  // 重置
  const resetFilter = () => {
    formInDataLIst.value = [
      {
        principal: 4,
        industry: '',
      },
    ]
  }

  //删除过滤条件
  const deleteRow = (idx) => {
    formInDataLIst.value?.splice(idx, 1)
  }

  //取消-关闭-确认-过滤
  const handleFilterChange = (state) => {
    const mergedObj = combineProperties(formInDataLIst.value)
    emit('handleFilterChange', mergedObj, state)
    popoverShow.value = false
  }
</script>

<style scoped lang="scss">
  .filtrate-text {
    color: #999;
    margin-left: 15px;
  }
  .demo-form-screen {
    padding: 0px 20px;
    .filter-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      .icon-close {
        cursor: pointer;
        :hover {
          color: #6698ff;
        }
      }
    }
    .last-select-item {
      min-width: 350px;
    }
    .select-item {
      width: 160px;
      margin-right: 15px;
    }
    .icon-delete {
      margin-left: 25px;
    }
    .filter-add {
      color: #6698ff;
      cursor: pointer;
      user-select: none;
      padding-bottom: 30px;
      .add-text {
        margin-left: 3px;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .filter-footer {
    box-sizing: border-box;
    padding: 5px 20px;
  }
</style>
