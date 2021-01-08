<template>
  <template ref="headerRef">
    <HeaderRefComponent />
  </template>
  <div class="container">
    <div class="knowledge-tree">
      <KnowledgeTreeComponent @check-change="query('knowledgePoints', $event)" />
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
import KnowledgeTreeComponent from './../question/components/knowledge-tree.vue';
import ContentComponent from './components/content.vue';

export default {
  components: { HeaderRefComponent, KnowledgeTreeComponent, ContentComponent },
  setup() {
    let headerRef = ref();
    onMounted(() => {
      emitter.emit('slot', headerRef)
      // emitter.emit('effect', (id) => { query('subject', id) })
    });

    return { headerRef }
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