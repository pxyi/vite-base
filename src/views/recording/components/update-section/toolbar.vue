<template>
  <div class="toolbar-container">
    <div class="title">题目列表</div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
export default {
  setup() {
  }
}
</script>

<style lang="scss" scope>
.toolbar-container {
  padding: 20px 15px;
  .title {
    margin-bottom: 20px;
    height: 40px;
    color: #fff;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    background: #1AAFA7;
    border-radius: 6px;
  }
}
</style>