<template>
  <div class="header-menu-box">
    <el-dropdown
      trigger="click"
      @command="handleCommandKanban"
      @visible-change="handeDropdownKanban"
    >
      <div class="move-kanban">
        <el-icon style="margin-right: 4px"><DocumentCopy /></el-icon>
        移入看板
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-input
            v-model="kanbanSearchInfo"
            clearable
            :prefix-icon="Search"
            style="width: 260px; display: flex; padding: 20px 20px 10px"
            placeholder="请输入"
            @input="handleKanbanInput"
          />
          <div class="status-dropdown-content">
            <el-dropdown-item
              v-for="(item, index) in kanbanList"
              :key="index"
              :command="item.value"
              :icon="item.icon"
              :disabled="item.disabled"
              style="padding: 10px 20px"
            >
              <!-- <el-tag style="color: #fff" :key="item.label" :color="item.bgc" round>
                {{ item.label }}
              </el-tag> -->
              <span>{{ item.label }}</span>
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
    <principal
      :multiple="false"
      :showPrincipal="false"
      :showTeam="false"
      style="margin-left: 20px"
      :size="13"
      textColor="#606266"
      text="分配负责人"
      @principal-change="handlePrincipalChange"
    />
    <el-dropdown
      trigger="click"
      @command="handleCommandState"
      @visible-change="handeDropdownStatus"
    >
      <div class="change-status">
        <el-icon style="margin-left: 20px; margin-right: 4px"><Operation /></el-icon>
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
    <el-dropdown trigger="click" @command="handleCommandTags" @visible-change="handeDropdownTags">
      <div class="demand-schedules">
        <el-icon style="margin-left: 20px; margin-right: 4px"><Discount /></el-icon>
        设置标签
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-input
            v-model="setTagsSearchInfo"
            clearable
            :prefix-icon="Search"
            style="width: 260px; display: flex; padding: 20px 20px 10px"
            placeholder="请输入"
            @input="handleTagsInput"
          />
          <div class="schedules-dropdown-content">
            <el-dropdown-item
              v-for="(item, index) in SetTagsList"
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
  const kanbanSearchInfo = ref('')
  const statusSearchInfo = ref('')
  const basicSearchInfo = ref('')
  const setTagsSearchInfo = ref('')
  const kanbanList = ref([
    {
      label: '无',
      value: '0',
      disabled: false,
      icon: '',
    },
    {
      label: '新增看板2',
      value: '1',
      disabled: false,
      icon: 'Document',
    },
    {
      label: '测试看板',
      value: '2',
      disabled: false,
      icon: 'Document',
    },
    {
      label: '默认看板',
      value: '3',
      disabled: false,
      icon: 'Document',
    },
    {
      label: '123',
      value: '4',
      disabled: false,
      icon: 'Document',
    },
  ])
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
  const SetTagsList = ref([
    {
      label: '标签1',
      value: '0',
      icon: '',
      disabled: false,
    },
    {
      label: '标签2',
      value: '1',
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
  const kbList = []
  const stList = []
  const baList = []
  const tagList = []
  //移入看板
  const handleCommandKanban = (value) => {
    console.log('%c [ value ]-42', 'font-size:13px; background:pink; color:#bf2c9f;', value)
  }
  const handeDropdownKanban = (status) => {
    if (!status) {
      kanbanSearchInfo.value = ''
      kanbanList.value = kbList
    }
  }
  const handleKanbanInput = (value) => {
    if (!value) {
      kanbanList.value = kbList
    }
    kanbanList.value = kanbanList.value.filter((item) => item.label?.includes(value))
  }
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
  //分配负责人
  const handlePrincipalChange = (data) => {
    console.log(data, 'data')
  }
  //设置标签
  const handleCommandTags = (value) => {
    console.log(value, 'value')
  }
  const handeDropdownTags = (basic) => {
    if (!basic) {
      setTagsSearchInfo.value = ''
      SetTagsList.value = tagList
    }
  }
  const handleTagsInput = (value) => {
    if (!value) {
      SetTagsList.value = tagList
    }
    SetTagsList.value = SetTagsList.value.filter((item) => item.label?.includes(value))
  }
  //更多
  const handleCommandMore = (item) => {
    emit('changeMore', item)
  }
  onMounted(() => {
    Object.assign(kbList, kanbanList.value)
    Object.assign(stList, statusList.value)
    Object.assign(baList, basicList.value)
    Object.assign(tagList, SetTagsList.value)
  })
</script>

<style scoped lang="scss">
  .header-menu-box {
    display: flex;
    align-items: center;
    justify-content: center;
    .move-kanban {
      margin-left: 5px;
    }
    .move-kanban,
    .change-status,
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
