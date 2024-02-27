<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="dialog_box">
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="830px"
      top="50px"
      draggable
      :show-close="true"
      destroy-on-close
      align-center
    >
      <div class="dialog_content">
        <div class="left">
          <div class="img_style">
            <!-- <slot name="img_content"></slot> -->
            <img :src="imgUrl" />
          </div>
          <div class="text_style">
            <!-- <slot name="text_description"></slot> -->
            <p>{{ descContent.title }}</p>
            <div style="margin-bottom: 10px">{{ descContent.text }}</div>
            <div v-for="(el, index) in descContent.tipList" :key="index">
              <div style="margin: 10px 0">
                <el-button type="success" :icon="Check" size="small" circle class="btn" />
                {{ el }}
              </div>
            </div>
          </div>
        </div>
        <!-- 表单 -->
        <div class="right">
          <!-- =====================项目表单===================== -->
          <div v-if="dialogTitle === '新建项目'">
            <el-form
              ref="projectRef"
              v-if="isNext"
              :model="paramsForm"
              :rules="rules"
              label-width="120px"
              label-position="top"
              class="demo-ruleForm"
              status-icon
            >
              <el-form-item label="所属" prop="fromType">
                <el-select v-model="paramsForm.fromType" clearable placeholder="请选择">
                  <el-option
                    v-for="item in dict.formTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="项目名称" prop="projectName">
                <el-input
                  v-model="paramsForm.projectName"
                  maxlength="32"
                  show-word-limit
                  placeholder="输入项目名称"
                  @input="changeName"
                >
                  <template #prepend>
                    <svg-icon
                      :name="iconValue"
                      :color="paramsForm.projectColor"
                      style="position: absolute"
                    />
                    <el-color-picker v-model="paramsForm.projectColor" />
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item label="可见范围" prop="isPrivate">
                <el-select v-model="paramsForm.isPrivate" clearable placeholder="请选择可见范围">
                  <el-option
                    v-for="item in dict.permissionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    style="height: 60px"
                  >
                    <div style="width: 100%">
                      <div>
                        <div style="color: #333">
                          <svg-icon :name="item.iconName" />
                          {{ item.label }}
                        </div>
                        <div style="color: #aaa; margin: -10px 0px 0px 24px">{{ item.text }}</div>
                      </div>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="项目类型" prop="projectKind">
                <el-select
                  v-model="paramsForm.projectKind"
                  clearable
                  placeholder="请选择项目类型"
                  @change="changeType"
                >
                  <el-option
                    v-for="item in dict.typepeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <div style="width: 100%">
                      <div>
                        <div style="color: #333">
                          <svg-icon
                            :name="item.iconName"
                            :color="item.iconColor"
                            style="margin-right: 5px"
                          />
                          {{ item.label }}
                        </div>
                      </div>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="项目标识" prop="projectCode">
                <el-input
                  v-model="paramsForm.projectCode"
                  clearable
                  placeholder="大写字母和数字，15 个字符以内"
                />
              </el-form-item>

              <el-form-item label="描述">
                <el-input
                  v-model="paramsForm.projectDesc"
                  type="textarea"
                  maxlength="2000"
                  show-word-limit
                  clearable
                  placeholder="输入项目描述"
                />
              </el-form-item>
            </el-form>
            <!-- 人员选择 -->
            <div v-else> 人员选择 </div>
          </div>
          <!-- =====================项目集表单================ -->
          <div v-else>
            <el-form
              ref="projectRef"
              v-if="isNext"
              :model="paramsForm"
              :rules="rules"
              label-width="120px"
              label-position="top"
              class="demo-ruleForm"
              status-icon
            >
              <el-form-item label="项目集名称" prop="projectName">
                <el-input
                  v-model="paramsForm.projectName"
                  maxlength="32"
                  show-word-limit
                  placeholder="输入项目集名称"
                  @input="changeName"
                >
                  <template #prepend>
                    <svg-icon
                      name="itemSet"
                      :color="paramsForm.projectColor"
                      style="position: absolute"
                    />
                    <el-color-picker v-model="paramsForm.projectColor" />
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item label="项目集标识" prop="projectCode">
                <el-input
                  v-model="paramsForm.projectCode"
                  clearable
                  placeholder="大写字母和数字，15 个字符以内"
                />
              </el-form-item>

              <el-form-item label="负责人" prop="person">
                <el-select v-model="paramsForm.person" clearable placeholder="请选择">
                  <el-option
                    v-for="item in dict.personList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="paramsForm.startTime"
                  type="date"
                  placeholder="选择开始时间"
                  value-format="x"
                  :disabled-date="disabledDate"
                  :shortcuts="shortcuts"
                  style="width: 100%"
                />
              </el-form-item>

              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="paramsForm.endTime"
                  type="date"
                  placeholder="选择开始时间"
                  value-format="x"
                  :disabled-date="disabledDate"
                  :shortcuts="shortcuts"
                  style="width: 100%"
                />
              </el-form-item>

              <el-form-item label="描述">
                <el-input
                  v-model="paramsForm.projectDesc"
                  type="textarea"
                  maxlength="2000"
                  show-word-limit
                  clearable
                  placeholder="输入项目描述"
                />
              </el-form-item>
            </el-form>
            <!-- 人员选择 -->
            <div v-else> 人员选择 </div>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer" style="display: flex; justify-content: space-between">
          <div>
            <el-button v-if="dialogTitle.value === '新建项目集'" type="" text @click="feedBack">
              反馈建议
            </el-button>
          </div>
          <div>
            <el-button v-if="isNext" @click="cancel">取消</el-button>
            <el-button v-else type="primary" @click="handleBack">上一步</el-button>
            <el-button v-if="isNext" type="primary" @click="handleNext">下一步</el-button>
            <el-button v-else type="primary" @click="submitForm">确定</el-button>
          </div>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, watch, defineAsyncComponent, useAttrs } from 'vue'
  import { projectAdd } from '@/api/modules/project.ts'
  import { upPercase } from '@/api/modules/common.ts'
  import Scrum from '@/assets/image/productImg/item.png'
  import kanban from '@/assets/image/productImg/kanban.png'
  import pubu from '@/assets/image/productImg/pubu.png'
  import itemSet from '@/assets/image/productImg/itemSet.png'
  import * as dict from '@/utils/public-data'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Check } from '@element-plus/icons-vue'

  const imgUrl = ref('')
  const descContent: any = ref([])
  const props = defineProps(['isShow', 'title', 'imgUrl'])
  const emits = defineEmits(['update:isShow', 'submit'])
  const URL: any = computed(() => props.imgUrl || '')
  const dialogTitle: any = computed(() => props.title || '新建')
  const dialogVisible: any = computed({
    get: () => {
      return props.isShow
    },
    set: (value: any) => {
      emits('update:isShow', value)
    },
  })
  const projectRef = ref()
  const paramsForm = ref({
    projectName: '',
    projectColor: '#56abfb',
    projectCode: '',
    person: '',
    startTime: '',
    endTime: '',
    projectType: 0,
    projectKind: 0,
    isStar: 0,
    fromType: '',
    fromValue: '1',
    isPrivate: '',
    projectDesc: '',
  })
  const iconValue = ref('scrum')
  const isNext = ref(true)
  // const isPicker = ref(false)
  const rules = reactive({
    projectName: [{ required: true, message: '请输入名称', trigger: 'change' }],
    fromType: [{ required: true, message: '请选择所属类型', trigger: 'change' }],
    projectKind: [{ required: true, message: '请选择类型', trigger: 'change' }],
    projectCode: [{ required: true, message: '请输入标识', trigger: 'blur' }],
    isPrivate: [{ required: true, message: '请选择可见范围', trigger: 'change' }],
  })
  // 项目名称改变转为大写
  const changeName = (val: string) => {
    upPercase({ s: val }).then((res) => {
      if (res.code === 200) {
        paramsForm.value.projectCode = res.data || ''
      }
    })
  }

  const changeType = (val: any) => {
    console.log('val====', val)
    if (val) {
      iconValue.value = dict.typepeList[val].iconName
    }
  }
  // 日期配置
  // var d = new Date()
  // d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7))
  // console.log(d)
  const shortcuts = [
    {
      text: '今天',
      value: new Date(),
    },
    {
      text: '明天',
      value: () => {
        const date = new Date()
        date.setTime(date.getTime() + 3600 * 1000 * 24)
        return date
      },
    },
    {
      text: '下周',
      value: () => {
        const date = new Date()
        date.setDate(date.getDate() + ((1 + 7 - date.getDay()) % 7 || 7))
        date.setTime(date)
        return date
      },
    },
  ]
  // 限制日期
  const disabledDate = (time: Date) => {
    return time.getTime() < Date.now() - 3600 * 1000 * 24
  }
  // 监听弹窗关闭重置表单
  watch(
    () => dialogVisible.value,
    (newVal: any) => {
      if (!newVal) {
        projectRef.value?.resetFields()
        paramsForm.value = {
          projectName: '',
          projectColor: '#56abfb',
          projectCode: '',
          projectType: 0,
          projectKind: 0,
          isStar: 0,
          fromType: '',
          fromValue: '1',
          isPrivate: '',
          projectDesc: '',
        }
      }
    },
    {
      immediate: true,
    },
  )
  // 监听类型切换
  watch(
    () => paramsForm.value.projectKind,
    (newVal: any) => {
      if (newVal === 0) {
        imgUrl.value = Scrum
        descContent.value = dict.descList[0]
      } else if (newVal === 1) {
        imgUrl.value = kanban
        descContent.value = dict.descList[1]
      } else if (newVal === 2) {
        imgUrl.value = pubu
        descContent.value = dict.descList[2]
      }
    },
    {
      immediate: true,
    },
  )
  // 监听项目集
  watch(
    () => dialogTitle.value,
    (newVal: any) => {
      if (newVal === '新建项目集') {
        imgUrl.value = itemSet
        descContent.value = dict.descList[3]
        paramsForm.value.projectType = 1
        paramsForm.value.isPrivate = 1
        paramsForm.value.fromType = 0
      }
    },
    {
      immediate: true,
    },
  )
  const cancel = () => {
    emits('update:isShow', false)
  }
  //   上一步
  const handleBack = () => {
    isNext.value = true
  }
  //   下一步
  const handleNext = () => {
    projectRef.value?.validate((vali: boolean) => {
      if (vali) {
        isNext.value = false
      }
    })
  }
  // 表单提交
  const submitForm = () => {
    console.log('ruleForm=====', paramsForm.value)
    // if (dialogTitle.value === '新建项目集') {
    //   paramsForm.value.projectType = 1
    //   paramsForm.value.isPrivate = 1
    //   paramsForm.value.fromType = 0
    // }
    projectAdd(paramsForm.value).then((res) => {
      if (res.code === 200) {
        if (res.data) {
          ElMessage.success('新增成功')
          isNext.value = true
          emits('submit', '确定提交')
          emits('update:isShow', false)
        }
      }
    })
    // projectRef.value?.validate((vali: boolean) => {
    //   if (vali) {
    //     console.log('paramsForm', paramsForm.value)
    //     emits('update:isShow', false)
    //     emits('submit', '确定提交')
    //   }
    // })
  }
</script>

<style lang="scss" scoped>
  .dialog_box {
    .dialog_content {
      display: flex;
      div {
        flex: 1;
      }
      .left {
        padding: 0 20px;
        border-right: 1px solid #eee;
        .img_style {
          margin-bottom: 20px;
          padding: 20px;
          text-align: center;
          background: #fafafa;
        }
        .text_style {
          box-sizing: border-box;
          .btn {
            height: 14px;
            width: 14px;
            margin-right: 3px;
          }
        }
      }
      .right {
        padding: 0 20px;
        :deep(.el-input-group__prepend) {
          background-color: #fff;
          padding: 0 5px;
        }
        :deep(.el-color-picker__trigger) {
          border: none;
        }
        :deep(.el-color-picker__icon) {
          display: none !important;
        }
        :deep(.el-color-picker__color) {
          width: 0% !important;
          height: 0% !important;
          border: none;
        }
        :deep(.el-icon-arrow-down) {
          display: none !important;
        }
        :deep(.el-color-picker__color-inner) {
          position: relative !important;
          height: 20% !important;
          bottom: 0px;
          display: block !important;
        }
        :deep(.el-picker-panel__shortcut) {
          text-align: center;
          border: 1px solid #eee;
        }
      }
    }
  }
</style>
