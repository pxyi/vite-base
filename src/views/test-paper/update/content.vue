<template>
  <div class="paper_container">
    <div class="paper_content">
      <div class="sealing"><img src="/src/assets/test-paper/sealing.png" alt="密封线"></div>
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
          <h2>{{ toChinesNum(index + 1) }}、 {{ questionType.title }}（共{{ questionType.questionCount }}小题）（0）分</h2>
          <draggable v-model="questionType.questions" tag="transition-group" animation="250" item-key="id">
            <template #item="{ element, index }">
              <div class="item">
                <i class="el-icon-plus" />
                <div class="title" v-html="element.question.title" :data-index="`${index + 1}.`"></div>
                <div class="footer">
                  
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
import { ref, inject } from 'vue';
import draggable from 'vuedraggable';
import axios from 'axios';
let toChinesNum = (num: number): string => {
  let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  let unit = ["", "十", "百", "千", "万"];
  let getWan = (temp) => {
  　　let strArr = temp.toString().split("").reverse();
  　　let newNum = "";
  　　for (var i = 0; i < strArr.length; i++) {
    　　newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
  　　}
    　 return newNum;
  }
  let overWan = Math.floor(num / 10000);
  let noWan: string | number = num % 10000;
  if (noWan.toString().length < 4) {
    noWan = "0" + noWan;
  }
  return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
}
export default {
  components: { draggable },
  setup(props) {
    let paperInfo = ref({});
    let id = inject('id');
    axios.post<null, { json: any }>('/tiku/paper/getPaper', { id }).then((res) => {
      res.json.paperCharpts = res.json.paperCharpts.map(quest => { quest.questions.map(q => {q.question = q.question || { title: '默认标题' }; return q;}); return quest } )
      paperInfo.value = res.json;
    });
    return { paperInfo, toChinesNum }
  }
}
</script>

<style lang="scss" scope>
.paper_container {
  width: 800px;
  height: 100%;
  padding: 30px 0;
  margin: 0 auto;
  .paper_content {
    height: 100%;
    padding: 50px 70px 10px;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid #eee;
    overflow: auto;
    position: relative;
    .sealing {
      position: absolute;
      top: 50px;
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
          width: 140px;
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
    h2 {
      padding: 12px 20px;
    }
    h2, .item {
      border: solid 1px transparent;
      border-left-width: 3px;
      border-radius: 4px;
      &:hover {
        border-color: #1AAFA7;
      }
    }
    .item {
      padding: 20px;
      position: relative;
      .title::before {
        content: attr(data-index);
        display: inline-block;
        margin-right: 12px;
      }
      .title > * {
        display: inline-block;
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
        margin: -13px 0 0 -15px
      }
    }
    .footer {
      width: calc(100% + 2px);
      height: 28px;
      line-height: 28px;
      text-align: right;
      background: #fff;
      box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
      border-radius: 0px 0px 4px 4px;
      border: 1px solid #eee;
      position: absolute;
      bottom: 0;
      left: 0;
      margin-bottom: -26px;
      margin-left: -1px;
    }
  }
}
</style>