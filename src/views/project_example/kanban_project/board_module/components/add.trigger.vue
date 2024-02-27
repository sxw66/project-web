<template>
  <div class="add-trigger-box">
    <el-dialog
      v-model="visible"
      width="70%"
      style="height: 700px"
      title="新建触发器"
      align-center
      destroy-on-close
      :before-close="handleBeforeClose"
      :show-close="true"
    >
      <section class="section">
        <div class="left-wraper">
          <div class="left-content">
            <el-form class="custom-form" ref="RefFormName" :model="formInfo" :rules="rulesInfo">
              <el-form-item prop="triggerName">
                <el-input
                  type="texteara"
                  class="custom-input"
                  placeholder="输入名称"
                  clearable
                  v-model="formInfo.triggerName"
                  style="width: 100%; height: 44px"
                >
                </el-input>
              </el-form-item>
            </el-form>
            <div class="trigger-condition-title">当工作项进入触发栏</div>
            <div class="trigger-condition">
              <Card
                ref="RefTrigger"
                :isDelete="false"
                field="triggerColumn"
                text="触发栏"
                :list="triggerColumnList"
              >
              </Card>
              <svg-icon class="condition-arrow" size="30" name="conditionArrow"></svg-icon>
            </div>
            <div class="conditions">满足条件</div>
            <Card ref="RefConditionCard" v-for="item in []" :key="item"></Card>
            <div class="chooce-conditons">
              <div
                @click="handleClickCodition"
                class="chooce-conditons-title"
                :class="{ 'click-actived': !isChooce }"
              >
                选择筛选条件
              </div>
              <svg-icon class="condition-arrow" size="30" name="conditionArrow"></svg-icon>
            </div>
            <div class="trigger-behavior">将触发行为</div>
            <Card ref="RefBehaviorCard" v-for="item in []" :key="item"></Card>
            <div
              @click="handleClickBehavior"
              class="chooce-behavior"
              :class="{ 'click-actived': isChooce }"
            >
              选择触发行为
            </div>
          </div>
        </div>
        <!-- 触发行为 -->
        <div class="right-wraper">
          <div class="switch-chooce-container">
            <el-tabs>
              <el-tab-pane
                v-for="item in tabsList"
                :key="item.name"
                :name="item.name"
                :label="item.label"
              />
            </el-tabs>
          </div>
        </div>
      </section>
      <template #footer>
        <el-button @click="emit('update:modelValue', false)">取消</el-button>
        <el-button type="primary" @click="handleComfirm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, withDefaults, reactive, defineAsyncComponent } from 'vue'
  interface Iprops {
    modelValue: boolean
  }
  const props = withDefaults(defineProps<Iprops>(), {
    modelValue: false,
  })
  const emit = defineEmits(['update:modelValue'])
  const Card = defineAsyncComponent(() => import('./trigger.card.vue'))
  const formInfo = ref({
    triggerName: '',
  })
  const RefFormName = ref()
  const RefTrigger = ref()
  const RefConditionCard = ref()
  const RefBehaviorCard = ref()
  const visible = ref(false)
  const triggerColumn = ref('')
  const isChooce = ref(false)
  const triggerColumnList = ref([
    {
      label: '需求池',
      value: '0',
    },
    {
      label: '设计',
      value: '1',
    },
    {
      label: '研发',
      value: '2',
    },
    {
      label: '测试',
      value: '3',
    },
    {
      label: '发布',
      value: '4',
    },
  ])
  const tabsList = ref([
    {
      label: '触发行为',
      name: '0',
    },
    {
      label: '筛选条件',
      name: '1',
    },
  ])
  const rulesInfo = reactive({
    triggerName: [{ required: true, message: '名称不能为空', trigger: ['change', 'blur'] }],
  })
  watch(
    () => props.modelValue,
    (value) => {
      visible.value = value
    },
    {
      immediate: true,
    },
  )
  const handleBeforeClose = () => {
    emit('update:modelValue', false)
  }
  //点击筛选条件
  const handleClickCodition = () => {
    console.log('筛选条件')
    isChooce.value = false
  }
  //点击触发行为
  const handleClickBehavior = () => {
    console.log('触发行为')
    isChooce.value = true
  }
  const handleComfirm = () => {
    RefFormName.value.validate((vali) => {
      if (vali) {
        console.log('触发器提交')
      }
    })
    console.log(RefTrigger.value.formInfo, '触发器')
    RefTrigger.value.validate(() => {
      console.log(RefTrigger.value.formInfo, '触发器')
    })
    RefConditionCard.value.forEach((item) => {
    //   console.log('%c [ item ]-119', 'font-size:13px; background:pink; color:#bf2c9f;', item.formInfo)
      item.validate(() => {
        console.log('card')
      })
    })
    RefBehaviorCard.value.forEach((item) => {
    //   console.log('%c [ item ]-119', 'font-size:13px; background:pink; color:#bf2c9f;', item.formInfo)
      item.validate(() => {
        console.log('card')
      })
    })
  }
