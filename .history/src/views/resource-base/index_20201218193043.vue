<template>
  <!-- 内容主体区域 -->
  <div class="content">
    <!-- 左盒子 -->
    <div class="left_box">
      <!-- 搜索框 -->
      <!-- 树状图 -->
      <LeftTree />
    </div>
    <!-- 右盒子 -->
    <div class="right_box"></div>
  </div>

  <tree />
</template>

<script lang="ts">
import { ref, onMounted, Ref } from "vue";
import axios from "axios";
import LeftTree from "../tree.vue";
export default {
  components: { LeftTree },
};
</script>

<style lang="scss" scoped>
.content{
    .left_box{
        background-color: #fff;
    }
}
</style>
