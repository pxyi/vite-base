<template>
  <div class="left-tree" :loading="loading">
    <!-- 头部搜索框 -->
    <div class="seachInput">
      <el-input
        placeholder="按教材章节搜索"
        prefix-icon="el-icon-search"
        v-model="filterText"
        clearable
      />
    </div>
    <div class="tree">
      <el-tree
        :data="dataset"
        show-checkbox
        :props="{ children: 'childs', label: 'name' }"
        ref="knowledgeTree"
        :empty-text="dataset ? '暂无数据' : '加载失败'"
        :highlight-current="highlightCurrent"
        :check-on-click-node="checkonclicknode"
        :filter-node-method="filterNode"
        @check="checkChange"
      >
      </el-tree>
    </div>
    <div class="left-radius" v-if="props.tipShow"></div>
    <!-- <cus-tree :data-set="dataset" allow-select v-loading="loading"  :props='props' empty-text='正在加载'/> -->
  </div>
</template>

<script lang="ts">
import { ref, reactive, Ref, inject, watch } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { AxResponse } from "../../../core/axios";
import emitter from "../../../utils/mitt";
import { ElMessage } from "element-plus";
import Carousel from "element-plus/lib/el-carousel";
import { debounce } from "lodash";
export default {
  props: {
    hideSearch: { type: Boolean, default: () => false },
    tipShow: { type: Boolean, default: () => false },
  },
  emits: ["check-change"],
  setup(props, { emit }) {
    let loading = ref(true);
    let highlightCurrent = ref(true);
    let checkonclicknode = ref(true);
    let dataset: Ref<any[]> = ref([]);
    let isShow = false;
    emitter.emit("effect", (id) => {
      axios
        .post<any, AxResponse>("/tiku/bookVersion/queryVresionBookTree", {
          subject: id,
        })
        .then((res) => {
          if (res.result) {
            dataset.value = res.json;
            loading.value = false;
          } else {
            ElMessage.error(res.msg);
          }
        });
    });
    /* 搜索 */
    let filterText = ref(null);
    let knowledgeTree: Ref<any> = ref(null);
    const filterNode = (val, node) => !val || node.name.includes(val);
    watch(
      filterText,
      debounce(() => knowledgeTree.value.filter(filterText.value), 300)
    );
    // { checkedKeys }
    const checkChange = (target, e) => {
      // console.log(target, e);
      emit("check-change",e)
      emitter.emit("check-change", target);
    };

    return {
      dataset,
      highlightCurrent,
      checkonclicknode,
      isShow,
      loading,
      filterText,
      filterNode,
      knowledgeTree,
      checkChange,
      props,
    };
  },
};
</script>
<style lang="scss" scoped>
.left-tree {
  position: relative;
   width: 250px;
  .tree {
    // height: 80vh;
    overflow: auto;
  }
  .seachInput {
    // padding: 10px;
     width: 90%;
   padding: 10px 0 10px 10px;
  }
  /* 产生动画（向外扩散变大）的圆圈  */
  .left-radius {
    position: absolute;
    width: 140px;
    height: 140px;
    left: 0px;
    top: 30px;
    border: 4px solid skyblue;
    border-radius: 50%;
    z-index: 1;
    animation: warn 2s ease alternate infinite;
  }
  @keyframes warn {
    0% {
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
