
<template>
  <template ref="headerRef">
    <HeaderRefComponent @type-change="query('dataType', $event)" @search="query('title', $event)" />
  </template>
  <div class="question-container">
    <div class="knowledge-tree">
      <KnowledgeTree @check-change="query('knowledgePoints', $event)" />
    </div>
    <div class="section-main">
      <div>
        <cus-condition :node-list="[ 
          { label: '题型', key: 'type' },
          { label: '难度', key: 'difficult' },
          { label: '年级', key: 'gradeId' },
          { label: '年份', key: 'year', hide: true },
          { label: '来源', key: 'source', hide: true },
          { label: '题类', key: 'category', hide: true },
          { label: '知识点', key: 'knowledgePointBind', hide: true },
        ]" @submit="query('*', $event)" />
      </div>

      <ContentComponent ref="contentRef" />
    </div>
  </div>
</template>
<script lang="ts">
import { ref, reactive,toRefs, onMounted, Ref, watch } from 'vue';
import HeaderRefComponent from './components/header-ref.vue';
import ContentComponent from './components/content.vue';
import KnowledgeTree from './components/knowledge-tree.vue';
import emitter from './../../utils/mitt';
import axios from 'axios';
import { useStore } from 'vuex';

export default {
  components: { HeaderRefComponent, KnowledgeTree, ContentComponent },
  setup() {
    let store = useStore();
    let headerRef = ref();
    let contentRef = ref();
    onMounted(() => {
      emitter.emit('slot', headerRef)
      emitter.emit('effect', (id) => { query('subject', id) })
    });

    let params: any = reactive({
      dataType: 2
    });
    const query = (key, val) => { 
      key === '*' ? (params = { ...params, ...val }) : (params[key] = val.value || val);
      contentRef.value.request(params); 
    }

    return { headerRef, params, contentRef, query }
  }
}
</script>

<style lang="scss" scoped>
.question-container {
  display: flex;
  &, & > div {
    height: 100%;
    overflow: auto;
  }
}
.knowledge-tree {
  width: 250px;
  padding: 12px;
  margin-right: 20px;
  background: #fff;
  border-radius: 6px;
}
.section-main {
  display: flex;
  flex-direction: column;
  flex: 1 1 250px;
  height: 100%;
  overflow: auto;
}
</style>