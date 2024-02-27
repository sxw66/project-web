<template>
  <div class="block-box">
    <div class="tip">设置卡片上显示的字段信息</div>
    <div class="content-container">
      <el-table :data="tableInfo.list" style="width: 100%" header-row-class-name="custom-header">
        <template v-for="item in tableInfo.colunm" :key="item.prop">
          <el-table-column :prop="item.prop" :label="item.label" :align="item?.align ?? 'left'">
            <template #default="{ row, column }">
              <div v-if="column.label == '显示'">
                <el-checkbox v-model="row.show"></el-checkbox>
              </div>
              <div v-else-if="column.label == '样式'">
                <div class="custom-style">{{ row.style }}</div>
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts" name="card">
  import { ref, reactive } from 'vue'
  const tableInfo: any = reactive({
    list: [
      {
        name: '关联工作项',
        style: '1',
        show: false,
      },
      {
        name: '测试',
        style: '1',
        show: false,
      },
      {
        name: '工时',
        style: '1/1',
        show: false,
      },
      {
        name: 'Branches',
        style: '1',
        show: true,
      },
      {
        name: 'Commits',
        style: '1',
        show: false,
      },
      {
        name: 'Pull Requests',
        style: '1',
        show: false,
      },
    ],
    colunm: [
      {
        prop: 'name',
        label: '名称',
      },
      {
        prop: 'style',
        label: '样式',
      },
      {
        prop: 'show',
        label: '显示',
        align: 'center',
      },
    ],
  })
</script>

<style scoped lang="scss">
  .block-box {
    width: 100%;
    height: 100%;
    .tip {
      color: #999;
      margin-bottom: 20px;
    }
    .content-container {
      width: 100%;
      //   height: 510px;
      //   border: 1px solid;
      .custom-style {
        width: fit-content;
        padding: 1px 10px;
        border-radius: 14px;
        background-color: #f5f5f5;
      }
    }
  }
  :deep(.el-table__header) {
    .custom-header {
      th {
        background-color: #fff !important;
        color: #666;
        font-size: 14px;
        font-weight: normal;
      }
    }
  }
</style>
