<template>
  <cus-skeleton :loading="loading">
    <el-input placeholder="按知识点搜索" prefix-icon="el-icon-search" v-model="filterText" class="search-input" v-if="!hideSearch" />

    <el-tree 
      class="knowledge-tree"
      ref="knowledgeTree"
      :data="dateset"
      show-checkbox
      node-key="id"
      :props="{ children: 'childs', label: 'name' }"
      :filter-node-method="filterNode"
      @check="checkChange"
    />
  </cus-skeleton>
</template>

<script lang="ts">
import { ref, Ref, watch } from 'vue';
import emitter from './../../../utils/mitt';
import axios from 'axios';
import { AxResponse } from './../../../core/axios';
import { debounce } from 'lodash'

export default {
  props: { hideSearch: { type: Boolean, default: () => false } },
  emits: ['check-change'],
  setup(props, { emit }) {
    let loading = ref(true);

    let dateset: Ref<any[]> = ref([]);
    emitter.emit('effect', async (subjectId) => {
      let res = await axios.post<any, AxResponse>('/tiku/knowledge/queryTree', { subjectId });
      dateset.value = res.json;
      loading.value = false;
    });

    /* 搜索 */
    let filterText = ref(null);
    let knowledgeTree: Ref<any> = ref(null);
    const filterNode = (val, node) => (!val || node.name.includes(val));
    watch(filterText, debounce(() => knowledgeTree.value.filter(filterText.value) , 300))
    
    const checkChange = (target, { checkedKeys }) => { emit('check-change', checkedKeys) }

    return { filterText, dateset, filterNode, knowledgeTree, checkChange, loading };
  }
}
</script>

<style lang="scss" scope>
.search-input {
  margin-bottom: 12px;
}
.knowledge-tree {
  .el-tree-node__content {
    height: 32px !important;
  }
}
</style>