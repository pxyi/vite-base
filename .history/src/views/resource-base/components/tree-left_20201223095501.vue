<template>
  <div class="left-tree">
    <!-- 头部搜索框 -->
    <div class="seachInput">
      <el-input placeholder="按知识点搜索" prefix-icon="el-icon-search">
      </el-input>
    </div>
    <el-tree
      :data="dataset"
      show-checkbox
      v-loading="loading"
      :props="props"
      empty-text="正在加载"
      :default-expanded-keys="[2, 3]"
    >
    </el-tree>
    <!-- <cus-tree :data-set="dataset" allow-select v-loading="loading"  :props='props' empty-text='正在加载'/> -->
  </div>
</template>

<script lang="ts">
import { ref, reactive, Ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { AxResponse } from "../../../core/axios";
import emitter from "../../../utils/mitt";
import { ElMessage, ElLoading } from "element-plus";
export default {
  setup() {
    let loading = ref();
    let dataset: Ref<any[]> = ref([]);
    let store = useStore();
    let params = {
      // subject: store.getters.subject,
      subject: "chinese3",
    };
 

    let props = reactive({
      label: "name",
      children: "childs",
    });
    loading.value = true;
    // console.log(params);
    axios
      .post<any, AxResponse>("/tiku/bookVersion/queryVresionBookTree", params)
      .then((res) => {
        if (res.result) {
          dataset.value = res.json;
          // console.log(dataset);
          loading.value = false;
        } else {
          ElMessage.error(res.msg);
        }
      });

    const foldHandle = (node: any) => {
      console.log("folded", node);
    };
    const checkHandle = (node: any) => {
      console.log("checked", node);
    };

    const loadHandle = (node: any, resolve: () => void) => {
      setTimeout(resolve, 1000, [{ title: "一级-2", key: "2" }]);
    };

    return { dataset, foldHandle, checkHandle, loadHandle, loading, props };
  },
};
</script>
<style lang="scss" scoped>
.left-tree{
  height: 100%;
}
.seachInput {
  padding: 10px;
}
</style>
