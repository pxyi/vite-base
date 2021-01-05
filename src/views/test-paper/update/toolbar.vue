<template>
  <div class="toolbar-container">
    <div class="thumbnail-box">
      <ul>
        <li v-for="(tab, idx) in tabList" :key="tab.icon" :class="{ active: activeIndex === idx }" @click="activeIndex = idx; showDetail = true;">
          <i class="iconfont" :class="[ tab.icon ]" />
          <span>{{ tab.title }}</span>
        </li>
      </ul>
    </div>
    <div class="toolbar-content" :class="{ active: showDetail }">
      <div class="tool-tabs">
        <div v-for="(tab, idx) in tabList" :key="tab.icon" :class="{ active: activeIndex === idx }" @click="activeIndex = idx;">{{ tab.title }}</div>
      </div>
      <div class="tool-tabs-main">
        <div v-for="(tab, idx) in tabList" :key="tab.icon" :class="{ active: activeIndex === idx }">
          <component :is="tab.component" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import AttributeComponent from './toolbar/attribute.vue';
import SortComponent from './toolbar/sort.vue';
import ScoreComponent from './toolbar/score.vue';
export default {
  components: { AttributeComponent, SortComponent, ScoreComponent },
  setup() {
    let activeIndex = ref(0);
    let showDetail = ref(false);

    let tabList = [
      { title: '试卷属性', icon: 'iconshijuanshuxing', component: AttributeComponent }, 
      { title: '题目排序', icon: 'iconshunxutiaozheng', component: SortComponent }, 
      { title: '设置分值', icon: 'iconshezhifenzhi', component: ScoreComponent }
    ];

    return { activeIndex, showDetail, tabList }
  }
}
</script>

<style lang="scss" scope>
.paper-update-container .toolbar-container {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  .thumbnail-box {
    width: 62px;
    padding: 20px 6px;
    color: #333;
    text-align: center;
    background: #fff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
    border-radius: 0 6px 6px 0;
    border: 1px solid #eee;
    position: absolute;
    top: 160px;
    cursor: pointer;
    li:hover {
      color: #1AAFA7;
    }
    li:not(:last-child) {
      margin-bottom: 20px;
    }
    i {
      font-size: 20px;
    }
    span {
      font-size: 12px;
      white-space: nowrap;
    }
  }
  .toolbar-content {
    display: flex;
    flex-direction: column;
    width: 250px;
    height: 100%;
    padding: 38px 10px 20px;
    background: #fff;
    box-shadow: 0px 2px 12px#EBEEF5;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate3d(-100%, 0, 0);
    transition: all .3s;
    &.active {
      transform: none;
    }
    .tool-tabs {
      display: flex;
      margin-bottom: 38px;
      div {
        flex: 1;
        color: #77808D;
        line-height: 1;
        text-align: center;
        cursor: pointer;
        transition: all .25s;
        &.active,
        &:hover {
          color: #1AAFA7;
        }
        &:not(:last-child) {
          border-right: solid 1px #DCDFE6;
        }
      }
    }
    .tool-tabs-main {
      flex: 1 1 20px;
      overflow: hidden;
      position: relative;
      & > div {
        width: 100%;
        height: 100%;
        opacity: 0;
        visibility: hidden;
        transition: all .25s;
        position: absolute;
        top: 0;
        left: 0;
        overflow: auto;
        &.active {
          opacity: 1;
          visibility: visible;
        }
      }
      h2 {
        margin-bottom: 15px;
        line-height: 40px;
        text-align: center;
        background: #F5F7FA;
        border-radius: 4px;
      }
    }
  }
}
</style>