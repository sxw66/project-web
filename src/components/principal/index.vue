<template>
  <div class="principal-container">
    <!-- 选中展示内容-多选 -->
    <template v-if="multiple">
      <div v-for="item in focusPersonList" :key="item.id">
        <el-tooltip placement="top" :content="item.label">
          <div
            class="focus-wraper"
            @mouseenter="handleMouseenterName(item)"
            @mouseleave="handleMouseleaveName()"
          >
            <svg-icon
              v-if="item.unit == 'team' && item.level == 0"
              :size="size + 10"
              name="team"
              color="#5dcfff"
            >
            </svg-icon>
            <div
              v-else
              class="focus-name"
              :style="{
                background: item.bgc,
                width: `${principalWidth}px`,
                height: `${principalWidth}px`,
              }"
            >
              {{
                reg.test(item.label)
                  ? item.label?.substring(0, 2)?.toUpperCase()
                  : item.label?.slice(-2)
              }}
            </div>
            <svg-icon
              class="focus-name-close"
              :class="{ showSvg: item.id == showCloseSvg }"
              :color="closeIconColor"
              name="close"
              size="16"
              @mouseenter="handleMouseenterClose"
              @mouseleave="hanldeMouseleaveClose"
              @click="handleClickClose(item)"
            >
            </svg-icon>
          </div>
        </el-tooltip>
      </div>
    </template>
    <!-- 弹窗内容 -->
    <el-popover
      ref="RefPopover"
      :show-arrow="false"
      width="260"
      trigger="click"
      :visible="visible"
      placement="bottom"
      :popper-style="{ padding: '0px' }"
    >
      <div class="member-container" ref="RefContent">
        <!-- 搜索框 -->
        <div class="top">
          <div class="member-search">
            <!-- 输入框 -->
            <el-input placeholder="搜索" v-model="searchInfo"></el-input>
            <!-- 分割线 -->
            <div class="split-line"></div>
            <!-- svg -->
            <svg-icon v-show="!searchInfo.length" class="search-svg" name="search" size="15">
            </svg-icon>
            <svg-icon
              v-show="searchInfo.length"
              :color="clearSvgColor"
              class="clear-svg"
              name="pureClose"
              size="15"
              @mouseenter="handleMouseenterClearSvg"
              @mouseleave="handleMouseleaveClearSvg"
              @click="handleClickClearSvg"
            >
            </svg-icon>
          </div>
          <!-- 切换人员 -->
          <div class="member-content-header">
            <el-radio-group
              v-model="switchBtn"
              class="radio-container"
              :style="radioContainerStyle"
            >
              <el-radio-button v-if="showMember" label="成员" />
              <el-radio-button v-if="showDepartment" label="部门" />
              <el-radio-button v-if="showTeam" label="团队" />
            </el-radio-group>
            <!-- 跳转更多 -->
            <svg-icon
              class="skip-member"
              :color="skipPrincipalColor"
              size="16"
              name="principal"
              @mouseenter="handleMouseenterSkipMember"
              @mouseleave="handleMouseleaveSkipMember"
              @click="hanldeClickSkipMember"
            >
            </svg-icon>
          </div>
        </div>
        <div class="main">
          <!-- 成员 -->
          <MemberSelect
            v-if="showMember"
            ref="RefMemberSelect"
            :multiple="multiple"
            v-show="switchBtn == '成员'"
            :searchInfo="searchInfo"
            @select-change="handleMemberSelectChange"
            @radio-change="handleMemberRadioChange"
          >
          </MemberSelect>
          <!-- 部门 -->
          <DepartmentSelect
            v-if="showDepartment"
            ref="RefDepartmentSelect"
            :multiple="multiple"
            v-show="switchBtn == '部门'"
            :status="status"
            :searchInfo="searchInfo"
            @select-change="handleDepartmentSelectChange"
            @radio-change="handleDepartmentRadioChange"
          >
          </DepartmentSelect>
          <!-- 团队 -->
          <TeamSelect
            v-if="showTeam"
            ref="RefTeamSelect"
            :multiple="multiple"
            v-show="switchBtn == '团队'"
            :status="status"
            :searchInfo="searchInfo"
            @select-change="handleTeamSelectChange"
          >
          </TeamSelect>
        </div>
      </div>
      <template #reference>
        <div>
          <!-- 选中展示内容-单选 -->
          <template v-if="!multiple && showPrincipal">
            <div v-for="item in focusPerson" :key="item?.id">
              <el-tooltip placement="top" :content="item?.label">
                <div
                  class="radio-focus-wraper"
                  @mouseenter="handleMouseenterName(item)"
                  @mouseleave="handleMouseleaveName()"
                  @click="hanldeClickName"
                >
                  <div
                    class="radio-focus-name"
                    :style="{
                      background: item?.bgc,
                      width: `${principalWidth}px`,
                      height: `${principalWidth}px`,
                    }"
                  >
                    {{
                      reg.test(item.label)
                        ? item?.label?.substring(0, 2)?.toUpperCase()
                        : item?.label?.slice(-2)
                    }}
                  </div>
                </div>
              </el-tooltip>
            </div>
          </template>
          <!-- 初始内容 -->
          <div
            v-if="multiple || !showPrincipal || focusPerson.length <= 0"
            class="principal-svg-container"
          >
            <svg-icon
              :class="{ 'principal-actived': togglePrincipal }"
              class="principal"
              :color="principalColor"
              :size="size - 2"
              name="principal"
              @mouseenter="handleMouseenterPrincipal"
              @mouseleave="handleMouseleavePrincipal"
              @click="handleClickPrincipal"
            >
            </svg-icon>
            <span
              :class="{ 'principal-text-actived': togglePrincipal }"
              class="principal-text"
              :style="{ 'font-size': size + 'px' }"
              @mouseenter="handleMouseenterPrincipal"
              @mouseleave="handleMouseleavePrincipal"
              @click="handleClickPrincipal"
            >
              {{ text }}
            </span>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
  import MemberSelect from './components/member.vue'
  import DepartmentSelect from './components/department.vue'
  import TeamSelect from './components/team.vue'
  import {
    ref,
    watch,
    defineAsyncComponent,
    onMounted,
    onUnmounted,
    nextTick,
    withDefaults,
  } from 'vue'
  interface Iprops {
    modelValue?: string[]
    showMember?: boolean
    showDepartment?: boolean
    showTeam?: boolean
    multiple?: boolean
    text?: string
    textColor?: string
    size?: number
    showPrincipal?: boolean
  }
  const props = withDefaults(defineProps<Iprops>(), {
    modelValue: () => [], //使用v-model绑定数据
    showMember: true, //是否显示成员
    showDepartment: true, //是否显示部门
    showTeam: true, //是否显示团队
    multiple: true, //是否多选
    text: '', //是否需要显示标题
    textColor: '#999', //标题颜色
    size: 16, //设置人员选择器大小
    showPrincipal: true, //是否展示选中人员
  })
  //人员选择器事件：principal-change
  const emit = defineEmits(['update:modelValue', 'principal-change'])
  const RefPopover = ref()
  const RefContent = ref()
  const RefMemberSelect = ref()
  const RefDepartmentSelect = ref()
  const RefTeamSelect = ref()
  const visible = ref(false)
  const showCloseSvg = ref('')
  const principalWidth = ref(26)
  const reg = /[a-z,A-Z]/
  //多选人员列表
  const focusPersonList = ref([])
  //单选
  const focusPerson: any = ref([])
  //移除人员svg颜色
  const closeIconColor = ref('#999')
  //添加人员svg颜色
  const principalColor = ref('#999')
  //选中切换添加人员svg样式
  const togglePrincipal = ref(false)
  //搜索内容
  const searchInfo = ref('')
  //弹窗切换选中人员
  const switchBtn = ref('成员')
  //跳转svg移入样式
  const skipPrincipalColor = ref('#999')
  //鼠标移入名称
  const handleMouseenterName = (data) => {
    if (visible.value) {
      return
    }
    props.multiple && (showCloseSvg.value = data.id)
  }
  //鼠标移出名称
  const handleMouseleaveName = () => {
    showCloseSvg.value = ''
  }
  //鼠标移入已有关注人
  const handleMouseenterClose = () => {
    closeIconColor.value = '#f53f3f'
  }
  //点击名称
  const hanldeClickName = (e) => {
    e.stopPropagation()
    if (props.multiple) {
      return
    }
    visible.value = !visible.value
  }
  //鼠标移出已有关注人
  const hanldeMouseleaveClose = () => {
    closeIconColor.value = '#999'
  }
  const radioContainerStyle = () => {
    return {}
  }
  //更新数据
  const handleUpdateList = () => {
    nextTick(() => {
      const memberList = props.showMember ? RefMemberSelect.value.handleGetMemberList() : []
      const teamList = props.showTeam ? RefTeamSelect.value.handleGetTeamList() : []
      const departmentList = props.showDepartment
        ? RefDepartmentSelect.value.handleGetDepartmentList()
        : []
      if (props.multiple) {
        focusPersonList.value = [...memberList, ...departmentList, ...teamList].sort(
          (a, b) => a.date - b.date,
        )
      } else {
        focusPerson.value = [...memberList, ...departmentList, ...teamList]
      }
    })
  }
  const handleUpdateData = () => {
    nextTick(() => {
      const id = focusPerson.value?.map((item) => item?.id)
      RefMemberSelect.value.handleSetMemberList()
      RefMemberSelect.value.handleSetNodeKeys(id)
      RefDepartmentSelect.value.handleSetDepartmentList()
      RefDepartmentSelect.value.handleSetNodeKeys(id)
      // RefTeamSelect.value.handleSetTeamList()
      // RefTeamSelect.value.handleSetNodeKeys(id)
      emit('update:modelValue', id)
    })
  }
  //删除已有关注人
  const handleClickClose = (data) => {
    switch (data.unit) {
      case 'member':
        RefMemberSelect.value.handleDeleteMemberList(data)
        break
      case 'team':
        RefTeamSelect.value.handleDeleteTeamList(data)
        break
      case 'department':
        RefDepartmentSelect.value.handleDeleteDepartmentList(data)
        break
    }
    // focusPersonList.value?.splice(idx, 1)
  }
  //鼠标移入添加人员选中样式
  const handleMouseenterPrincipal = () => {
    togglePrincipal.value = true
    principalColor.value = '#1e80ff'
  }
  //鼠标移出添加人员选中样式
  const handleMouseleavePrincipal = () => {
    if (!visible.value) {
      togglePrincipal.value = false
      principalColor.value = '#999'
    }
  }
  //点击添加人员展示弹窗
  const handleClickPrincipal = (e) => {
    e.stopPropagation()
    visible.value = !visible.value
  }
  const status = ref(false)
  const isFlow = ref(true)
  const handleReflowList = (list) => {
    nextTick(() => {
      status.value = true
      props.showMember && RefMemberSelect.value.handleSetNodeKeys(list)
      props.showTeam && RefTeamSelect.value.handleSetNodeKeys(list)
      props.showDepartment && RefDepartmentSelect.value.handleSetNodeKeys(list)
    })
  }
  watch(
    () => props.modelValue,
    () => {
      const list = props.modelValue?.length > 0 ? props.modelValue?.filter(Boolean) : []
      isFlow.value && handleReflowList(list)
    },
    {
      immediate: true,
    },
  )
  //监听弹窗回显添加人员选中样式
  watch(
    () => visible.value,
    (value) => {
      // if (!props.multiple) {
      //   return
      // }
      if (value) {
        window.addEventListener('click', hanleCancelShowDialog)
        togglePrincipal.value = true
        principalColor.value = '#1e80ff'
        status.value = false
      } else {
        window.removeEventListener('click', hanleCancelShowDialog)
        togglePrincipal.value = false
        principalColor.value = '#999'
        status.value = true
        const list = ref([])
        props.multiple
          ? (list.value = focusPersonList.value.map((item) => item.id))
          : (list.value = focusPerson.value.map((item) => item.id))
        emit('update:modelValue', list.value)
        emit('principal-change', list.value)
        isFlow.value = false
      }
    },
  )
  //搜索样式
  const clearSvgColor = ref('#cacaca')
  const handleMouseenterClearSvg = () => {
    clearSvgColor.value = '#6698ff'
  }
  const handleMouseleaveClearSvg = () => {
    clearSvgColor.value = '#cacaca'
  }
  const handleClickClearSvg = () => {
    searchInfo.value = ''
  }
  const handleMouseenterSkipMember = () => {
    skipPrincipalColor.value = '#6698ff'
  }
  const handleMouseleaveSkipMember = () => {
    skipPrincipalColor.value = '#999'
  }
  const hanldeClickSkipMember = () => {
    console.log('skip')
  }
  const hanleCancelShowDialog = (e) => {
    //是否点击添加的svg
    const isAddPerson = e.target.classList?.contains('icon-principal')
    isAddPerson ? (visible.value = !visible.value) : (visible.value = false)
  }
  //成员 多选
  const handleMemberSelectChange = () => {
    handleUpdateList()
  }
  //单选
  const handleMemberRadioChange = (data) => {
    nextTick(() => {
      focusPerson.value = Object.keys(data).length > 0 ? [{ ...data }] : []
      handleUpdateData()
      visible.value = false
    })
  }
  //团队
  const handleTeamSelectChange = () => {
    handleUpdateList()
  }
  //部门 多选
  const handleDepartmentSelectChange = () => {
    handleUpdateList()
  }
  //单选
  const handleDepartmentRadioChange = (data) => {
    nextTick(() => {
      focusPerson.value = Object.keys(data).length > 0 ? [{ ...data }] : []
      handleUpdateData()
      visible.value = false
    })
  }
  onMounted(() => {
    props.size && (principalWidth.value = props.size + 10)
    //判断点击的范围是否是弹窗外的范围
    nextTick(() => {
      RefContent.value.addEventListener('click', (e) => {
        e.stopPropagation()
        visible.value = true
      })
      window.addEventListener('click', hanleCancelShowDialog)
    })
  })
  onUnmounted(() => {
    window.removeEventListener('click', hanleCancelShowDialog)
  })
