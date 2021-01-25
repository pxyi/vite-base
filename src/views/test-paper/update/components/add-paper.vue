<template>
  <div class="question-container">
    <div class="knowledge-tree"><KnowledgeTree @check-change="query('knowledgePoints', $event)" /></div>
    <div class="section-main">
      <cus-condition :node-list="[ 
        { label: '标题', key: 'title', type: 'input' },
        { label: '题型', key: 'type' },
        { label: '难度', key: 'difficult' },
        { label: '年级', key: 'gradeId' },
        { label: '年份', key: 'year', hide: true },
        { label: '来源', key: 'source', hide: true },
        { label: '题类', key: 'category', hide: true },
        { label: '知识点', key: 'knowledgePointBind', hide: true },
      ]" @submit="query" />

      <ListComponent is-selected ref="listRef" @check-change="checkedList = $event" :disabled-list="disabledList" />
    </div>
  </div>
  <div class="select-total">已选择：<span>{{ checkedList.length }}</span>道试题</div>
</template>

<script lang="ts">
import { ref, computed, PropType, onMounted, onUnmounted } from 'vue';
import ListComponent from '/@/views/question/components/content.vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import emitter from '/@/utils/mitt';
import KnowledgeTree from '/@/views/common/knowledge-tree.vue';
import Drawer from '/@/utils/drawer'
import storage from '/@/utils/storage';

export default {
  props: {
    questionList: {
      type: Array as PropType<any[]>,
      default: () => ({})
    }
  },
  components: { ListComponent, KnowledgeTree },
  setup(props) {

    let listRef = ref();

    let checkedList = ref([]);

    let disabledList = computed(() => props.questionList.reduce((list, node) => {
      node.questions.map(i => list.push(i.questionId));
      return list;
    }, []))

    const effectHandle = (fn) => fn(subject)
    try {
      var subject = storage.get<any>('subject').code;
      emitter.on('effect', effectHandle);
    } catch (error) {
      window.location.href = './#/home';
      Drawer.closeAll();
    }
    const query = (e = {}) => {
      let params = { subject, dataType: 2, ...e }
      listRef.value.request(params);
    }
    onMounted(() => query() );
    onUnmounted(() => emitter.off('effect', effectHandle));

    const save = (resolve, reject) => {
      if (checkedList.value.length) {
        resolve(checkedList.value);
      } else {
        ElMessage.warning('请至少选择一道试题！');
        reject();
      }
    }
    return { query, listRef, checkedList, save, disabledList }
  }
}
</script>

<style lang="scss" scoped>
.select-total {
  color: #777;
  line-height: 60px;
  position: fixed;
  top: 0;
  right: 30px;
  span {
    font-size: 18px;
    margin: 0 5px;
    color: #1AAFA7;
  }
}

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
  border: solid 1px #ebeef6;
}
.section-main {
  display: flex;
  flex-direction: column;
  flex: 1 1 250px;
  height: 100%;
  overflow: auto;
}
</style>