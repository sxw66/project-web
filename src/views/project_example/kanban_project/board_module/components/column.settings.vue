<template>
  <div class="block-box">
    <div style="width: 100%">
      <el-tabs
        style="width: 100%"
        type="card"
        v-model="editableTabsValue"
        @edit="handleEdit"
        @tab-change="handleTabChange"
      >
        <el-tab-pane
          v-for="item in list"
          :key="item.label"
          :label="item.label"
          :closable="handleClosable(item)"
          :name="item.name"
        >
          <template #label>
            <div v-if="item.name != 'add'">
              {{ item.label }}
            </div>
            <div v-else @click="handleClickTabAdd">
              <el-icon><Plus /></el-icon>
              <span style="margin-left: 4px">{{ item.label }}</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <div v-if="editableTabsValue == '0'" class="default-column">
        <div class="alert">默认情况下，新的工作项会进入此栏。此栏不可删除。</div>
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
        </el-form>
      </div>
      <div v-else class="custom-column">
        <UpdateForm v-model="formInfo" ref="RefUpdateForm" :key="updateKey"></UpdateForm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="column">
  import { ref, onMounted, watch, reactive, defineAsyncComponent } from 'vue'
  import { ElMessage } from 'element-plus'
  import {
    getKanbanColumnList,
    addKanbanColumnList,
    updateKanbanColumnList,
    deleteKanbanColumnList,
  } from '@/api/modules/project'
  const UpdateForm = defineAsyncComponent(() => import('./column.form.vue'))
  const updateKey = ref(0)
  const RefForm = ref()
  const RefUpdateForm = ref()
  const list = ref([])
  const tabsList = ref([])
  const add = { label: '新增栏', name: 'add' }
  const editableTabsValue = ref('0')
  const isAdd = ref(false)
  const formInfo: any = ref({
    columnName: '',
  })
  const rulesInfo = reactive({
    columnName: [{ required: true, message: '请输入名称', trigger: ['change', 'blur'] }],
  })
  watch(
    () => tabsList.value,
    () => {
      list.value = [...tabsList.value, add]
    },
    {
      deep: true,
    },
  )
  //切换tabs
  const handleTabChange = (actived) => {
    isAdd.value = actived == 'add'
    const formItem = tabsList.value.find((item) => item.name == actived)
    formInfo.value = { ...formItem }
    updateKey.value++
  }
  const handleClosable = (item) => {
    if (item.name == '0' || item.name == 'add') {
      return false
    } else {
      return true
    }
  }
  const handleEdit = (name, action) => {
    if (action == 'remove') {
      hanldeDeleteColumnList(name)
    }
  }
  const handleClickTabAdd = () => {
    formInfo.value = {}
  }
  //获取栏设置列表
  const handleGetColumnList = async () => {
    try {
      const params = {
        pageNum: 1,
        pageSize: 15,
      }
      const { code, data } = await getKanbanColumnList(params)
      if (code === 200) {
        tabsList.value = data.records?.map((item, idx) => {
          const obj = { name: item.id, label: item.columnName, ...item }
          if (idx == 0) {
            obj.name = '0'
          }
          return obj
        })
        console.log(data, 'data')
      }
    } catch (error) {
      console.log('Error', error)
    }
  }
  //新增栏设置列表
  const hanldeaddColumnList = async () => {
    try {
      const params = {
        ...formInfo.value,
      }
      params.columnKind = params.columnKind ? 1 : 0
      const { code } = await addKanbanColumnList(params)
      if (code === 200) {
        await handleGetColumnList()
        const lastData = tabsList.value.find((item, index) => index == tabsList.value?.length - 1)
        editableTabsValue.value = lastData.name
        formInfo.value = { ...lastData }
        updateKey.value++
        ElMessage({
          showClose: true,
          message: '新增成功',
          type: 'success',
        })
      }
    } catch (error) {
      console.log('Error', error)
    }
  }
  //修改栏设置列表
  const hanldeUpdateColumnList = async () => {
    try {
      const params = {
        ...formInfo.value,
      }
      params.columnKind = params.columnKind ? 1 : 0
      const { code } = await updateKanbanColumnList(params)
      if (code === 200) {
        await handleGetColumnList()
        ElMessage({
          showClose: true,
          message: '修改成功',
          type: 'success',
        })
      }
    } catch (error) {
      console.log('Error', error)
    }
  }
  //删除栏设置列表
  const hanldeDeleteColumnList = async (id) => {
    try {
      const params = { id }
      const { code } = await deleteKanbanColumnList(params)
      if (code === 200) {
        const idx = tabsList.value.findIndex((item) => item.name == id) - 1
        const previousData = tabsList.value.find((item, index) => index == idx)
        editableTabsValue.value = previousData.name
        formInfo.value = { ...previousData }
        updateKey.value++
        await handleGetColumnList()
        ElMessage({
          showClose: true,
          message: '删除成功',
          type: 'success',
        })
      }
    } catch (error) {
      console.log('Error', error)
    }
  }
  const handleUpdateColumnSettingList = () => {
    try {
      console.log(formInfo.value, 'formInfo')
      //默认名称
      RefForm.value &&
        RefForm.value.validate(async (vali) => {
          if (!vali) {
            return
          }
          hanldeUpdateColumnList()
        })
      //列表数据
      RefUpdateForm.value &&
        RefUpdateForm.value.validate(async () => {
          if (isAdd.value) {
            hanldeaddColumnList()
          } else {
            hanldeUpdateColumnList()
          }
        })
    } catch (error) {
      console.log('Error', error)
    }
  }
  onMounted(async () => {
    await handleGetColumnList()
    list.value = [...tabsList.value, add]
    formInfo.value = tabsList.value.find((item, idx) => idx == 0)
  })
  defineExpose({ handleUpdateColumnSettingList })
</script>

<style scoped lang="scss">
  .block-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 1px solid #eee;
    .default-column {
      padding: 15px 20px 20px;
      box-sizing: border-box;
      .alert {
        color: #aaa;
        margin-bottom: 8px;
      }
    }
    .custom-column {
      padding: 15px 20px 20px;
      box-sizing: border-box;
    }
  }
</style>
