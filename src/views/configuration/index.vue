<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="config_center">
    <component v-bind:is="pageInfoList[pageInit]" @configTab="changeTabs"></component>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineAsyncComponent, reactive, onMounted } from 'vue'

  const baseInfo = defineAsyncComponent(() => import('./components/baseInfo.vue'))
  const memberInfo = defineAsyncComponent(() => import('./components/memberInfo.vue'))
  const organizationInfo = defineAsyncComponent(() => import('./components/organizationInfo.vue'))
  const applyInfo = defineAsyncComponent(() => import('./components/applyInfo.vue'))
  const productInfo = defineAsyncComponent(() => import('./components/productInfo.vue'))

  const pageInit = ref('BASEINFO')
  const pageInfoList = {
    BASEINFO: baseInfo,
    MEMBERINFO: memberInfo,
    ORGANIZATIONINFO: organizationInfo,
    APPLYINFO: applyInfo,
    PRODUCTINFO: productInfo,
  }
  const changeTabs = (val: string) => {
    switch (val) {
      case '1':
        pageInit.value = 'BASEINFO'
        break
      case '2':
        pageInit.value = 'MEMBERINFO'
        break
      case '3':
        pageInit.value = 'ORGANIZATIONINFO'
        break
      case '4':
        pageInit.value = 'APPLYINFO'
        break
      case '5':
        pageInit.value = 'PRODUCTINFO'
        break
    }
  }
</script>

<style lang="scss" scoped>
  .config_center {
    height: 100%;
    width: 100%;
  }
</style>
