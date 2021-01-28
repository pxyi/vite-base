<template>
  <QuestionListComponent is-selected @check-change="checkedList = $event" />
  <div class="select-total">已选择：<span>{{ checkedList.length }}</span>道试题</div>
</template>

<script lang="ts">
import { ref } from 'vue';
import QuestionListComponent from '/@/views/question/index.vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { emitter } from '$';

export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  components: { QuestionListComponent },
  setup(props) {
    let store = useStore();

    let checkedList = ref([]);
    
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
        }).catch(_ => reject())
      } else {
        ElMessage.warning('请至少选择一道试题！');
        reject();
      }
    }
    return { checkedList, save }
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