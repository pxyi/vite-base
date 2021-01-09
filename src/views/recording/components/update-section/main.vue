<template>
  <div class="main-container">
    <div class="fixed">
      <h2>检查区：</h2>
      <div v-if="errorList.length">
        <i>{{ errorList.length }}</i>
        <span>处错误，请参照提示修改</span>
        <a @click.stop="seeFail">查看</a>
      </div>
    </div>
    <div class="main-content" :class="{ 'is__sync': isSync }">
      <div class="item" @click.stop :class="{ 'is__focus': focusData?.id === data.id }" v-for="data in dataset" :key="data.id">
        <div class="mask" @click.stop="focusChange(data)"></div>
        <div class="title">
          <cus-editor v-model="data.title" hide-border placeholder="请输入题干" />
        </div>
        <div class="answer">
          <h6>答案</h6>
          <cus-editor v-model="data.answer" hide-border placeholder="请输入答案" />
        </div>
        <div class="analysis">
          <h6>解析</h6>
          <cus-editor v-model="data.analysis" hide-border placeholder="请输入题目解析" />
        </div>
        <div class="footer">
          <h4>{{ data.questionTypeName }}</h4>
          <p><span>知识点：</span><i>{{ data.knowledgePoints ? `已选择${data.knowledgePoints.length}项` : '-' }}</i></p>
          <p><span>难度：</span><i>{{ data.difficult ? [ { name: '易', id: 11 }, { name: '较易', id: 12 }, { name: '中档', id: 13 }, { name: '较难', id: 14 }, { name: '难', id: 15 } ].find(i => i.id === data.difficult).name : '-' }}</i></p>
          <div>
            <a v-show="data.failReason">{{ data.failReason }}</a>
            <a>重复率80%</a>
            <i :class="[`el-icon-${data.loading ? 'loading' : 'delete'}`]" @click="remove(data)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, nextTick } from 'vue';
import store from './../store';
import axios from 'axios';

export default {
  setup() {
    let dataset = computed(() => store.state.dataSet);

    let errorList = computed(() => store.state.errorList);

    let focusData = computed(() => store.state.focusData);

    let isSync = computed(() => store.state.isSync);

    const focusChange = (data) => store.commit('set_focus_data', data);

    const remove = async (data) => {
      data.loading = true;
      let res = await axios.post<null, { result: boolean }>('/tiku/question/delete', { id: data.id });
      res.result && store.commit('delete_data', data.id);
    }

    let errorIndex = 0;
    const seeFail = () => {
      let errorId = errorList.value[errorIndex]['quesId'];
      let data = dataset.value.find((d: {id}) => d.id === errorId)
      data && store.commit('set_focus_data', data);
      errorIndex = errorIndex < errorList.value.length - 1 ? errorIndex + 1 : 0;
      nextTick(() => {
        let top = (document.querySelector('.main-content .item.is__focus') as HTMLElement).offsetTop;
        (document.querySelector('.main-content') as HTMLElement).scrollTop = top - 50;
      })
    }

    return { dataset, errorList, focusData, focusChange, remove, isSync, seeFail }
  }
}
</script>

<style lang="scss" scoped>
.main-container {
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  height: 100%;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0px 1px 6px 0px rgba(91, 125, 255, 0.08);
  border-radius: 4px;
  position: relative;
  .fixed {
    width: 100%;
    height: 40px;
    padding: 0 24px;
    line-height: 40px;
    background: #F6F7F9;
    border-radius: 6px 6px 0px 0px;
    border: 1px solid #DCDEE3;
    h2 {
      font-size: 18px;
      float: left;
    }
    div {
      float: left;
      line-height: 39px;
    }
    i {
      display: inline-block;
      padding: 0 5px;
      margin-right: 5px;
      color: #fff;
      font-size: 12px;
      line-height: 15px;
      background: #FF3B3B;
      border-radius: 2px;
    }
    span {
      color: #FF3B3B;
      font-size: 12px;
      margin-right: 10px;
    }
    a {
      display: inline-block;
      padding: 0 15px;
      color: #fff;
      font-size: 12px;
      line-height: 20px;
      background: #FAAD14;
      border-radius: 6px;
      cursor: pointer;
      &:active {
        opacity: .8;
      }
    }
  }
  .main-content {
    flex: auto;
    padding: 10px 80px;
    overflow: auto;
    &.is__sync .item {
      border-color: #1AAFA7;
    }
    .item {
      padding: 20px 20px 30px;
      margin-top: 10px;
      border: solid 1px #fff;
      border-radius: 10px;
      transition: all .5s;
      position: relative;
      .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 8;
        cursor: pointer;
      }
      .title {
        margin-bottom: 20px;
        :deep(img) {
          float: none !important;
          position: static !important;
        }
      }
      &:hover {
        box-shadow: 0 0 10px #e9e9e9;
      }
      &.is__focus {
        border-color: #1AAFA7;
        .mask {
          display: none;
        }
        .footer {
          opacity: 1;
          visibility: visible;
        }
      }
      .answer,
      .analysis {
        display: flex;
        padding: 14px 16px;
        background: #F5F9FD;
        border-radius: 4px;
        margin-bottom: 20px;
        h6 {
          width: 38px;
          color: #3ABAB3;
          font-size: 12px;
          line-height: 20px;
          text-align: center;
          border-radius: 4px;
        }
        & > div {
          flex: 1 1 38px;
          color: #77808D;
          font-size: 12px;
        }
        :deep(img) {
          float: none !important;
          position: static !important;
        }
      }
      .footer {
        width: 100%;
        height: 36px;
        padding: 0 24px;
        font-size: 12px;
        line-height: 35px;
        border-top: 1px solid #EBF0FC;
        border-radius: 0px 0px 10px 10px;
        background: #EBF0FC;
        position: absolute;
        bottom: 0;
        left: 0;
        opacity: 0;
        visibility: hidden;
        transition: all .5s;
        .el-icon-loading {
          pointer-events: none;
        }
        h4 {
          color: #1A2633;
        }
        p {
          color: #77808D;
          margin-right: 20px;
        }
        & > *:not(:last-child) {
          display: inline-block;
          margin-right: 20px;
        }
        & > div {
          float: right;
          line-height: 32px;
          a {
            display: inline-block;
            margin-right: 20px;
            padding: 0 8px;
            height: 22px;
            line-height: 22px;
            border-radius: 4px;
            &:first-child {
              color: #FF3D3D;
              background: #FEF0F0;
              border: 1px solid #FBC4C4;
            }
            &:nth-of-type(2) {
              color: #FF8421;
              background: #FDF5E6;
              border: 1px solid #F5DAB1;
            }
          }
          i {
            color: #5B7DFF;
            font-size: 18px;
            vertical-align: middle;
            cursor: pointer;
            &:active {
              opacity: .8;
            }
          }
        }
      }
    }
  }
}
</style>
