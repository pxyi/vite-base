<template>
  <div>
    <div class="total">
      <div><span>试题数量：</span><i>{{ questionTotal }}</i></div>
      <div><span>试卷总分：</span><i>{{ questionScoreTotal }}</i></div>
    </div>
    <div class="table">
      <div class="thead">
        <div class="tr">
          <div class="td">题号</div>
          <div class="td">分值</div>
        </div>
      </div>
      <div class="tbody" v-for="(paper, index) in paperCharpts" :key="paper.id">
        <div class="th">
          <div class="td">{{ toChinesNum(index + 1) }}. {{ paper.title }}</div>
          <div class="td">
            <div class="box">
              <el-input-number size="mini" controls-position="right" :min="0" :max="99" v-model="paper.avgScore" @change="paperTypeScoreChange(index, $event)" />
              <div class="append">分/题</div>
            </div>
          </div>
        </div>
        <div class="tr" v-for="(quest, idx) in paper.questions" :key="quest.questionId">
          <div class="td">{{ idx + 1 }}</div>
          <div class="td"><el-input-number v-model="quest.score" @change="emitter.emit('test-paper-change')" size="mini" controls-position="right" :min="0" :max="99" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import store from './../store';
import { toChinesNum } from './../utils';
import emitter from './../../../../utils/mitt';

export default {
  setup() {
    let paperCharpts = computed({
      get: () => store.getters.paperCharpts,
      set: (val) => {store.commit('set_paper_charpts', val); console.log(val)}
    });
    let questionTotal = computed(() => paperCharpts.value.reduce((total, n) => total += n.questions.length, 0));

    let questionScoreTotal = computed(() => paperCharpts.value.reduce((total, n) => { n.questions.map(q => { total += q.score || 0 }); return total}, 0));

    const paperTypeScoreChange = (index, val) => {
      paperCharpts.value[index].questions = paperCharpts.value[index].questions.map(n => { n.score = val; return n; });
    }

    return { paperCharpts, toChinesNum, questionTotal, paperTypeScoreChange, questionScoreTotal, emitter }
  }
}
</script>

<style lang="scss" scoped>
.total {
  display: flex;
  margin-bottom: 20px;
  div {
    flex: 1;
    span {
      color: #77808D;
    }
    &:last-child {
      text-align: right;
    }
  }
}
.table {
  border: solid 1px #EBEEF5;
  border-radius: 4px;
  .tr, .th {
    display: flex;
    border-bottom: solid 1px #EBEEF5;
    .td {
      flex: 1;
      height: 40px;
      line-height: 40px;
      text-align: center;
      &:not(:last-child) {
        border-right: solid 1px #EBEEF5;
      }
      .el-input, .el-input-number {
        width: 80px;
      }
      :deep(.el-input) {
        .el-input__inner {
          padding: 0 38px 0 5px;
        }
        .el-input-group__append {
          padding: 0 3px;
        }
      }
    }
  }
  .th {
    background: #F5F7FA;
  }
  .tbody:last-child > div:last-child {
    border-bottom: 0;
  }
  .box {
    display: inline-block;
    position: relative;
    .append {
      padding: 0 5px;
      color: #77808D;
      font-size: 12px;
      line-height: 26px;
      background: #fff;
      border-radius: 0 4px 4px 0;
      position: absolute;
      top: 8px;
      right: 1px;
      z-index: 1;
    }
  }
}
</style>
