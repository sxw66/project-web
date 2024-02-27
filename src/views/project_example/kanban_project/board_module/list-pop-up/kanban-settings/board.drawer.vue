<template>
  <!-- 看板设置drawer -->
  <el-drawer
    v-model="showDrawerComputed"
    v-if="showDrawerComputed"
    size="100%"
    :destroy-on-close="true"
    direction="ttb"
  >
    <template #header>
      <div class="flex-align-center">
        <h4>工作流配置</h4>
        <el-divider direction="vertical" />
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>Kanban 项目</el-breadcrumb-item>
          <el-breadcrumb-item>用户故事</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </template>
    <div style="display: flex">
      <div class="drawer-content">
        <el-alert
          title="Tips： 设置当前工作项类型的状态和流转关系"
          type="error"
          :closable="false"
        />
        <div class="heade-operation">
          <div class="heade-operation_left flex-align-center">
            <el-radio-group v-model="radioType">
              <el-radio-button label="表格" />
              <el-radio-button label="流程" />
            </el-radio-group>
            <el-text type="info">4个状态</el-text>
          </div>
          <div class="heade-operation_right">
            <el-button :icon="Switch" @click="handeAddFlow" v-if="radioType === '流程'"
              >添加流转</el-button
            >
            <el-button type="primary" :icon="Plus" @click="handeAddState">添加状态</el-button>
          </div>
        </div>
        <div class="table-list" v-if="radioType === '表格'">
          <PropTable border headerTag :columns="columnList" :data="tableData" :isShowHeader="false">
            <template #open="{ row }">
              <el-checkbox v-model="row.checkbox1" />
            </template>
            <template #underway="{ row }">
              <el-checkbox v-model="row.checkbox2" />
            </template>
            <template #finished="{ row }">
              <el-checkbox v-model="row.checkbox3" />
            </template>
            <template #close="{ row }">
              <el-checkbox v-model="row.checkbox4" />
            </template>
          </PropTable>
        </div>
        <flowChart v-if="radioType === '流程'" />
      </div>
      <div class="drawer-right" :style="{ flex: showUnpack ? '0.2' : '0', transition: '0.3s' }">
        <span @click="toggle">
          <el-icon v-if="showUnpack"><DArrowLeft /></el-icon>
          <el-icon v-else><DArrowRight /></el-icon>
          <div> 配置 </div>
        </span>
        <el-form
          v-show="showUnpack"
          label-position="top"
          label-width="100px"
          :model="formLabelAlign"
          style="max-width: 360px"
        >
          <el-form-item label="流转名称">
            <el-input v-model="formLabelAlign.name" maxlength="32" show-word-limit clearable />
          </el-form-item>
          <el-form-item label="起始状态">
            <el-select v-model="formLabelAlign.region" style="width: 100%" filterable clearable>
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <el-tag style="color: #fff" :key="item.label" :color="item.bgc" round>
                  {{ item.label }}
                </el-tag>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目标状态">
            <el-select v-model="formLabelAlign.type" style="width: 100%" filterable clearable>
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <el-tag style="color: #fff" :key="item.label" :color="item.bgc" round>
                  {{ item.label }}
                </el-tag>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="flex-justify-between" style="width: 100%">
              <div> 规则 </div>
              <el-icon :size="20" @click="handeAddRule">
                <Plus />
              </el-icon>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handeSave">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 添加状态-弹框 -->
      <addState :addStateVisible="stateVisible" @closeAddState="handeCloseAddState" />
      <!-- 添加状态流转-弹框 -->
      <addFlow :addFlowVisible="flowVisible" @closeAddFlow="handeCloseAddFlow" />
      <!-- 添加规则-弹框 -->
      <addRule :addRuleVisible="ruleVisible" @closeRuleModel="handeCloseRuleFlow" />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, watch, watchEffect } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useProjectStore } from '@/store/modules/project'
  import { Switch, Plus, DArrowRight, Setting, Aim } from '@element-plus/icons-vue'

  // 流程图组件
  import flowChart from './flow.chart.vue'
  // 添加状态组件
  import addState from './add.state.vue'
  // 添加状态流转组件
  import addFlow from './add.flow.vue'
  // 添加规则组件
  import addRule from './add.rule.vue'

  const ProjectStore = useProjectStore()

  // 接收父组件传递的参数
  const props = defineProps({
    showDrawer: Boolean,
    kanBanId: String,
  })

  //分发事件给父组件
  let emits = defineEmits(['closeDetailsDialog'])

  const radioType = ref('表格')
  const showUnpack = ref(false) // 是否展开配置
  const stateVisible = ref(false) // 是否打开添加状态弹框
  const flowVisible = ref(false) // 是否打开添加状态流转弹框
  const ruleVisible = ref(false) // 是否打开添加规则弹框

  const formLabelAlign = reactive({
    name: '',
    region: '1',
    type: '2',
  })

  const columnList = ref([
    {
      name: 'name',
      label: '开始状态',
      hideHeaderMenu: true,
      headerHideTag: true,
    },
    {
      name: 'open',
      label: '打开',
      slot: true,
    },
    {
      name: 'underway',
      label: '进行中',
      slot: true,
      headerTaType: 'warning',
    },
    {
      name: 'finished',
      label: '已完成',
      slot: true,
      headerTaType: 'success',
    },
    {
      name: 'close',
      label: '关闭',
      slot: true,
      headerTaType: 'danger',
    },
  ])

  const tableData = [
    {
      name: 'Tom1',
      checkbox1: false,
    },
    {
      name: 'To2m',
      checkbox2: false,
    },
    {
      name: 'T5om',
      checkbox3: false,
    },
    {
      name: 'T6om',
      checkbox4: true,
    },
    {
      name: 'T7om',
      checkbox5: true,
    },
  ]

  const statusList = ref([
    {
      label: '待评审',
      value: '0',
      bgc: '#5aacf9',
    },
    {
      label: '已计划',
      value: '1',
      bgc: '#fd9e76',
    },
    {
      label: '进行中',
      value: '2',
      bgc: '#f5c560',
    },
    {
      label: '已完成',
      value: '3',
      bgc: '#76d899',
    },
    {
      label: '已关闭',
      value: '4',
      bgc: '#d4d4d4',
    },
  ])

  // 数据源
  const showDrawerComputed = computed(() => {
    return props.showDrawer
  })

  //  保存
  const handeSave = async () => {
    console.log('保存', formLabelAlign)
  }
  //  提交
  const toggle = async () => {
    showUnpack.value = !showUnpack.value
  }

  //  打开【添加流转状态】弹框
  const handeAddFlow = async () => {
    flowVisible.value = true
  }
  //  关闭【添加流转状态】弹框
  const handeCloseAddFlow = async () => {
    flowVisible.value = false
  }
  //  打开【添加状态】弹框
  const handeAddState = async () => {
    stateVisible.value = true
  }
  //  关闭【添加状态】弹框
  const handeCloseAddState = async () => {
    stateVisible.value = false
  }
  //  打开【添加规则】弹框
  const handeAddRule = async () => {
    ruleVisible.value = true
  }
  //  关闭【添加规则】弹框
  const handeCloseRuleFlow = async () => {
    ruleVisible.value = false
  }

  // // 关闭-取消
  // const handleCancel = () => {
  //   emits('closeDetailsDialog', '')
  // }
  // 默认获取父组件传递的树列表-和表格数据-依赖项变化的时候，重新执行改函数。
  // watchEffect(() => {
  // })
  // onMounted(() => {
  // })
</script>

<style lang="scss" scoped>
  .drawer-content {
    flex: 1;
    .heade-operation {
      margin: 10px;
      display: flex;
      justify-content: space-between;
      &_left {
        .el-radio-group {
          margin-right: 10px;
        }
      }
    }
    .table-list {
      margin-top: 15px;
    }
  }
  .drawer-right {
    border: solid 1px #f1f1f1;
    color: #999;
    cursor: pointer;
    padding: 5px 20px;
    box-sizing: border-box;
    .el-form--default {
      margin-top: 10px;
    }
  }
</style>
