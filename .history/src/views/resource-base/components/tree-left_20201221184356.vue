<template>
  <div>
    <!-- 头部搜索框 -->
    <div class="seachInput">
      <el-input placeholder="按知识点搜索" prefix-icon="el-icon-search">
      </el-input>
    </div>
    <el-tree
  :data="data"
  show-checkbox
  node-key="id"
 :loading="loading"
  >
</el-tree>
  </div>
</template>

<script lang="ts">
import { ref, Ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { AxResponse } from "../../../core/axios";

export default {
  setup() {
    let store = useStore();
    let loading = ref(true)
    let dataset: Ref<any[]> = ref([]);
    let params: any = {
      subject: store.getters.subject,
    };
    const data:any[] = [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }]
    axios.post<any, AxResponse>("/tiku/bookVersion/queryVresionBookTree", params).then((res) => {
        if (res.result) {
          dataset = res.json;
        }
      });
    console.log(dataset);
    const foldHandle = (node: any) => {
      console.log("folded", node);
    };
    const checkHandle = (node: any) => {
      console.log("checked", node);
    };

    const loadHandle = (node: any, resolve: () => void) => {
      setTimeout(resolve, 1000, [{ title: "一级-2", key: "2" }]);
    };

    return { dataset, foldHandle, checkHandle, loadHandle,data };
  },
};
</script>
<style lang="scss" scoped>
.seachInput {
  padding: 10px;
}
</style>
