<template>
  <div class="main-container">
    <div class="fixed">
      <h2>检查区：</h2><div><i>2</i><span>处错误，请参照提示修改</span><a>查看</a></div>
    </div>
    <div class="main-content">
      <div class="item" :class="{ 'is__focus': focusData?.id === data.id }" v-for="data in dataset" :key="data.id">
        <div class="mask" @click="focusChange(data)"></div>
        <div class="title">
          <cus-editor v-model="data.title" hide-border />
        </div>
        <div class="answer">
          #F5F9FD
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import store from './../store';
export default {
  setup() {
    let dataset = computed(() => store.state.dataSet);

    let focusData = computed(() => store.state.focusData);

    const focusChange = (data) => store.commit('set_focus_data', data)

    return { dataset, focusData, focusChange }
  }
}
</script>

<style lang="scss" scope>
.main-container {
  max-width: 1000px;
  height: 100%;
  padding: 50px 80px 10px;
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
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
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
    .item {
      padding: 20px;
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
      &:hover {
        box-shadow: 0 0 10px #ddd;
      }
      &.is__focus {
        border-color: #1AAFA7;
        .mask {
          display: none;
        }
      }
    }
  }
}
</style>