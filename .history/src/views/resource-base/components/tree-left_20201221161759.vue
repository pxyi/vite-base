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
import { ref } from "vue";
import axios from './../../../core/axios'
import { useStore } from "vuex";
export default {
  setup(props) {
     let store = useStore();
    console.log(store);
    
    let dataset: any[] = [
      {
        title: "一级-1",
        key: "1",
        children: [
          {
            title: "二级-1",
            key: "1-1",
            children: [
              {
                title: "三级-1",
                key: "1-1-1",
              },
              {
                title: "三级-2",
                key: "1-2-1",
              },
              {
                title: "三级-3",
                key: "1-3-1",
              },
            ],
          },
          {
            title: "二级-2",
            key: "1-2",
          },
          {
            title: "二级-3",
            key: "1-3",
          },
        ],
      },
      {
        title: "一级-2",
        key: "2",
        children: [
          {
            title: "2-二级-1",
            key: "2-1",
          },
          {
            title: "2-二级-2",
            key: "2-2",
          },
          {
            title: "2-二级-3",
            key: "2-3",
          },
        ],
      },
    ];

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
