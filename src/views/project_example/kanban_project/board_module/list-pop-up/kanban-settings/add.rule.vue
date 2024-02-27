<template>
  <!-- 看板设置-添加规则 -->
  <el-dialog
    v-model="props.addRuleVisible"
    v-if="props.addRuleVisible"
    title="添加规则"
    :before-close="handleCancel"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      label-position="top"
      class="rule-ruleForm"
      size="large"
      status-icon
    >
      <el-form-item>
        <div class="setting-rule-item">
          <el-radio label="1" v-model="ruleForm.checkboxGroup">
            <img
              alt=""
              src="https://cdn-aliyun.pingcode.com/static/agile/assets/images/workflow/actionable-object.svg?v=5.26.0"
              style="width: 135px; height: 85px; flex-shrink: 0"
            />
            <div class="rule-card-content">
              <div> 配置可以变更状态的成员 </div>
              <div class="rule-description">只允许某些对象使用流转来变更工作项状态</div>
            </div>
          </el-radio>
        </div>
        <!-- ============================================ -->
        <div class="setting-rule-item">
          <el-radio label="2" v-model="ruleForm.checkboxGroup">
            <img
              alt=""
              src="https://cdn-aliyun.pingcode.com/static/agile/assets/images/workflow/actionable-property.svg?v=5.26.0"
              style="width: 135px; height: 85px; flex-shrink: 0"
            />
            <div class="rule-card-content">
              <div> 变更状态时的属性验证 </div>
              <div class="rule-description"
                >在工作项的特定属性满足条件时，允许使用流转来变更工作项状态</div
              >
            </div>
          </el-radio>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitForm"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, watchEffect } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { updateItemLabelist, addItemLabelist } from '@/api/modules/project.ts'

  // 接收父组件传递的参数
  const props = defineProps({
    addRuleVisible: Boolean,
  })

  //分发事件给父组件
  let emits = defineEmits(['closeRuleModel'])

  interface RuleForm {
    id: string
    checkboxGroup: string
  }
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive<RuleForm>({
    id: '',
    checkboxGroup: '1',
  })

  const rules = reactive<FormRules<RuleForm>>({
    // checkboxGroup: [{ required: true, message: '目标状态不能为空', trigger: 'change' }],
  })

  //  提交计划
  const submitForm = async () => {
    try {
      const valid = await ruleFormRef.value?.validate()
      if (!valid) {
        return
      }
      const formValue = ruleForm
      console.log('formValue!', formValue)
      const { code, data } = formValue.id
        ? await updateItemLabelist(formValue)
        : await addItemLabelist(formValue)
      if (code === 200 && data) {
        const message = formValue.id ? '编辑成功' : '新增成功'
        ElMessage.success({
          showClose: true,
          message: message,
        })
        ruleFormRef.value.resetFields()
        emits('closeRuleModel', data)
      }
    } catch (error) {
      console.log('error submit!')
    }
  }

  // 关闭-取消
  const handleCancel = () => {
    ruleFormRef.value.resetFields()
    emits('closeRuleModel', '')
  }
  // 默认获取父组件传递的树列表-和表格数据-依赖项变化的时候，重新执行改函数。
  // watchEffect(() => {})
</script>

<style lang="scss" scoped>
  .rule-ruleForm {
    box-sizing: border-box;
    .setting-rule-item {
      padding: 18px 20px;
      display: flex;
      align-items: center;
      cursor: pointer;
      border-radius: 0;
      background: transparent;
      box-shadow: 0 2px 8px #0000001a;
      position: relative;
      border: 1px solid #eee;
      margin-bottom: 12px;
      width: 100%;
      height: 120px;
      .rule-card-content {
        padding-left: 1.25rem;
      }
      .rule-description {
        color: #999;
      }
    }
    :deep(.el-radio__label) {
      display: flex;
    }
  }
</style>
