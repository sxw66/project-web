<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  const router = useRouter()
</script>

<template>
  <div class="app-container">
    <div class="flex test-box">
      <div class="left">
        <h1>左边内容</h1>
      </div>
      <div class="right">
        <h1>示例产品</h1>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .flex {
    display: flex;
  }

  .test-box {
    height: 100%;

    .left {
      width: 240px;
      background-color: #fbfbfb;
    }

    .right {
    }
  }
</style>
