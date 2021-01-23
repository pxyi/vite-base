<template>
  <div class="toolbar-container">
    <ToolItem />
    <ToolList />
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import ToolList from './tool-list.vue';
import ToolItem from './tool-item.vue';

export default {
  components:{ ToolList, ToolItem },
  setup() {
    
  }
}
</script>

<style lang="scss" scoped>
.toolbar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 0;
  position: relative;
  :deep(.title) {
    margin: 0 15px 12px;
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
