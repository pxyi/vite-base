<template>
  <QuestionListComponent is-selected @check-change="checkedList = $event" :disabled-list="disabledList" />
  <div class="select-total">已选择：<span>{{ checkedList.length }}</span>道试题</div>
</template>

<script lang="ts">
import { ref, computed, PropType } from 'vue';
import QuestionListComponent from '/@/views/question/index.vue';
import { ElMessage } from 'element-plus';

export default {
  props: {
    questionList: {
      type: Array as PropType<any[]>,
      default: () => ({})
    }
  },
  components: { QuestionListComponent },
  setup(props) {

    let checkedList = ref([]);

    let disabledList = computed(() => props.questionList.reduce((list, node) => {
      node.questions.map(i => list.push(i.questionId));
      return list;
    }, []))

    const save = (resolve, reject) => {
      if (checkedList.value.length) {
        resolve(checkedList.value);
      } else {
        ElMessage.warning('请至少选择一道试题！');
        reject();
      }
    }
    return { checkedList, save, disabledList }
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