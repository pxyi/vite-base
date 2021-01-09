<template>
  <div class="paper_container" :class="{ 'is__preview': isPreview }">
    <div class="paper_content">
      <div class="paper-tool-header">
        <div class="sealing" v-show="paperInfo.showSealing"><img src="/src/assets/test-paper/sealing.png" alt="密封线"></div>
        <div class="cover-map" v-show="paperInfo.showOrgInfo">
          <img src="/src/assets/test-paper/logo.png" alt="logo" class="logo" />
          <img src="/src/assets/test-paper/title.png" alt="title" class="title" />
        </div>
        <h1 v-show="paperInfo.showTitle">
          <input type="text" v-model="paperInfo.title" placeholder="请输入试卷标题" :readonly="isPreview" />
        </h1>
        <h2 v-show="paperInfo.showSideTitle">
          <input type="text" v-model="paperInfo.sideTitle" placeholder="请输入试卷副标题" :readonly="isPreview" />
        </h2>
        <h4 v-show="paperInfo.showTime"><span>考试时间：<i>45</i> 分钟</span><span>总分：<i>100</i>分</span></h4>
        <h6 v-show="paperInfo.showStuInfo"><p><span>姓名：</span><i /></p><p><span>班级：</span><i /></p><p><span>考号：</span><i /></p></h6>
        <div class="tip">
          <p>注意事项:</p>
          <p>1. 答题前填写好自己的姓名、班级、考号等信息；</p>
          <p>2. 请将答案正确填写在答题卡上。</p>
        </div>
        <div class="paper-score" v-show="paperInfo.showChapterScore">
          <div>
            <el-table :data="paperScoreData" border size="mini" :header-cell-style="{background: '#fff'}">
              <el-table-column prop="name" label="题号" align="center" width="84" />
              <el-table-column v-for="i in paperInfo.paperCharpts.length" :key="i" :prop="`index${i - 1}`" :label="toChinesNum(i)" align="center" width="60" />
              <el-table-column prop="score" label="总分" align="center" width="84" />
            </el-table>
          </div>
        </div>
      </div>
      <div class="paper_main">
        <div class="question_type" v-for="(questionType, idx) in paperInfo.paperCharpts" :key="questionType.id">
          <div class="question-title">
            <div v-show="paperInfo.showScore">
              <div style="display: inline-block">
                <el-table :data="[{name: ' ', score: ' '}]" border size="mini" :header-cell-style="{background: '#fff'}">
                  <el-table-column label="评卷人" align="center" width="84"><template #default>&nbsp;</template></el-table-column>
                  <el-table-column prop="score" label="得分" align="center" width="84" />
                </el-table>
              </div>
            </div>
            <span>{{ toChinesNum(idx + 1) }}、 {{ questionType.title }}（共{{ questionType.questionCount }}小题）（{{ questionType.questions.reduce((t, n) => t += (n.score || 0), 0) }}）分</span>
            <i class="el-icon-plus" v-if="!isPreview" />
            <div class="footer" v-if="!isPreview">
              <i class="iconfont iconshangyi" :class="{ 'is__disabled': idx === 0 }" @click="moveType(idx, -1)" />
              <i class="iconfont iconxiayi" :class="{ 'is__disabled': idx === paperInfo.paperCharpts.length - 1 }" @click="moveType(idx, 1)" />
              <i class="iconfont iconshanchu" :class="{ 'is__disabled': paperInfo.paperCharpts.length === 1 }" @click="deleteQuestType(questionType.id)" />
            </div>
          </div>
          <draggable v-model="questionType.questions" :disabled="isPreview" tag="transition-group" animation="250" item-key="id">
            <template #item="{ element, index }">
              <div class="item">
                <i class="el-icon-plus" v-if="!isPreview" />
                <div class="title" :data-index="`${index + 1}.`"><div v-html="element.question.title" v-if="isPreview && classType !== 3 || !isPreview"></div></div>
                <div class="content" v-question="element.question" v-if="isPreview && classType !== 3 || !isPreview"></div>
                <div class="flex-box" v-if="isPreview && classType !== 2 || element.showAnswer">
                  <div class="label">答案</div>
                  <div class="flex-main" v-html="element.question.rightAnswer ? element.question.rightAnswer.map(a => a.content).join('、') : '无'"></div>
                </div>
                <div class="flex-box" v-if="isPreview && classType !== 2 || element.showAnswer">
                  <div class="label">解析</div>
                  <div class="flex-main" v-html="element.question.analysis"></div>
                </div>
                <div class="footer" v-if="!isPreview">
                  <div>
                    <i class="iconfont iconshezhifenzhi" />
                    <el-input-number :controls="false" size="mini" v-model="element.score" />
                    <span>分值</span>
                  </div>
                  <div @click="element.showAnswer = !element.showAnswer">
                    <i class="iconfont icondaan" />
                    <span>答案</span>
                  </div>
                  <div @click="questExchange(idx, index, element.question.id)">
                    <i class="iconfont iconhuanti" />
                    <span>换题</span>
                  </div>
                  <i class="iconfont iconshangyi" :class="{ 'is__disabled': index === 0 }" @click="moveQuestion(questionType.id, index, -1)" />
                  <i class="iconfont iconxiayi" :class="{ 'is__disabled': index === questionType.questions.length - 1 }" @click="moveQuestion(questionType.id, index, 1)" />
                  <i class="iconfont iconshanchu" :class="{ 'is__disabled': questionType.questions.length === 1 }" @click="deleteQuest(element.id)" />
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, Ref, computed, inject } from 'vue';
import draggable from 'vuedraggable';
import axios from 'axios';
import store from './store';
import { toChinesNum } from './utils';
import { cloneDeep } from 'lodash';
import QuestionDirective from './../../utils/question.directive';
import Modal from './../../../utils/modal';
import ExchangeComponent from './components/exchange.vue';

