<template>
  <div class="paper_container">
    <div class="paper_content">
      <h1>初中数学九年级测试卷</h1>
      <h4><span>考试时间：<i>45</i> 分钟</span><span>总分：<i>100</i>分</span></h4>
      <h6><p><span>姓名：</span><i /></p><p><span>班级：</span><i /></p><p><span>考号：</span><i /></p></h6>
      <p>注意事项:</p>
      <p>1. 答题前填写好自己的姓名、班级、考号等信息；</p>
      <p>2. 请将答案正确填写在答题卡上。</p>
      <div class="paper_main">
        
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
export default {
  setup() {
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
    padding: 50px 80px 10px;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid #eee;
    overflow: auto;
    h1 {
      padding-bottom: 10px;
      font-size: 28px;
      line-height: 40px;
      text-align: center;
      border-bottom: solid 1px #1AAFA7;
    }
    h4 {
      margin: 15px 0;
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
      margin-bottom: 15px;
      p {
        display: inline-block;
        width: 180px;
        height: 20px;
        &:not(:last-child) {
          margin-right: 40px;
        }
        i {
          display: inline-block;
          width: 138px;
          height: 20px;
          border-bottom: solid 1px #000;
        }
      }
    }
    & > p {
      color: #303133;
      font-size: 12px;
      line-height: 20px;
    }
    .paper_main {
      margin-top: 15px;
    }
  }
}
</style>