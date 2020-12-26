<template>
  <div class="toolbar-container">
    <div class="title">{{ isItem && isItem.id ? '设置标签' : '题目列表' }}</div>
    <!-- <transition name="fade" :duration="500"> -->
    <ToolItem />
    <ToolList />
    <!-- </transition> -->
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

.fade-enter-active,
.fade-leave-active {
  width: 100%;
  position: absolute;
  z-index: 1;
}
.fade-enter-active {
  animation: fadeEnter .5s;
}
.fade-leave-active {
  animation: fadeLeave .5s;
}
@keyframes fadeLeave {
  0%  { opacity: 1; }
  100%{ opacity: 0; }
}
@keyframes fadeEnter {
  0%  { opacity: 0; }
  100%{ opacity: 1; }
}
</style>