</script>

<style scoped lang="scss">
  .add-trigger-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .section {
      width: 100%;
      height: 100%;
      display: flex;
      .left-wraper {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        width: 64%;
        height: 100%;
        // border: 1px solid;
        overflow-y: scroll;
        .left-content {
          width: 400px;
          height: auto;
          margin: 34px 0;
          box-sizing: border-box;
          .custom-form {
            :deep(.el-input__inner::placeholder) {
              font-size: 24px;
            }
            :deep(.el-input__wrapper) {
              background-color: transparent !important;
              box-shadow: none;
            }
            :deep(.el-input__wrapper.is-focus) {
              box-shadow: 0 0 0 1px #459ffc inset;
            }
            :deep(.el-form-item.is-error .el-input__wrapper) {
              box-shadow: 0 0 0 1px #f36b6e inset;
            }
          }
          .trigger-condition-title {
            margin: 27px 0 10px;
          }
          .trigger-condition {
            position: relative;
            .condition-arrow {
              position: absolute;
              left: 50%;
              transform: translate(-50%);
              bottom: -38px;
            }
          }
          .conditions {
            margin: 37px 0 10px;
          }
          .chooce-conditons {
            position: relative;
            width: 100%;
            height: 47px;
            border-radius: 2px;
            user-select: none;
            .chooce-conditons-title {
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid #eee;
              background: #eee;
              width: 100%;
              height: 100%;
            }
            .condition-arrow {
              position: absolute;
              left: 50%;
              transform: translate(-50%);
              bottom: -38px;
            }
            .click-actived {
              border: 1px solid #6698ff;
              border-style: dashed;
              background-color: #6698ff1a;
              color: #6698ff;
              border-radius: 2px;
            }
          }
          .trigger-behavior {
            margin: 37px 0 10px;
          }
          .chooce-behavior {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #eee;
            border: 1px solid #eee;
            border-radius: 2px;
            width: 100%;
            height: 47px;
            user-select: none;
          }
          .click-actived {
            border: 1px solid #6698ff;
            border-style: dashed;
            background-color: #6698ff1a;
            color: #6698ff;
            border-radius: 2px;
          }
        }
      }
      .right-wraper {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        width: 36%;
        height: 100%;
        // border: 1px solid;
        .switch-chooce-container {
          width: 270px;
          height: 520px;
          margin: 24px 0;
        //   border: 1px solid;
          background-color: #fff;
          box-shadow: 0 0 8px 2px #00000014;
        }
      }
    }
  }
  :deep(.el-dialog) {
    .el-dialog__header {
      display: block;
      height: 30px;
      background: #fff;
    }
    .el-dialog__body {
      height: calc(100% - 128px);
      padding: 0px;
      background: #fafafa;
    }
  }
  :deep(.el-tabs__nav-scroll) {
    padding-left: 24px;
    .el-tabs__item {
      padding-right: 37px;
      color: #999;
    }
    .el-tabs__item.is-active {
      color: #459ffc;
    }
  }
</style>
