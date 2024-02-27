<template>
  <div class="form-box">
    <el-form ref="RefForm" :model="formInfo" :rules="rulesInfo" label-position="top">
      <el-form-item prop="columnName" label="名称">
        <el-input
          v-model="formInfo.columnName"
          placeholder="请输入名称"
          clearable
          show-word-limit
          :maxlength="32"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="在制品限制（WIP limit)">
        <el-input-number
          style="width: 100%"
          v-model="formInfo.limitNum"
          placeholder="在制品数量"
          :min="0"
          :max="9999"
          controls-position="right"
        >
        </el-input-number>
      </el-form-item>
      <el-form-item label="拆分" class="form-item">
        <el-checkbox v-model="formInfo.columnKind">将栏拆分为进行中和已完成</el-checkbox>
      </el-form-item>
      <el-form-item label="完成的定义（DoD)">
        <el-input type="textarea" :rows="8" placeholder="输入描述" v-model="formInfo.finished">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch } from 'vue'
  const props = defineProps(['modelValue'])
  const emit = defineEmits(['update:modelValue'])
  const RefForm = ref()
  const formInfo: any = ref({
    columnName: '',
    columnKind: false,
  })
  const rulesInfo = reactive({
    columnName: [{ required: true, message: '请输入名称', trigger: ['change', 'blur'] }],
  })
  watch(
    () => formInfo.value,
    (value) => {
      emit('update:modelValue', value)
    },
    {
      immediate: true,
    },
  )
  watch(
    () => props.modelValue,
    () => {
      Object.assign(formInfo.value, props.modelValue)
      formInfo.value.columnKind = Boolean(formInfo.value?.columnKind)
    },
    {
      immediate: true,
    },
  )
  const validate = (submit) => {
    RefForm.value.validate((vali) => {
      vali && submit()
    })
  }
  defineExpose({ validate })
</script>

<style scoped lang="scss">
  .form-box {
    width: 100%;
    height: 100%;
  }
  :deep(.form-item) {
    .el-checkbox {
      .el-checkbox__label {
        color: #999 !important;
      }
    }
    .el-checkbox.is-checked {
      .el-checkbox__label {
        color: black !important;
      }
    }
  }
</style>
