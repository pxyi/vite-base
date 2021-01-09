<template>
  <div>
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

    <ListComponent is-selected ref="listRef" @check-change="checkedList = $event" />

    <div class="select-total">已选择：<span>{{ checkedList.length }}</span>道试题</div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import ListComponent from './../../question/components/content.vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import emitter from './../../../utils/mitt';

export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  components: { ListComponent },
  setup(props) {
    let listRef = ref();
    let store = useStore();

    let checkedList = ref([]);

    let subject = store.getters.subject.code;
    const query = (e = {}) => {
      let params = { subject, dataType: 2, ...e }
      listRef.value.request(params);
    }
    onMounted(() => query() );

    const save = (resolve, reject) => {
      if (checkedList.value.length) {
        let paperChapters = checkedList.value.reduce((group, node: any) => {
          let index = group.findIndex((n: any)=> n.title === node.questionTypeName)
          if (index > -1) {
            group[index].questions.push({ score: 0, subjectId: node.subjectId, questionId: node.id });
          } else {
            group[group.length] = {
              avgScore: 0,
              totalScore: 0,
              title: node.questionTypeName,
              questions: [{ score: 0, subjectId: node.subjectId, questionId: node.id }]
            }
          }
          return group;
        }, [] as any[])
        let params = {
          ...props.data,
          format: 1,
          sourceFrom: 1,
          totalScore: 0,
          paperChapters,
          questionCount: checkedList.value.length
        }
        axios.post<null, any>('/tiku/paper/addPaper', params, { headers: { 'Content-Type': 'application/json' } }).then(res => {
          ElMessage[res.result ? 'success' : 'warning'](res.result ? '生成试卷成功~！' : res.msg);
          res.result && emitter.emit('add-test-paper-success', res.json);
          res.result ? resolve(res.json) : reject();
        })
      } else {
        ElMessage.warning('请至少选择一道试题！');
        reject();
      }
    }
    return { query, listRef, checkedList, save }
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
</style>