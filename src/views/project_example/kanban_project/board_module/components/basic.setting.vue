<template>
  <div class="block-box">
    <el-form ref="RefFormInfo" :model="formInfo" :rules="rulseInfo" label-position="top">
      <el-form-item label="名称" prop="kanbanName">
        <el-input
          clearable
          maxlength="32"
          show-word-limit
          v-model="formInfo.kanbanName"
          placeholder="请输入看板名称"
        />
      </el-form-item>
    </el-form>
    <div class="dsc">
      <div class="tips">选择看板可以支持的工作项类型</div>
      <div class="alert">移除类型后看板上对应类型工作项会被移出看板</div>
      <div>
        <el-checkbox-group @change="handleSelectChange" v-model="formInfo.workTypes">
          <el-checkbox v-for="item in list" :label="item.value" :key="item.label">
            <svg-icon size="14" :name="item.icon" :color="item.bgc"></svg-icon>
            <span class="custom-label" style="margin-left: 6px">{{ item.label }}</span>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="basic">
  import { ref, reactive, nextTick, withDefaults, watch } from 'vue'
  import { updateKanbanBasicSettingList, updateProductKanBan } from '@/api/modules/project'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useProjectStore } from '@/store/modules/project'
  interface Iprops {
    kanbanRowData?: any
  }
  const props = withDefaults(defineProps<Iprops>(), {
    kanbanRowData: {},
  })
  const Store = useProjectStore()
  const RefFormInfo = ref()
  const formInfo: any = ref({
    kanbanName: '',
    workTypes: [],
  })
  const list = [
    {
      label: '史诗',
      value: '0',
      icon: 'epic',
      bgc: 'rgb(255, 135, 123)',
    },
    {
      label: '特性',
      value: '1',
      icon: 'features',
      bgc: 'rgb(145, 145, 249)',
    },
    {
      label: '用户故事',
      value: '2',
      icon: 'story',
      bgc: 'rgb(48, 209, 252)',
    },
    {
      label: '任务',
      value: '3',
      icon: 'finishWorkItem',
      bgc: 'rgb(115, 216, 151)',
    },
    {
      label: '缺陷',
      value: '4',
      icon: 'shortcoming',
      bgc: 'rgb(255, 117, 117)',
    },
    {
      label: '事务',
      value: '5',
      icon: 'work',
      bgc: 'rgb(154, 126, 244)',
    },
  ]
  const rulseInfo = reactive({
    kanbanName: [{ required: true, message: '请输入名称', trigger: ['change', 'blur'] }],
  })
  watch(
    () => props.kanbanRowData,
    () => {
      const len = Object.keys(props.kanbanRowData)?.length
      if (len > 0) {
        const isArray = Array.isArray(props.kanbanRowData?.workTypes)
        if (!isArray && props.kanbanRowData?.workTypes?.length > 0) {
          Object.assign(formInfo.value, props.kanbanRowData)
          formInfo.value.workTypes = formInfo.value?.workTypes?.split(',')
        }
      }
    },
    {
      immediate: true,
    },
  )
  const handleSelectChange = (data) => {
    // console.log('%c [ data ]-30', 'font-size:13px; background:pink; color:#bf2c9f;', data)
  }
  //新增看板基础设置
  const handleUpdateKanbanBasicSettingList = async () => {
    try {
      nextTick(() => {
        RefFormInfo.value.validate(async (vali) => {
          if (!vali) {
            return
          }
          const params: any = {
            ...formInfo.value,
          }
          params.workTypes =
            Array.isArray(params.workTypes) && params.workTypes?.length > 0
              ? params.workTypes?.join(',')
              : ''
          const { code }: any = await updateProductKanBan(params)
          if (code === 200) {
            Store.handleSetUpdateKanbanList()
            ElMessage({
              showClose: true,
              message: '修改成功',
              type: 'success',
            })
          }
        })
      })
    } catch (error) {
      console.log('Error', error)
    }
  }

  defineExpose({ handleUpdateKanbanBasicSettingList })
</script>

<style scoped lang="scss">
  .block-box {
    width: 100%;
    .dsc {
      //   border: 1px solid;
      margin-top: 30px;
      .tips {
        margin: 10px 0;
      }
      .alert {
        margin: 10px 0 24px;
        color: #aaa;
      }
    }
  }
  :deep(.el-checkbox-group) {
    display: flex;
    flex-direction: column;
    .el-checkbox {
      width: fit-content;
    }
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    .custom-label {
      color: #606266;
    }
  }
</style>
