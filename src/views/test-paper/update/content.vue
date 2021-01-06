<template>
  <div class="paper_container">
    <div class="paper_content">
      <div class="sealing"><img src="/src/assets/test-paper/sealing.png" alt="密封线"></div>
      <div class="cover-map">
        <img src="/src/assets/test-paper/logo.png" alt="logo" class="logo" />
        <img src="/src/assets/test-paper/title.png" alt="title" class="title" />
      </div>
      <h1>{{ paperInfo.title }}</h1>
      <h4><span>考试时间：<i>45</i> 分钟</span><span>总分：<i>100</i>分</span></h4>
      <h6><p><span>姓名：</span><i /></p><p><span>班级：</span><i /></p><p><span>考号：</span><i /></p></h6>
      <div class="tip">
        <p>注意事项:</p>
        <p>1. 答题前填写好自己的姓名、班级、考号等信息；</p>
        <p>2. 请将答案正确填写在答题卡上。</p>
      </div>
      <div class="paper_main">
        <div class="question_type" v-for="(questionType, index) in paperInfo.paperCharpts" :key="questionType.id">
          <div class="question-title">
            <span>{{ toChinesNum(index + 1) }}、 {{ questionType.title }}（共{{ questionType.questionCount }}小题）（0）分</span>
            <i class="el-icon-plus" />
            <div class="footer">
              <i class="iconfont iconshangyi" />
              <i class="iconfont iconxiayi" />
              <i class="iconfont iconshanchu" />
            </div>
          </div>
          <draggable v-model="questionType.questions" tag="transition-group" animation="250" item-key="id">
            <template #item="{ element, index }">
              <div class="item">
                <i class="el-icon-plus" />
                <div class="title" v-html="element.question.title" :data-index="`${index + 1}.`"></div>
                <div class="footer">
                  <div>
                    <i class="iconfont iconshezhifenzhi" />
                    <input type="text" />
                    <span>分值</span>
                  </div>
                  <div>
                    <i class="iconfont icondaan" />
                    <span>答案</span>
                  </div>
                  <div>
                    <i class="iconfont iconhuanti" />
                    <span>换题</span>
                  </div>
                  <i class="iconfont iconshangyi" />
                  <i class="iconfont iconxiayi" />
                  <i class="iconfont iconshanchu" />
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
import { ref, computed } from 'vue';
import draggable from 'vuedraggable';
import axios from 'axios';
import store from './store';
import { toChinesNum } from './utils';

export default {
  components: { draggable },
  setup(props) {
    let paperInfo = computed(() => store.state.paperInfo);
    return { paperInfo, toChinesNum }
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
    h1 {
      margin: 0 20px;
      padding-bottom: 10px;
      font-size: 28px;
      line-height: 40px;
      text-align: center;
      border-bottom: solid 1px #1AAFA7;
    }
    h4 {
      margin: 15px 20px;
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
      padding: 20px;
      cursor: move;
      position: relative;
      .title::before {
        content: attr(data-index);
        display: inline-block;
        margin-right: 12px;
      }
      .title > * {
        display: inline-block;
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
      margin-bottom: -26px;
      margin-left: -1px;
      & > div {
        display: inline-block;
        margin-right: 22px;
        color: #77808D;
        font-size: 12px;
        cursor: pointer;
        input {
          width: 32px;
          border: 0;
          font-size: 12px;
          text-align: center;
          border-bottom: solid 1px #77808D;
          outline: none;
        }
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
      }
    }
  }
}
</style>