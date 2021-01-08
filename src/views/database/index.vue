<template>
  <template ref="headerRef">
    <HeaderRefComponent @search="handle('fileName', $event)" :get-knowledge="getKnowledge" />
  </template>
  <div class="container">
    <div class="knowledge-tree">
      <KnowledgeTreeComponent ref="knowledgeRef" @check-change="handle('chapterId', $event)" />
    </div>
    <div class="section-main">
      <ContentComponent ref="contentRef" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import emitter from './../../utils/mitt';
import HeaderRefComponent from './components/header.vue';
import KnowledgeTreeComponent from './components/knowledge.vue';
import ContentComponent from './components/content.vue';
import { ElMessage } from 'element-plus';

export default {
  components: { HeaderRefComponent, KnowledgeTreeComponent, ContentComponent },
  setup() {
    let headerRef = ref();
    let contentRef = ref();
    let knowledgeRef = ref();
    onMounted(() => {
      emitter.emit('slot', headerRef)
    });

    const handle = (key, val) => { contentRef.value.formGroup[key] = val; contentRef.value.request(); }

    const getKnowledge = () => new Promise((resolve, reject) => {
      let nodes = knowledgeRef.value.knowledgeRef.getCheckedNodes(true);
      !nodes.length && ElMessage.warning('请在左侧选择一个章节开始上传吧~！')
      nodes.length ? resolve(nodes) : reject()
    })

    return { headerRef, contentRef, knowledgeRef, handle, getKnowledge }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  &, & > div {
    height: 100%;
    overflow: auto;
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
}
</style>