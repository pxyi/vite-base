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
      <TreeLeft @treeEmit="checkTree"/>
    </div>
    <!-- 右盒子 -->
    <div class="right_box">
      <!-- tab切换 -->
      <div class="right_tab">
        <!-- <Tabs @tableEmit="checkDialog"/> -->
        <Tabs  />
      </div>
    </div>
    <div class="gray"></div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, Ref, provide } from "vue";
import axios from "axios";
import { AxResponse } from "~/@/core/axios";
import emitter from "../../utils/mitt";
import HeaderRefComponent from "../resource-base/components/header-ref.vue";
import TreeLeft from "../resource-base/components/tree-left.vue";
import Tabs from "./components/tabs.vue";
import { useStore } from "vuex";

export default {
  components: { HeaderRefComponent, TreeLeft, Tabs },
  setup() {
    let params: Ref<any> = ref({});
    emitter.emit("effect", (id) => (params.value.subjectId = id));
    let headerRef = ref();
    let tableParam = {
      chapterId: [],
    };
    let isShow = false;
    onMounted(() => emitter.emit("slot", headerRef));
    function checkDialog(params) {
      tableParam = params;
      if (!tableParam.chapterId.length) {
        isShow = true;
      } else {
        isShow = false;
      }
      console.log(tableParam, "xiaoguaiparam", isShow);
      provide("customVal", isShow);
    }
    
     let pageParam = {
      current: 1,
      size: 20,
      chapterId: [],
      isPublic: 1,
      lastLevelId: [],
      ext: null,
      fileName: "",
      courseId: "",
      subject: "chinese3",
      type: null,
    };
    provide("pageParam", pageParam);
    const childTable = ref();
    const checkTree = (params) => {
      // console.log(params, "treeparams");
      pageParam.chapterId = params;
      childTable.value.getMaterialQueryPage();      //sonFn是子组件里的方法
    };
    return { headerRef, params, checkDialog, isShow,checkTree };
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  .left_box {
    flex: 1.5;
    // width: 100%;
    height: 100%;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0px 1px 6px 0px rgba(91, 125, 255, 0.08);
    .left_search {
      width: 226px;
      height: 40px;
      background: rgba(255, 255, 255, 1);
      border-radius: 3px;
      border: 1px solid rgba(235, 240, 252, 1);
    }
  }
  .right_box {
    flex: 5;
    background-color: #fff;
    margin-left: 20px;
    height: 100%;
    box-shadow: 0px -2px 6px 0px rgba(91, 125, 255, 0.08);
    min-height: 300px;
    .right_tab {
      width: 98%;
      height: 100%
    }
  }
  .gray{
    flex: 0.8;
  }
}
</style>