</script>

<style scoped lang="scss">
  .principal-container {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .focus-wraper {
      display: flex;
      position: relative;
      align-items: center;
      margin: 3px 2px;
      user-select: none;
      .focus-name {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        border-radius: 50%;
        font-size: 12px;
        &:hover {
          cursor: default;
        }
      }
      .focus-name-close {
        display: none;
        position: absolute;
        top: -10px;
        right: -4px;
        z-index: 10;
      }
      .showSvg {
        display: block;
      }
    }
    .principal-svg-container {
      display: flex;
      justify-content: center;
      align-items: center;

      .principal {
        display: flex;
        margin: 4px 0;
        margin-left: 4px;
        border: 1px solid;
        padding: 4px;
        border-radius: 50%;
        border-style: dashed;
        // box-sizing: border-box;
        // transition: 'border-style' 0.2s;
      }
      .principal-text {
        color: v-bind(textColor);
        margin-left: 6px;
        cursor: pointer;
        user-select: none;
      }
      .principal-text-actived {
        margin-left: 6px;
        color: #1e80ff;
      }
      .principal-actived {
        border-style: solid;
        border-width: 1px;
        // box-sizing: border-box;
        // animation: tremble 0.2s linear;
      }
    }
    .radio-focus-wraper {
      display: flex;
      position: relative;
      align-items: center;
      margin: 3px 2px;
      user-select: none;
      .radio-focus-name {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        border-radius: 50%;
        font-size: 12px;
        &:hover {
          cursor: default;
        }
      }
    }
  }
  .member-container {
    padding: 12px;
    .top {
      margin-bottom: 6px;
      :deep(.member-search) {
        position: relative;
        margin-bottom: 16px;
        .split-line {
          position: absolute;
          top: 9px;
          right: 36px;
          width: 1px;
          height: 14px;
          background: #eee;
        }
        .search-svg {
          position: absolute;
          top: 8px;
          right: 8px;
        }
        .clear-svg {
          position: absolute;
          top: 8px;
          right: 8px;
        }
        .el-input__wrapper {
          padding-right: 45px;
        }
      }
      .member-content-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        :deep(.radio-container) {
          width: 80%;
          display: flex;
          flex-wrap: nowrap;
          .el-radio-button__inner {
            width: 100%;
          }
          .el-radio-button {
            flex: 1;
          }
        }
        .skip-member {
          display: flex;
          padding: 8px 8px;
          //   border: 1px solid;
          border-radius: 5px;
          background-color: #f5f5f5;
        }
      }
    }
  }
  @keyframes tremble {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-6deg);
    }
    70% {
      transform: rotate(6deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
  :deep(.el-radio-button__inner) {
    border: none;
    padding: 8px 18px;
    background: #f5f5f5;
  }
  :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
    // background: #fff;
  }
</style>
