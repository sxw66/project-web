<template>
  <div>
    <h1>概览</h1>
    <el-row class="row-bg" :gutter="10">
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>折线图</span>
            </div>
          </template>
          <line-charts height="200px" width="100%" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>K 线图</span>
            </div>
          </template>
          <candlestick-charts height="200px" width="100%" id="candlestick" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useProjectStore } from '@/store/modules/project'
  import LineCharts from './line.charts.vue'
  import CandlestickCharts from './candlestick.charts.vue'

  import { projectPage, getStarsList, productDetail } from '@/api/modules/project.ts'

  const route = useRoute()
  const Router = useRouter()
  const ProjectStore = useProjectStore()

  // 根据ID查询项目基础信息表详情
  const handeProjectDetails = async () => {
    await productDetail(ProjectStore.projectId).then(async (res) => {
      if (res.code === 200) {
        if (res.data) {
          // 获取选中的星标列表
          console.log('根据ID查询项目基础信息表详情', res.data)
        }
      }
    })
  }
  onMounted(() => {
    console.log('==概览=')
    handeProjectDetails()
  })
</script>

<style lang="scss" scoped></style>
