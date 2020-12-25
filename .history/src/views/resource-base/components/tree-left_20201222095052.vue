<template>
  <div>
    <!-- 头部搜索框 -->
    <div class="seachInput">
      <el-input placeholder="按知识点搜索" prefix-icon="el-icon-search">
      </el-input>
    </div>
    <!-- <el-tree :data="dataset" show-checkbox node-key="id" v-loading='loading'>  </el-tree> -->
    <cus-tree :data-set="dataset" allow-select  v-loading='loading'  />
  </div>
</template>

<script lang="ts">
import { ref, Ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { AxResponse } from "../../../core/axios";
import emitter from "../../../utils/mitt";
import { ElMessage,ElLoading  } from "element-plus";
export default {
  setup() {
    let loading = ref(false);
    let dataset: Ref<any[]> = ref([]);
    let store = useStore(); 
    let params = {
      subject: store.getters.subject,
    };
     loading.value = true;
    console.log(params);
    axios
      .post<any, AxResponse>("/tiku/bookVersion/queryVresionBookTree", params)
      .then((res) => {
        if (res.result) {
          dataset = res.json;
          console.log(dataset, "我想打印");
           loading.value = false; 
        } else {
          ElMessage.error(res.msg); 
        }
      });



      // const request = async (params?) => {
      //   loading.value = true;
      //   let res = await axios.post<any,AxResponse>('/tiku/bookVersion/queryVresionBookTree',params);
      //   if (res.result) {
            
      //       dataset.value = res.json;
      //   }
      //   loading.value = false;
      //   console.log(dataset.value);
        
      // }

// request()
    const foldHandle = (node: any) => {
      console.log("folded", node);
    };
    const checkHandle = (node: any) => {
      console.log("checked", node);
    };

    const loadHandle = (node: any, resolve: () => void) => {
      setTimeout(resolve, 1000, [{ title: "一级-2", key: "2" }]);
    };

    return { dataset, foldHandle, checkHandle, loadHandle,loading };
  },
};
</script>
<style lang="scss" scoped>
.seachInput {
  padding: 10px;
}
</style>
