<template>
  <el-skeleton :loading="loading">
    <template v-if="dateset.length">
      <el-input placeholder="按知识点搜索" prefix-icon="el-icon-search" v-model="filterText" class="search-input" size="medium" />

      <el-tree
        class="knowledge-tree"
        ref="treeRef"
        :data="dateset"
        show-checkbox
        node-key="id"
        :props="{ children: 'childs', label: 'name' }"
        :filter-node-method="filterNode"
        @check="checkChange"
      />
    </template>
    <cus-empty v-else />
  </el-skeleton>
</template>

<script lang="ts">
import { ref, Ref, watch } from 'vue';
import emitter from '/@/utils/mitt';
import axios from 'axios';
import { AxResponse } from '/@/core/axios';
import $ from '/@/utils/$';

export default {
  props: { 
    autoGetSubject: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ['check-change', 'check-node-change'],
  setup(props, { emit }) {
    let loading = ref(false);

    let dateset: Ref<any[]> = ref([]);
    const getSubjectHandle = async (subjectId) => {
      loading.value = true;
      let res = await axios.post<any, AxResponse>('/tiku/knowledge/queryTree', { subjectId });
      dateset.value = res.json;
      loading.value = false;
    }
    props.autoGetSubject ? getSubjectHandle($.storage.get<any>('subject').code) :emitter.emit('effect', getSubjectHandle);

    /* 搜索 */
    let filterText = ref(null);
    let treeRef: Ref<any> = ref(null);
    const filterNode = (val, node) => (!val || node.name.includes(val));
    watch(filterText, $.debounce(() => treeRef.value.filter(filterText.value) , 300))
    
    const checkChange = (target, { checkedKeys, checkedNodes }) => {
      let nodes = checkedNodes.filter(i => !i.childs || !i.childs.length);
      emit('check-change', nodes.map(i => i.id));
      emit('check-node-change', nodes);
    }

    return { filterText, dateset, filterNode, treeRef, checkChange, loading };
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
