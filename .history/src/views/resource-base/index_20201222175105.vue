<template>
  <template ref="headerRef">
    <HeaderRefComponent
      @type-change="params.type = $event"
      @search="params.title = $event"
    />
  </template>
  <!-- 内容主体区域 -->
  <div class="content">
    <!-- 左盒子 -->
    <div class="left_box">
      <!-- 左侧树状图 -->
      <TreeLeft />
    </div>

    <!-- 右盒子 -->
    <div class="right_box">
      <!-- tab切换 -->
      <div class="right_tab">
        <Tabs />
      </div>
      <!-------------->
      <!-- 右侧导航 -->
      <RightNav />
      <!-- 右侧内容 -->
      <RightContent />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, Ref } from "vue";
import axios from "axios";
import { AxResponse } from "~/@/core/axios";
import emitter from "../../utils/mitt";
import HeaderRefComponent from "../resource-base/components/header-ref.vue";
import TreeLeft from "../resource-base/components/tree-left.vue";
import Tabs from "../resource-base/components/tabs.vue";
import RightNav from "../resource-base/components/right-nav.vue";
import RightContent from "../resource-base/components/right-content.vue";
import { useStore } from "vuex";

export default {
  components: { HeaderRefComponent, TreeLeft, Tabs ,RightNav,RightContent},
  setup() {
    let headerRef = ref();
    onMounted(() => emitter.emit("slot", headerRef));
    return { headerRef };
  },
};
</script>

<style lang="scss" scoped>
.content {
// overflow:hidden
  .left_box {
    float: left;
    display: inline-block;
    width: 250px;
    height: 810px;  
    background-color: #fff;
    .left_search {
      width: 226px;
      height: 40px;
      background: rgba(255, 255, 255, 1);
      border-radius: 3px;
      border: 1px solid rgba(235, 240, 252, 1);

      img {
        display: inline-block;
        margin: 10px 6px 10px 12px;
        float: left;
      }
      input {
        float: left;
        width: 86%;
        border: 0;
        height: 100%;
        border-radius: 3px;
        background: transparent;
        outline: none;
        color: #c8cbd0;
      }
      input::placeholder {
        color: rgba(119, 128, 141, 1);
      }
    }
  }
  .right_box {
    height: 810px;
    width: 90%;
    background-color: #fff;
    margin-left: 20px;
    .right_tab {
      // width: 90%;
      // // background-color: #fff;
      // height: 50px;
    }
  }
}
</style>
