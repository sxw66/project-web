<template>
  <div class="block-box">
    <div class="tip">只有默认泳道时，将隐藏泳道分组</div>
    <ul class="content-list">
      <!-- 动态列表 -->
      <li
        class="list-item"
        v-for="(item, idx) in laneList"
        :key="idx"
        :class="{ 'switch-editable': !item.edit }"
      >
        <!-- 内容展示 -->
        <div class="content" v-show="item.edit">{{ item.laneName }}</div>
        <!-- 操作 -->
        <div class="operate" v-show="item.edit">
          <el-tooltip placement="top" content="修改" :enterable="false">
            <svg-icon class="edit" name="edit" size="16" @click="handleClickEdit(item, idx)">
            </svg-icon>
          </el-tooltip>
          <el-tooltip placement="top" content="删除" :enterable="false">
            <svg-icon
              v-show="!item.isDefault"
              class="delete"
              name="delete"
              size="16"
              @click="handleClickDelete(item)"
            >
            </svg-icon>
          </el-tooltip>
        </div>
        <!-- 编辑 -->
        <div v-show="!item.edit" class="editable">
          <el-input
            ref="RefInput"
            type="textarea"
            v-model="item.laneName"
            placeholder="按回车键（enter）保存"
            style="width: 100%; height: 100%"
            @blur="handleInputBlur(item)"
          >
          </el-input>
        </div>
      </li>
      <!-- 新增 -->
      <li v-show="!showAdd" class="list-item add-position" :class="{ 'switch-editable': !showAdd }">
        <div class="editable">
          <el-input
            ref="RefAddInput"
            type="textarea"
            v-model="AddContent"
            placeholder="按回车键（enter）保存"
            style="width: 100%; height: 100%"
          >
          </el-input>
        </div>
        <div class="submit-btn">
          <el-button @click="handleCancelAdd">取消</el-button>
          <el-button type="primary" @click="handleComfirmAdd">确定</el-button>
        </div>
      </li>
    </ul>
    <!-- 新增按钮 -->
    <div class="add-lane" @click="handleClickAddLane" v-show="showAdd">
      <svg-icon size="16" name="plus"></svg-icon>
      <span style="margin-left: 6px" class="dsc">新建泳道</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import {
    getKanbanLaneList,
    addKanbanLaneList,
    updateKanbanLaneList,
    deleteKanbanLaneList,
  } from '@/api/modules/project'
  import { ElMessage } from 'element-plus'
  const laneList = ref([])
  const isEdit = ref(false)
  const rowData = ref({})
  const showAdd = ref(true)
  const AddContent = ref('')
  const RefAddInput = ref()
  const RefInput = ref()
  const staticContent = ref('')
  const isConfirm = ref(false)
  onMounted(() => {
    window.addEventListener('keyup', handleKeyup)
  })
  //动态数据的键盘事件
  const handleKeyup = async (e) => {
    if (isEdit.value && e.keyCode == 13) {
      rowData.value.laneName = rowData.value.laneName.slice(0, -1)
      await handleUpdateLaneList({ ...rowData.value })
      isEdit.value = false
      rowData.value.edit = true
      isConfirm.value = true
    }
  }
  //获取泳道列表
  const handleGetLaneList = async () => {
    try {
      const params = {
        pageNum: 1,
        pageSize: 15,
      }
      const { code, data } = await getKanbanLaneList(params)
      if (code === 200) {
        data?.records?.forEach((item) => {
          item.edit = true
        })
        laneList.value = data?.records.map((item, idx) => {
          const obj = { isDefault: false, ...item }
          if (idx == 0) {
            obj.isDefault = true
          }
          return obj
        })
      }
    } catch (error) {
      console.log('Error', error)
    }
  }
  handleGetLaneList()
  //修改泳道列表
  const handleUpdateLaneList = async (data) => {
    try {
      const params = {
        ...data,
      }
      const { code } = await updateKanbanLaneList(params)
      if (code === 200) {
        await handleGetLaneList()
        ElMessage({
          showClose: true,
          message: '更新成功',
          type: 'success',
        })
      }
    } catch (error) {
      console.log('Error', error)
    }
  }
  //编辑
  const handleClickEdit = (item, idx) => {
    rowData.value = item
    isEdit.value = true
    showAdd.value = true
    isConfirm.value = false
    item.edit = false
    RefInput.value[idx].focus()
    staticContent.value = item.laneName
  }
  //失焦
  const handleInputBlur = (item) => {
    if (isConfirm.value) {
      return
    }
    item.laneName = staticContent.value
    item.edit = true
  }
  const handleDeleteLaneList = async (id) => {
    try {
      const params = {
        id,
      }
      const { code } = await deleteKanbanLaneList(params)
      if (code === 200) {
        await handleGetLaneList()
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
  //删除
  const handleClickDelete = async (row) => {
    await handleDeleteLaneList(row.id)
    showAdd.value = true
  }
  const handleAddInputBlur = () => {
    showAdd.value = true
    AddContent.value = ''
  }
  //新增
  const handleClickAddLane = () => {
    showAdd.value = false
    RefAddInput.value.focus()
    AddContent.value = ''
  }
  //取消新增
  const handleCancelAdd = () => {
    showAdd.value = true
  }
  //新增泳道列表
  const handlAddLaneList = async () => {
    try {
      const params = {
        laneName: AddContent.value,
      }
      const { code } = await addKanbanLaneList(params)
      if (code === 200) {
        await handleGetLaneList()
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
  //确认新增
  const handleComfirmAdd = async () => {
    if (AddContent.value == '') {
      return
    }
    await handlAddLaneList()
    showAdd.value = true
  }
  onUnmounted(() => {
    window.removeEventListener('keyup', handleKeyup)
  })
</script>

<style scoped lang="scss">
  .block-box {
    width: 100%;
    height: 100%;
    .tip {
      color: #999;
    }
    .content-list {
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      .list-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 44px;
        padding: 0 27px;
        box-sizing: border-box;
        border-top: 1px solid #eee;
        &:nth-child(1) {
          border: none;
        }
        &:hover {
          background-color: #f5f5f5;
        }
        .content {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .operate {
          width: 54px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-left: 7px;
          .edit {
            &:hover {
              color: #6698ff;
            }
          }
          .delete {
            &:hover {
              color: #f53f3f;
            }
          }
        }
        .submit-btn {
          position: absolute;
          bottom: -50px;
          right: 6px;
        }
      }
      .add-position {
        position: relative;
      }
      .editable {
        width: 100%;
        height: 100%;
        :deep(.el-textarea) {
          .el-textarea__inner {
            // padding: 1px 0 !important;
          }
        }
      }
    }
    .default-switch-editable {
      padding: 0 !important;
      height: 100%;
    }
    .switch-editable {
      padding: 0 !important;
      height: 100%;
    }
    .add-lane {
      width: fit-content;
      color: #6698ff;
      cursor: pointer;
      user-select: none;
      &:hover .dsc {
        text-decoration: underline;
      }
    }
  }
  .el-tooltip__trigger {
    outline: none;
  }
</style>
