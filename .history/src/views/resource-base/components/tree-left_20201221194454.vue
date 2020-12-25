<template>
  <div>
    <!-- 头部搜索框 -->
    <div class="seachInput">
      <el-input placeholder="按知识点搜索" prefix-icon="el-icon-search">
      </el-input>
    </div>
    <el-tree :data="dataset" show-checkbox node-key="id" :default-expanded-keys="[2, 3]"
  :default-checked-keys="[5]" :ElLoading='loading'>
    </el-tree>
  </div>
</template>

<script lang="ts">
import { ref, Ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { AxResponse } from "../../../core/axios";
import emitter from "../../../utils/mitt";
import { ElMessage, ElLoading } from 'element-plus'
export default {
  setup() {
    let loading = ref(true);
    let dataset: Ref<any[]> = ref([]);
    let store = useStore();
    let params = {
      subject: store.getters.subject,
    };
 


    axios
      .post<any, AxResponse>("/tiku/bookVersion/queryVresionBookTree", params)
      .then((res) => {
        if (res.result) {
          dataset = res.json;
          console.log(dataset,'我想打印');
        }else{
             ElMessage.error('');
        }
      });
    let subjectId = ref(null)
    // emitter.emit("effect", (id) => (subjectId=id ));
    // axios.post<any, AxResponse>("/tiku/bookVersion/queryVresionBookTree", params).then((res) => {
    //     if (res.result) {
    //       dataset = res.json;
    //     }
    //   });
    // console.log(dataset);
      //  console.log(subjectId);
    const foldHandle = (node: any) => {
      console.log("folded", node);
    };
    const checkHandle = (node: any) => {
      console.log("checked", node);
    };

    const loadHandle = (node: any, resolve: () => void) => {
      setTimeout(resolve, 1000, [{ title: "一级-2", key: "2" }]);
    };

    return { dataset, foldHandle, checkHandle, loadHandle, loading };
  },
};
</script>
<style lang="scss" scoped>
.seachInput {
  padding: 10px;
}
</style>
