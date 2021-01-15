<template>
  <div class="tool-list-content" v-if="!data">
    <h4>共解析出 {{ dataset.length }} 题</h4>
    <ul>
      <li v-for="(data, idx) in dataset" :key="data.id" @click.stop="setFocusData(idx)">
        <span>第<i>{{ idx + 1 }}</i>题</span>
        <a>{{ data.questionTypeName }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { ref, Ref, computed } from 'vue';
import store from './../store';
import { ScrollTop } from "../../../../utils/base";

export default {
  setup() {
    let dataset = computed(() => store.state.dataSet );

    let data: Ref<any> = computed(() => dataset.value[store.state.checkedIndex]);

    let setFocusData = (idx) => {
      let top = (document.querySelectorAll('.main-content .item')[idx] as HTMLElement).offsetTop;
      ScrollTop(document.querySelector('.main-content'), top - 80, 2000);
      store.commit('set_checked_index', idx)
    };

    return { dataset, setFocusData, data }
  }
}
</script>

<style lang="scss" scoped>
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
    cursor: pointer;
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
