<template>
  <div class="left-tree">
    <!-- 头部搜索框 -->
    <div class="seachInput">
      <el-input  clearable
        placeholder="按知识点搜索"
        prefix-icon="el-icon-search"
        >
      </el-input>
    </div>
<div  >
      <el-tree
      :data="dataset"
      show-checkbox
      :props="props"
      ref="tree"
      :empty-text="dataset?'暂无数据':'加载失败'"
      :default-expanded-keys="[2, 3]"
      :highlight-current='highlightCurrent'
      :check-on-click-node = 'checkonclicknode'
    >
    </el-tree>
</div>
    <div class="left-radius" v-if="isShow"></div>
    <!-- <cus-tree :data-set="dataset" allow-select v-loading="loading"  :props='props' empty-text='正在加载'/> -->
  </div>
</template>

<script lang="ts">
import { ref, reactive, Ref,inject } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { AxResponse } from "../../../core/axios";
import emitter from "../../../utils/mitt";
import { ElMessage, ElLoading  } from "element-plus";
import Carousel from 'element-plus/lib/el-carousel';
export default {
  
  setup( prop,context) {
    let highlightCurrent = ref(true)
    let checkonclicknode = ref(true)

    let dataset: Ref<any[]> = ref([]);
    let store = useStore();
    let isShow  = false;
    let subjectId:String = ''
    let params = {
      // subject: store.getters.subject,
      subject: subjectId,   
    };
    let props = reactive({
      label: "name",
      children: "childs",
    });
  
    axios.post<any, AxResponse>("/tiku/bookVersion/queryVresionBookTree", {subject: "chinese3"}).then((res) => {
        if (res.result) {
          dataset.value = res.json;
          
        } else {
          ElMessage.error(res.msg);
        }
      });

    const foldHandle = (node: any) => {
      // console.log("folded", node);
    };
    const checkHandle = (node: any) => {
      // console.log("checked", node);
    };

    const loadHandle = (node: any, resolve: () => void) => {
      setTimeout(resolve, 1000, [{ title: "一级-2", key: "2" }]);
    };


    // let searchText = ref(null);
    // // const searchHandle = () => emit("search", searchText);
    // const treeCallBackFn = (a,b,c)=>{
    //   // console.log(a,b,c);
    //   let allId:Array<any> = [];
    //   b.checkedNodes.forEach((item) => {
    //     if (item.parentId) {
    //       allId.push(item.id);
    //       // console.log(allId,'87');
    //     }
    //     context.emit("treeEmit", allId);
    //   });

      
    // }

    return { dataset, foldHandle, checkHandle, loadHandle, props ,highlightCurrent,checkonclicknode,isShow,};
  },
};
</script>
<style lang="scss" scoped>
.left-tree{
  position: relative;
  .seachInput {
  padding: 10px;
}
/* 产生动画（向外扩散变大）的圆圈  */
.left-radius {
  position: absolute;
  width: 140px;
  height: 140px;
  left: 35px;
  top: 120px;
  border: 4px solid skyblue;
  border-radius: 50%;
  z-index: 1;
  animation: warn 2s ease alternate infinite;
}
@keyframes warn {
  0%{
     transform: scale(0.6);
  }
  
  50% {
    transform: scale(1);
    // opacity: 0;
  }
  
  100% {
    transform: scale(0.6);
    // opacity: 0;
  }
  
}
}

</style>