const exchangeArrayIndex = (arr, index1, index2) => {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}
export default {
  components: { draggable },
  directives: {
    question: QuestionDirective
  },
  setup(props) {
    let paperInfo: Ref<any> = computed(() => store.state.paperInfo);

    let isPreview = inject('preview');

    let classType = computed(() => store.state.classType);

    let paperScoreData = computed(() => {
      let data = {
        name: '得分',
        ...paperInfo.value.paperCharpts.reduce((obj, _, i) => {obj[`index${i}`] = '' ; return obj }, {}),
        score: ''
      }
      return [ data ];
    })

    const deleteQuestType = (id) => {
      let data = paperInfo.value.paperCharpts.filter((p: { id }) => p.id !== id);
      store.commit('set_paper_charpts', data);
    }
    const deleteQuest = (id) => {
      let data = paperInfo.value.paperCharpts.map((data: { questions: any[] }) => { data.questions = data.questions.filter((q: {id}) => q.id !== id); return data; });
      store.commit('set_paper_charpts', data);
    }
    const moveType = (index, arrow) => {
      store.commit('set_paper_charpts', exchangeArrayIndex(cloneDeep(paperInfo.value.paperCharpts), index, index + arrow));
    }
    const moveQuestion = (typeId, index, arrow) => {
      let typeIndex = paperInfo.value.paperCharpts.findIndex((p: {id}) => p.id === typeId);
      let data = cloneDeep(paperInfo.value.paperCharpts);
      data[typeIndex].questions = exchangeArrayIndex(data[typeIndex].questions, index, index + arrow);
      store.commit('set_paper_charpts', data);
    }

    const questExchange = (typeIndex, index, id) => {
      Modal.create({
        title: '换题',
        zIndex: 2011,
        component: ExchangeComponent,
        props: { id }
      }).then((res: any) => {
        let data = cloneDeep(paperInfo.value.paperCharpts);
        data[typeIndex].questions[index].question = res;
        data[typeIndex].questions[index].questionId = res.id;
        store.commit('set_paper_charpts', data);
      })
    }

    return { paperInfo, toChinesNum, deleteQuestType, deleteQuest, moveType, moveQuestion, paperScoreData, classType, questExchange, isPreview }
  }
}
</script>

