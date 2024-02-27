<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="admin_view">
    <div class="top_title">概览</div>
    <div class="content">
      <div class="baseInfo">
        <!-- 组织信息 -->
        <div style="width: 25%">
          <div class="title">{{ `组织信息` }}</div>
          <div class="org_content">
            <div class="img_content">
              <img src="https://sc-cm.3irobotics.com/assets/logo_black.23f47567.png" />
              <p>{{ `杉川机器人` }}</p>
              <p>{{ `scfvccv@163.com` }}</p>
            </div>
            <div class="footer">
              <div class="version">
                <div class="footer_title">当前版本</div>
                <el-tag :type="'success'" class="mx-1" effect="light" round>
                  {{ `免费版` }}
                </el-tag>
              </div>
              <div class="owner">
                <div class="footer_title">组织所有者</div>
                <div class="avatar">
                  <el-avatar
                    :size="24"
                    style="font-size: 10px; background-color: rgb(154, 126, 244); color: #fff"
                    >{{ `头像` }}</el-avatar
                  >
                  <span class="avatar_font">头像</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 数量 -->
        <div class="subscription" style="width: 50%; margin: 0 10px">
          <div v-for="item in typeList" :key="item">
            <div class="link_box" @click="handleNext(item.title)">
              <div class="link_title">
                <div class="icon">
                  <!-- <el-icon><User /></el-icon> -->
                  <svg-icon :name="item?.iconName" />
                </div>
                <span>{{ `${item.title}` }}</span>
              </div>
              <div class="right">
                <div class="progress">
                  <el-progress :percentage="item.percentage" :format="format" />
                </div>
                <div class="count">{{ `${item.day}` }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 快捷入口 -->
        <div style="width: 25%">
          <div class="title">{{ `快捷入口` }}</div>
          <div class="org_content">
            <div v-for="(item, index) in entranceList" :key="item">
              <div
                class="link_box Entrance"
                @click="handleEntrance(item.title)"
                :style="{ marginTop: index !== 0 ? '20px' : '', padding: '20px' }"
              >
                <div class="link_title">
                  <div class="icon iconEnt">
                    <svg-icon :name="item?.iconName" />
                  </div>
                  <span>{{ `${item.title}` }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 活跃成员 -->
      <div class="chartInfo">
        <el-row>
          <el-col :span="24">
            <div class="title">{{ `活跃成员` }}</div>
            <div class="chart_box">
              <div class="liveness">
                <div style="flex: 1">
                  <div class="liveness_title">{{ `昨日活跃人数` }}</div>
                  <div class="liveness_content">
                    <span class="number">{{ `1` }}</span>
                    <span>人</span>
                  </div>
                </div>
                <div style="flex: 1">
                  <div class="liveness_title">{{ `昨日活跃人数` }}</div>
                  <div class="liveness_content">
                    <span class="number">{{ `20` }}</span>
                    <span>%</span>
                  </div>
                </div>
              </div>
              <div class="chart">
                <viewCharts :options="options" style="height: 400px"></viewCharts>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, defineAsyncComponent } from 'vue'
  import { useRouter } from 'vue-router'
  import { entranceList, typeList, options } from './constant'

  // 异步加载组件
  const viewCharts = defineAsyncComponent(() => import('@/components/echarts/index.vue')) // ECharts
  const router = useRouter()

  const format = (percentage) => (percentage === 100 ? '无限制' : `${percentage}`)
  // 页面跳转
  const handleNext = (val: string) => {
    if (val === '部门数量') {
      router.push({ path: '/admin/member' })
    } else {
      router.push({ path: '/admin/organization' })
    }
  }

  const handleEntrance = (val: string) => {
    if (val === '组织权限') {
      router.push({ path: '/admin/organization' })
    } else {
      console.log('打开添加成员弹窗', val)
    }
  }
</script>

<style lang="scss" scoped>
  .admin_view {
    height: 100%;
    width: 100%;
    .top_title {
      height: 50px;
      width: 100%;
      line-height: 50px;
      padding-left: 20px;
      background: #fff;
      border-bottom: 1px solid #eee;
      z-index: 999; //(一个你认为足够大的数，保证不被其他元素覆盖)
      position: fixed;
      top: 50px;
    }
    .content {
      margin: 12px;
      margin-top: 60px;
      height: calc(100% - 72px);
      .title {
        padding: 16px 28px;
      }
      .baseInfo {
        height: 385px;
        display: flex;
        margin-bottom: 10px;
        div {
          background-color: #fff;
        }
        .org_content {
          padding: 0 28px 24px;
          .img_content {
            margin-bottom: 42px;
            text-align: center;
            img {
              width: 200px;
              // height: 100px;
              height: 50px;
              margin: 20px 0 40px 0;
            }
          }
          .footer {
            display: flex;
            .version {
              position: relative;
              flex: 1;
              width: 50%;
              text-align: center;
              &::before {
                content: ' ';
                position: absolute;
                right: 0;
                top: 50%;
                width: 1px;
                height: 50px;
                transform: translateY(-50%);
                background-color: #eee;
              }
            }
            .owner {
              position: relative;
              flex: 1;
              width: 50%;
              text-align: center;
              .avatar {
                .avatar_font {
                  vertical-align: middle;
                  padding-left: 3px;
                }
              }
            }
            .footer_title {
              margin-bottom: 10px;
            }
          }
        }
        .subscription {
          padding: 5px 20px 30px;
        }
        .link_box {
          display: flex;
          padding: 25px 20px;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
          cursor: pointer;
          color: #333;
          .link_title {
            display: flex;
            align-items: center;
            color: #999;
            .icon {
              display: inline-flex;
              width: 36px;
              height: 36px;
              justify-content: center;
              align-items: center;
              border: 1px solid #eee;
              border-radius: 50%;
              margin-right: 10px;
              font-size: 12px;
            }
            .iconEnt {
              width: 44px;
              height: 44px;
              color: #6698ff;
              background-color: #eff4ff;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
            }
          }
          .right {
            display: flex;
            align-items: center;
            .progress {
              width: 100px;
              margin-right: 40px;
              :deep(.el-progress-bar__outer) {
                height: 10px !important;
              }
            }
            .count {
              width: 100px;
              font-size: 18px;
              color: #333;
            }
          }
        }
        .Entrance {
          border-bottom: none;
          border: 1px solid #eee;
          &:hover {
            border: 1px solid #72a0ff;
          }
        }
      }
      .chartInfo {
        height: 600px;
        background-color: #fff;
        .chart_box {
          padding: 0 28px 24px;
          .liveness {
            display: flex;
            width: 50%;
            margin-top: 5px;
            padding: 0 0 40px 40px;
            .liveness_title {
              font-size: 12px;
            }
            .liveness_content {
              line-height: 1.5;
            }
            .number {
              font-size: 24px;
            }
          }
          .chart {
            min-height: 400px;
          }
        }
      }
    }
  }
</style>
