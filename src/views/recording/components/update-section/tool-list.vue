<template>
  <div class="tool-list-content" v-if="!data">
    <h4>共解析出 {{ questionList.length }} 题</h4>
    <ul>
      <li v-for="(data, idx) in questionList" :key="data.id">
        <span>第<i>{{ idx + 1 }}</i>题</span>
        <a @click.stop="setFocusData(data, idx)">{{ data.questionTypeName }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { ref, Ref, computed } from 'vue';
import store from './../store';
export default {
  setup() {
    let questionList = computed(() => store.state.dataSet );

    let data: Ref<any> = computed(() => store.state.focusData);

    let setFocusData = (data, idx) => {
      let top = (document.querySelectorAll('.main-content .item')[idx] as HTMLElement).offsetTop;
      document.querySelector('.main-content')!.scrollTop = top - 80;
      
      store.commit('set_focus_data', data)
    };

    return { questionList, setFocusData, data }
  }
}
</script>

<style lang="scss" scope>
.tool-list-content {
  margin-top: 12px;
  overflow: auto;
  h4 {
    padding: 0 16px 20px;
    color: #77808D;
    border-bottom: 1px solid #EBF0FC;
  }
  li {
    padding: 0 20px 0 25px;
    color: #333;
    line-height: 50px;
    border-bottom: 1px solid #EBF0FC;
    i {
      color: #1AAFA7;
      margin: 0 8px;
    }
    a {
      display: block;
      float: right;
      margin-top: 10px;
      padding: 0 24px;
      line-height: 30px;
      background: rgba(26, 175, 167, 0.05);
      border-radius: 15px;
      border: 1px solid #EBF0FC;
      cursor: pointer;
      &:active {
        transform: scale(.98);
      }
      &:hover {
        color: #1AAFA7;
      }
      &.is__disabled {
        background: #F5F7FF;
        border: 1px solid #EBF0FC;
      }
    }
  }
}
</style>