<template>
  <div class="test-basket" :class="{ 'is__show': !!questionList.length }">
    <div class="cart-icon"><i class="iconfont iconshitilan" /><span>{{ questionList.length }}</span></div>
    <div class="main" @click="generatePaper">
      <span>生成试卷</span>
      <i class="iconfont iconshengchengshijuan" />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import Modal from '/@/utils/modal';
import GeneratingComponent from './generating.vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  props: {
    questionList: Array as PropType<any[]>,
    default: () => ([])
  },
  setup(props) {
    const generatePaper = () => {
      Modal.create({
        title: '生成试卷',
        width: 500,
        component: GeneratingComponent
      }).then((formGroup: any) => {
        let paperChapters = props.questionList!.reduce((group, node: any) => {
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
          ...formGroup,
          subjectId: formGroup.subjectId[1],
          format: 1,
          sourceFrom: 1,
          totalScore: 0,
          paperChapters,
          questionCount: paperChapters.length
        }
        axios.post<null, any>('/tiku/paper/addPaper', params, { headers: { 'Content-Type': 'application/json' } }).then(res => {
          ElMessage[res.result ? 'success' : 'warning'](res.result ? '生成试卷成功~！' : res.msg);
          res.result && window.open(`./#/test-paper-edit/false/${res.json.id}`);
        })
      })
    }

    return { generatePaper }
  }
}
</script>

<style lang="scss" scoped>
.test-basket {
  width: 48px;
  color: #fff;
  border-radius: 6px;
  background: #1AAFA7;
  position: fixed;
  top: 50%;
  right: 0;
  z-index: 9;
  cursor: pointer;
  transform: translate3d(100%, 0, 0);
  transition: all .25s;
  pointer-events: none;
  &.is__show {
    transform: none;
    pointer-events: initial;
  }
  .cart-icon {
    padding: 15px 0;
    text-align: center;
    border-bottom: solid 4px #fff;
    position: relative;
    i {
      font-size: 26px;
    }
    span {
      display: block;
      height: 16px;
      padding: 0 4px;
      font-size: 12px;
      line-height: 14px;
      background: #FAAD14;
      border-radius: 8px;
      position: absolute;
      top: 10px;
      right: 8px;
    }
  }
  .main {
    padding: 14px 0;
    text-align: center;
    span {
      display: block;
      margin: 0 auto 4px;
      width: 14px;
      font-size: 14px;
    }
  }
}
</style>