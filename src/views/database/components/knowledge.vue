<template>
  <el-skeleton :loading="loading">
    <el-input placeholder="按教材章节搜索" prefix-icon="el-icon-search" clearable v-model="filterText" class="search-input" size="medium" />

    <el-tree
      class="knowledge-tree"
      ref="knowledgeRef"
      :data="dateset"
      show-checkbox
      node-key="id"
      :props="{ children: 'childs', label: 'name', value: 'id' }"
      :filter-node-method="filterNode"
      @check="checkChange"
    />
  </el-skeleton>
</template>

<script lang="ts">
import { ref, Ref, watch } from 'vue';
import emitter from '/@/utils/mitt';
import axios from 'axios';
import { AxResponse } from '/@/core/axios';
import $ from '/@/utils/$'

export default {
  emits: ['check-change'],
  setup(props, { emit }) {
    let loading = ref(true);

    let dateset: Ref<any[]> = ref([]);
    emitter.emit('effect', async (subject) => {
      let res = await axios.post<any, AxResponse>('/tiku/bookVersion/queryVresionBookTree', { subject });
      dateset.value = res.json;
      loading.value = false;
    });

    /* 搜索 */
    let filterText = ref(null);
    let knowledgeRef: Ref<any> = ref(null);
    const filterNode = (val, node) => (!val || node.name.includes(val));
    watch(filterText, $.debounce(() => knowledgeRef.value.filter(filterText.value) , 300))
    
    const checkChange = (target, { checkedKeys }) => {
      emit('check-change', checkedKeys);
    } 

    return { filterText, dateset, filterNode, knowledgeRef, checkChange, loading };
  }
}
</script>

<style lang="scss" scoped>
.search-input {
  margin-bottom: 12px;
}
.knowledge-tree {
  .el-tree-node__content {
    height: 32px !important;
  }
}
</style>
