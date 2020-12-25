<template>
  <!-- 内容主体区域 -->
  <div class="content">
    <!-- 左盒子 -->
    <div class="left_box">
      <!-- 搜索框 -->
      <div class="left_search">
          <img src="../../assets/images/shape.png" alt="">
          <input type="text">
      </div>
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
import { AxResponse } from '~/@/core/axios';
export default {
  components: { LeftTree },
  setup() {
      const treeList = async ()=>{
        //   let res = await axios.post<any,AxResponse>('tiku/bookVersion/queryVresionBookTree')
      }
  }
};
</script>

<style lang="scss" scoped>
.content{
    .left_box{
        width: 250px;
        height: 860px;
        background-color: #fff;
        .left_search{
            width: 226px;
            height: 40px;
            background-color: #333;
            input{
                // float: left;
      width: 86%;
      border: 0;
      height: 100%;
      border-radius: 3px;
      background: transparent;
      outline: none;
            }
        }
    }
}
</style>
