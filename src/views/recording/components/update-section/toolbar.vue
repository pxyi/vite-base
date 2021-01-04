<template>
  <div class="toolbar-container">
    <div class="title">{{ isItem && isItem.id ? '设置标签' : '题目列表' }}</div>
    <ToolItem />
    <ToolList />
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import ToolList from './tool-list.vue';
import ToolItem from './tool-item.vue';
import store from './../store';

export default {
  components:{ ToolList, ToolItem },
  setup() {
    let isItem = computed(() => store.state.focusData);

    return { isItem };
  }
}
</script>

<style lang="scss" scope>
.toolbar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 0;
  .title {
    margin: 0 15px;
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