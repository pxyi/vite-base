<template>
  <div>
    <div class="total">
      <div><span>试题数量：</span><i>100</i></div>
      <div><span>试卷总分：</span><i>100</i></div>
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
              <el-input-number size="mini" controls-position="right" :min="0" :max="100" />
              <div class="append">分/题</div>
            </div>
          </div>
        </div>
        <div class="tr" v-for="(i, idx) in paper.questions" :key="i.id">
          <div class="td">{{ idx + 1 }}</div>
          <div class="td"><el-input-number size="mini" controls-position="right" :min="0" :max="100" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import store from './../store';
import { toChinesNum } from './../utils';
export default {
  setup() {
    let paperCharpts = computed(() => store.getters.paperCharpts);

    return { paperCharpts, toChinesNum }
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