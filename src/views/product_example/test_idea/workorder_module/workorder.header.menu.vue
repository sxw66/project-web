<template>
  <div class="header-menu-box">
    <el-dropdown
      trigger="click"
      @command="handleCommandState"
      @visible-change="handeDropdownStatus"
    >
      <div class="change-status">
        <el-icon style="margin-right: 4px"><Operation /></el-icon>
        变更状态
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-input
            v-model="statusSearchInfo"
            clearable
            :prefix-icon="Search"
            style="width: 260px; display: flex; padding: 20px 20px 10px"
            placeholder="请输入"
            @input="handleStatusInput"
          />
          <div class="status-dropdown-content">
            <el-dropdown-item
              v-for="(item, index) in statusList"
              :key="index"
              :command="item.value"
              :disabled="item.disabled"
              style="padding: 10px 20px"
            >
              <el-tag style="color: #fff" :key="item.label" :color="item.bgc" round>
                {{ item.label }}
              </el-tag>
            </el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown trigger="click" @command="handleCommandBasic" @visible-change="handeDropdownBasic">
      <div class="move-basic">
        <el-icon style="margin-left: 20px; margin-right: 4px"><Tickets /></el-icon>
        移入基线
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-input
            v-model="basicSearchInfo"
            clearable
            :prefix-icon="Search"
            style="width: 260px; display: flex; padding: 20px 20px 10px"
            placeholder="请输入"
            @input="handleBasicInput"
          />
          <div class="basic-dropdown-content">
            <el-dropdown-item
              v-for="(item, index) in basicList"
              :key="index"
              :command="item.value"
              :disabled="item.disabled"
              style="width: 100%; padding: 10px 20px; box-sizing: border-box"
            >
              <div class="basic-content">
                <span>{{ item.label }}</span>
                <el-button size="small" type="primary" round>打开</el-button>
              </div>
            </el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown
      trigger="click"
      @command="handleCommandSchedules"
      @visible-change="handeDropdownSchedules"
    >
      <div class="demand-schedules">
        <el-icon style="margin-left: 20px; margin-right: 4px"><Compass /></el-icon>
        需求排期
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-input
            v-model="schedulesSearchInfo"
            clearable
            :prefix-icon="Search"
            style="width: 260px; display: flex; padding: 20px 20px 10px"
            placeholder="请输入"
            @input="handleSchedulesInput"
          />
          <div class="schedules-dropdown-content">
            <el-dropdown-item
              v-for="(item, index) in schedulesList"
              :key="index"
              :command="item.value"
              :disabled="item.disabled"
              style="width: 100%; padding: 10px 20px; box-sizing: border-box"
            >
              <div class="schedules-content">
                <span>{{ item.label }}</span>
              </div>
            </el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown trigger="click" @command="handleCommandMore">
      <div class="more">
        <el-icon style="margin-left: 20px; margin-right: 4px"><More /></el-icon>
        更多
      </div>
      <template #dropdown>
        <el-dropdown-menu class="custom-dropdown-menu">
          <el-dropdown-item
            v-for="(item, index) in moreList"
            :key="index"
            :command="item"
            :icon="item.icon"
            :divided="item.divided"
            :disabled="item.disabled"
            style="width: 100%; box-sizing: border-box"
          >
            <span>{{ item.label }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { Compass, More, Tickets, Search, Operation } from '@element-plus/icons-vue'
  const emit = defineEmits(['changeMore'])
  const statusSearchInfo = ref('')
  const basicSearchInfo = ref('')
  const schedulesSearchInfo = ref('')
  const statusList = ref([
    {
      label: '待评审',
      value: '0',
      disabled: false,
      bgc: '#5aacf9',
    },
    {
      label: '已计划',
      value: '1',
      disabled: false,
      bgc: '#fd9e76',
    },
    {
      label: '进行中',
      value: '2',
      disabled: false,
      bgc: '#f5c560',
    },
    {
      label: '已完成',
      value: '3',
      disabled: false,
      bgc: '#76d899',
    },
    {
      label: '已关闭',
      value: '4',
      disabled: false,
      bgc: '#d4d4d4',
    },
  ])
  const basicList = ref([
    {
      label: '实例基线1',
      value: '0',
      disabled: false,
    },
  ])
  const schedulesList = ref([
    {
      label: '待排期需求',
      value: '0',
      icon: '',
      disabled: false,
    },
    {
      label: '账号管理',
      value: '1',
      icon: '',
      disabled: false,
    },
    {
      label: '购物车',
      value: '2',
      icon: '',
      disabled: false,
    },
    {
      label: '订单管理',
      value: '3',
      icon: '',
      disabled: false,
    },
    {
      label: '优化需求',
      value: '4',
      icon: '',
      disabled: false,
    },
    {
      label: '商城首页',
      value: '5',
      icon: '',
      disabled: false,
    },
    {
      label: '商城后台',
      value: '6',
      icon: '',
      disabled: false,
    },
  ])
  const moreList = ref([
    {
      label: '复制',
      code: 'copy',
      value: '0',
      icon: 'DocumentCopy',
      divided: false,
      disabled: false,
    },
    {
      label: '移动',
      code: 'move',
      value: '1',
      icon: 'Position',
      divided: false,
      disabled: false,
    },
    {
      label: '归档',
      code: 'finished',
      value: '2',
      icon: 'Finished',
      divided: true,
      disabled: false,
    },
    {
      label: '激活',
      code: 'actived',
      value: '6',
      icon: 'Open',
      divided: false,
      disabled: false,
    },
    {
      label: '删除',
      code: 'delete',
      value: '6',
      icon: 'Delete',
      divided: false,
      disabled: false,
    },
  ])
  const stList = []
  const baList = []
  const scList = []
  //变更状态
  const handleCommandState = (value) => {
    console.log('%c [ value ]-42', 'font-size:13px; background:pink; color:#bf2c9f;', value)
  }
  const handeDropdownStatus = (status) => {
    if (!status) {
      statusSearchInfo.value = ''
      statusList.value = stList
    }
  }
  const handleStatusInput = (value) => {
    if (!value) {
      statusList.value = stList
    }
    statusList.value = statusList.value.filter((item) => item.label?.includes(value))
  }
  //移入基线
  const handleCommandBasic = (value) => {
    console.log(value, 'value')
  }
  const handeDropdownBasic = (basic) => {
    if (!basic) {
      basicSearchInfo.value = ''
      basicList.value = baList
    }
  }
  const handleBasicInput = (value) => {
    if (!value) {
      basicList.value = baList
    }
    basicList.value = basicList.value.filter((item) => item.label?.includes(value))
  }
  //需求排期
  const handleCommandSchedules = (value) => {
    console.log(value, 'value')
  }
  const handeDropdownSchedules = (basic) => {
    if (!basic) {
      schedulesSearchInfo.value = ''
      schedulesList.value = scList
    }
  }
  const handleSchedulesInput = (value) => {
    if (!value) {
      schedulesList.value = scList
    }
    schedulesList.value = schedulesList.value.filter((item) => item.label?.includes(value))
  }
  //更多
  const handleCommandMore = (item) => {
    emit('changeMore', item)
  }
  onMounted(() => {
    Object.assign(stList, statusList.value)
    Object.assign(baList, basicList.value)
    Object.assign(scList, schedulesList.value)
  })
</script>

<style scoped lang="scss">
  .header-menu-box {
    display: flex;
    align-items: center;
    justify-content: center;
    .change-status {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      margin-left: 5px;
    }
    .move-basic,
    .demand-schedules,
    .more {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
    }
  }
  .basic-content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .custom-dropdown-menu {
    width: 220px;
    margin: 4px 0;
  }
</style>