<style lang="scss" scoped>
.paper_container {
  width: 800px;
  height: 100%;
  padding: 30px 0;
  margin: 0 auto;
  .paper_content {
    height: 100%;
    padding: 30px 70px;
    background: #fff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid #eee;
    overflow: auto;
    position: relative;
    .cover-map {
      overflow: hidden;
      margin: 0 20px 15px;
      .logo {
        width: 120px;
        float: left;
      }
      .title {
        width: 170px;
        float: right;
        margin-top: 17px;
      }
    }
    .sealing {
      position: absolute;
      top: 30px;
      left: 6px;
    }
    h1 input {
      display: block;
      width: 100%;
      margin: 0 20px 15px;
      padding-bottom: 10px;
      font-size: 28px;
      line-height: 40px;
      text-align: center;
      border: 0;
      border-bottom: solid 1px #1AAFA7;
      outline: none;
    }
    h2 input{
      display: block;
      width: 100%;
      margin: 0 20px 15px;
      padding-bottom: 10px;
      font-size: 20px;
      line-height: 30px;
      text-align: center;
      border: 0;
      outline: none;
    }
    h4 {
      margin: 0 20px 15px;
      color: #303133;
      font-size: 12px;
      line-height: 22px;
      text-align: center;
      border-bottom: solid 1px #DCDFE6;
      span {
        margin: 0 20px;
      }
    }
    h6 {
      margin: 0 20px 15px;
      p {
        display: inline-block;
        height: 20px;
        &:not(:last-child) {
          margin-right: 40px;
        }
        i {
          display: inline-block;
          width: 135px;
          height: 20px;
          border-bottom: solid 1px #000;
        }
      }
    }
    .tip {
      margin: 0 20px;
      color: #303133;
      font-size: 12px;
      line-height: 20px;
      border-bottom: solid 1px #DCDFE6;
    }
    .paper-score {
      margin: 20px auto 0;
      text-align: center;
      & > div {
        display: inline-block;
      }
    }
  }

  .paper_main {
    margin-top: 15px;
  }
  .question_type {
    margin-bottom: 20px;
    .question-title {
      padding: 12px 20px;
      position: relative;
    }
    .question-title, .item {
      border: solid 1px transparent;
      border-left-width: 3px;
      border-radius: 4px;
      &:hover {
        border-color: #1AAFA7;
        .el-icon-plus,
        .footer {
          opacity: 1;
          visibility: visible;
        }
      }
    }
    .item {
      padding: 20px 20px 10px 32px;
      cursor: move;
      position: relative;
      .title {
        display: flex;
        &::before {
          content: attr(data-index);
          display: block;
          position: absolute;
          top: 20px;
          left: 20px;
          transform: translate3d(-100%, 0, 0);
        }
        & > div {
          flex: auto;
          margin-bottom: 15px;
        }
      }
      .content {
        margin-bottom: 10px;
      }
    }
    .el-icon-plus {
      display: block;
      width: 24px;
      height: 24px;
      color: #1AAFA7;
      line-height: 24px;
      text-align: center;
      font-weight: bold;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 0 4px #ccc;
      border: 1px solid #EEEEEE;
      position: absolute;
      top: 0;
      left: 0;
      margin: -13px 0 0 -15px;
      opacity: 0;
      visibility: hidden;
    }
    .flex-box {
      font-size: 13px;
      display: flex;
      margin-bottom: 15px;
      .label {
        display: inline-block;
        height: 20px;
        padding: 0 7px;
        color: #3ABAB3;
        font-size: 12px;
        line-height: 20px;
        background: rgba(58, 186, 179, 0.15);
        border-radius: 4px;
        margin-right: 8px;
      }
      .flex-main {
        flex: 1 1 32px;
      }
    }
    .footer {
      opacity: 0;
      visibility: hidden;
      width: calc(100% + 2px);
      height: 28px;
      line-height: 24px;
      text-align: right;
      background: #fff;
      box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
      border-radius: 0px 0px 4px 4px;
      border: 1px solid #eee;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 1;
      margin-bottom: -20px;
      margin-left: -2px;
      & > div {
        display: inline-block;
        margin-right: 22px;
        color: #77808D;
        font-size: 12px;
        cursor: pointer;
        &:last-of-type {
          padding-right: 20px;
          height: 16px;
          line-height: 16px;
          border-right: solid 1px #DCDFE7;
        }
      }
      i {
        color: #FAAD14;
        font-size: 14px;
        margin-right: 2px;
      }
      & > i {
        font-size: 16px;
        margin-right: 15px;
        cursor: pointer;
        &:last-child {
          font-size: 14px;
          color: #3D7FFF;
          margin-right: 25px;
        }
        &.is__disabled {
          color: #999;
          pointer-events: none;
        }
      }
    }
    :deep(.footer) .el-input-number {
      width: 32px;
      input {
        height: 20px;
        padding: 0 5px;
        border-radius: 0;
        border: 0;
        border-bottom: solid 1px #77808D;
      }
    }
  }

  &.is__preview {
    .paper_main {
      .question_type {
        .question-title:hover,
        .item:hover {
          border-color: #fff;
        }
      }
    }
  }

  :deep(.item) {
    .e-main {
      .e-m-cell {
        display: flex;
        &:not(:last-child) {
          margin-bottom: 10px;
        }
        .e-c-label {
          width: 40px;
        }
        .e-c-group {
          flex: 1 1 40px;
          display: flex;
          flex-wrap: wrap;
          .c-t-item {
            flex: 1;
            white-space: nowrap;
          }
        }
      }
      &-title {
        .e-m-cell {
          margin-bottom: 20px;
          .e-c-label {
            margin-bottom: 5px;
          }
          .e-c-group {
            line-height: 24px;
            text-indent: 20px;
          }
        }
      }
    }
  }
}
</style>
