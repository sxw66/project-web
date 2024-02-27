<template>
  <el-scrollbar height="400px" style="position: relative">
    <el-form>
      <el-form-item>
        <div class="filter-header">
          <span style="font-size: 16px">筛选</span>
          <el-icon class="icon-close" size="20" @click="handleFilterChange"><Close /></el-icon>
        </div>
      </el-form-item>
      <el-form-item class="form-item" v-for="(item, idx) in filterList" :key="idx">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-select
              style="width: 100%"
              @change="handleTypeChange(item, $event)"
              v-model="item.field"
            >
              <el-option
                v-for="item in fieldList"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              />
            </el-select>
          </el-col>
          <el-col :span="13">
            <el-select
              v-show="item.status == 'orderType'"
              v-model="item.typeValue"
              style="width: 100%"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-show="item.status == 'orderStatus'"
              v-model="item.typeValue"
              style="width: 100%"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-show="item.status == 'channel'"
              v-model="item.typeValue"
              style="width: 100%"
            >
              <el-option
                v-for="item in channelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-show="item.status == 'solution'"
              v-model="item.typeValue"
              style="width: 100%"
            >
              <el-option
                v-for="item in solutionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="3">
            <div @click="handleClickDelete(idx)" class="icon-delete">
              <svg-icon color="#999" name="delete"></svg-icon>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <div class="filter-add">
          <el-icon size="18"><Plus /></el-icon>
          <span @click="handleAddFilter" class="add-text">新增筛选条件</span>
        </div>
      </el-form-item>
    </el-form>
    <div class="filter-footer">
      <el-button link type="primary" @click="resetFilter">重置</el-button>
      <div>
        <el-button @click="handleFilterChange">取消</el-button>
        <el-button @click="handleFilterChange" type="primary">确定</el-button>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
  import { watch, onMounted, onUnmounted, ref } from 'vue'
  import { useClickAway } from '@vueuse/core'
  import { fieldList, typeList, statusList, channelList, solutionList } from './direct'
  const emit = defineEmits(['FilterInfo', 'handleFilterChange'])
  const filterList = ref([
    {
      field: '',
      typeValue: '',
      status: 'orderType',
    },
  ])
  watch(
    () => filterList.value,
    (value) => {
      emit('FilterInfo', value)
    },
    {
      deep: true,
    },
  )
  const handleTypeChange = (item, value) => {
    item.status = value
    item.typeValue = ''
  }

  //新增过滤条件
  const handleAddFilter = () => {
    filterList.value.push({
      field: '',
      typeValue: '',
      status: 'orderType',
    })
  }
  //删除过滤条件
  const handleClickDelete = (idx) => {
    filterList.value?.splice(idx, 1)
  }

  //取消-关闭-确认-过滤
  const handleFilterChange = () => {
    emit('handleFilterChange', false, filterList.value)
  }

  const resetFilter = () => {
    filterList.value = [
      {
        field: '',
        typeValue: '',
        status: 'orderType',
      },
    ]
  }
  onMounted(() => {})
  defineExpose({ resetFilter })
</script>

<style scoped lang="scss">
  .form-item {
    padding: 0 20px;
    margin-top: 10px;
  }
  .filter-add {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 22px;
    color: #6698ff;
    cursor: pointer;
    user-select: none;
    padding-bottom: 50px;
    .add-text {
      margin-left: 3px;
    }
    &:hover .add-text {
      text-decoration: underline;
    }
  }
  .filter-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 40px 4px 20px;
    box-sizing: border-box;
    .icon-close {
      cursor: pointer;
      :hover {
        color: #6698ff;
      }
    }
  }
  .filter-footer {
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 4px 40px 4px 20px;
    bottom: 0px;
    background: white;
  }
</style>
