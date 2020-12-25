<template>
  <div>
    <!-- 头部搜索框 -->
    <div class="seachInput">
      <el-input placeholder="按知识点搜索" prefix-icon="el-icon-search">
      </el-input>
    </div>
    <!-- <cus-tree :data-set="dataset" ref="treeRef" :show-checkbox="true" @on-fold="foldHandle" @on-check="checkHandle" :load="loadHandle" /> -->
    <cus-tree :data-set="dataset" allow-select />
  </div>
</template>

<script lang="ts">
import { ref , Ref } from "vue";
import axios from './../../../core/axios'
import { useStore } from "vuex";
export default {
  setup() {
     let store = useStore();
     console.log(store);
     
    console.log(store.getters.subject);
    
    let dataset:Ref<any[]> = ref([])
    let params: any = {
      subject: store.getters.subject
    };
    console.log(params);
    
    

    const foldHandle = (node: any) => {
      console.log("folded", node);
    };
    const checkHandle = (node: any) => {
      console.log("checked", node);
    };

    const loadHandle = (node: any, resolve: () => void) => {
      setTimeout(resolve, 1000, [{ title: "一级-2", key: "2" }]);
    };

    return { dataset,  foldHandle, checkHandle, loadHandle };
  },
};
</script>
<style lang="scss" scoped>
.seachInput {
  padding: 10px;
}
</style>
