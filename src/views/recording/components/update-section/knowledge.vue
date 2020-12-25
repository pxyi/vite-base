<template>
  <cus-skeleton :loading="loading">
    <el-tree 
      class="knowledge-tree"
      ref="knowledgeTree"
      :data="dateset"
      show-checkbox
      node-key="id"
      :props="{ children: 'childs', label: 'name' }"
      @check="checkChange"
    />
  </cus-skeleton>
</template>

<script lang="ts">
import { ref, Ref, watch } from 'vue';
import axios from 'axios';
import { AxResponse } from './../../../../core/axios';
import { useStore } from 'vuex';

export default {
  props: {},
  emits: ['check-change'],
  setup(props, { emit }) {
    let store = useStore();
    let loading = ref(true);

    let dateset: Ref<any[]> = ref([]);

    let subjectId = store.getters.subject.code;
    axios.post<any, AxResponse>('/tiku/knowledge/queryTree', { subjectId }).then(res => {
      dateset.value = res.json;
      loading.value = false;
    });
    
    const checkChange = (target, { checkedKeys }) => { emit('check-change', checkedKeys) }

    return { dateset, checkChange, loading };
  }
}
</script>

<style lang="scss" scope>
.knowledge-tree {
  .el-tree-node__content {
    height: 32px !important;
  }
}
</style>