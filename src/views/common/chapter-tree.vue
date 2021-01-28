<template>
  <div class="chapter-tree-container">
    <el-cascader placeholder="请选择教材" size="medium" style="margin-bottom: 12px" v-model="jiaocai"
      :options="dataset" :props="{ label: 'name', value: 'id', children: 'childs' }" 
      @change="handle"
    />
    <el-skeleton :loading="loading">
      <template v-if="treeData.length">
        <el-input placeholder="按章节搜索" prefix-icon="el-icon-search" v-model="filterText" class="search-input" size="medium" style="margin-bottom: 12px" />
        <div class="tree">
          <el-tree
            class="knowledge-tree"
            ref="treeRef"
            :data="treeData"
            show-checkbox
            node-key="id"
            :props="{ children: 'childs', label: 'name' }"
            :filter-node-method="filterNode"
            @check="checkChange"
          />
        </div>
      </template>
      <cus-empty v-else>请更换教材重试</cus-empty>
    </el-skeleton>
  </div>
</template>

<script lang="ts">
import { Ref, ref, watch } from 'vue'
import { useState } from '/@/utils/use'
import emitter from '/@/utils/mitt';
import axios from 'axios';
import { AxResponse } from '/@/core/axios';
import $ from '$';

export default {
  props: {
    autoGetSubject: {
      type: Boolean,
      default: () => false
    }
  },
  setup(props, { emit }) {
    let [ dataset, setDataset ] = useState([]);
    let [ loading, setLoading ] = useState(false);

    let [ jiaocai, setJiaocai ] = useState<any[]>([]);

    const getSubjectHandle = (subject) => axios.post<null, AxResponse>('/tiku/bookVersion/queryUserBookVersion', { subject }).then(res => {
      setDataset(res.json);
      let init = [ res.json[0].id, res.json[0].childs[0].id ];
      setJiaocai(init);
      handle(init);
    });
    props.autoGetSubject ? getSubjectHandle($.storage.get<any>('subject').code) : emitter.emit('effect', getSubjectHandle);
    

    let [ treeData, setTreeData ] = useState([]);
    const handle = async (val) => {
      setLoading(true);
      let res = await axios.post<null, AxResponse>('/tiku/bookChapter/queryTreeByBookVersion', { bookId: val[1] });
      setLoading(false);
      let updateChildData = JSON.parse(JSON.stringify(res.json).replaceAll('"knowledgeList":[', '"childs":['));
      setTreeData(updateChildData);
    }

    /* 搜索 */
    let filterText = ref(null);
    let treeRef: Ref<any> = ref(null);
    const filterNode = (val, node) => (!val || node.name.includes(val));
    watch(filterText, $.debounce(() => treeRef.value.filter(filterText.value) , 300))


    const checkChange = (target, { checkedKeys, checkedNodes }) => {
      let nodes = checkedNodes.filter(i => !i.childs || !i.childs.length);
      emit('check-node-change', nodes);
    } 

    return { dataset, loading, jiaocai, handle, filterText, treeRef, filterNode, treeData, checkChange }
  }
}
</script>
<style lang="scss" scoped>
.chapter-tree-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .tree {
    flex: auto;
    overflow: auto;
  }
}
</style>