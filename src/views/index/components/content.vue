<template>
  <div class="index__user">
    <h1>Hello, {{ nickName }}</h1>
    <h2>Welcome back to aixue education</h2>
  </div>
  <div class="c__main">
    <img class="m__head_bg" src="/@/assets/index/head-bg.png" alt="爱学标品" />
    <div class="m__menu">
      <div class="m__inline_title">快捷入口:</div>
      <!-- <div class="m__menu_cell">备授课</div>
      <div class="m__menu_cell">我的班级</div>
      <div class="m__menu_cell">题库</div>
      <div class="m__menu_cell" >资料库</div>
      <div class="m__menu_cell">试卷库</div>
      <div class="m__menu_cell">课程管理</div> -->
      <template  v-for="(menu) in list" :key="menu.key">
        <div class="m__menu_cell" v-for="link in menu.children" :key="link.key" @click="menuClick(menu, link)">{{ link.title }}</div>
      </template>
    </div>
    <div class="m__section">
      <h4><span>教研统计</span><sub>(较昨日)</sub></h4>
      <div class="s__flex">
        <div class="s__flex_cell">
          <h5>自建题目数</h5>
          <div :class=" [ teachResearchStatistics.questionNum.class ]">{{ teachResearchStatistics.questionNum.compare }}</div>
          <p><i>{{ teachResearchStatistics.questionNum.current }}</i></p>
        </div>
        <div class="s__flex_cell">
          <h5>自建试卷数</h5>
          <div :class="[ teachResearchStatistics.paperNum.class ]">{{ teachResearchStatistics.paperNum.compare }}</div>
          <p><i>{{ teachResearchStatistics.paperNum.current }}</i></p>
        </div>
        <div class="s__flex_cell">
          <h5>上传课件数</h5>
          <div :class="[ teachResearchStatistics.coursewareNum.class ]">{{ teachResearchStatistics.coursewareNum.compare }}</div>
          <p><i>{{ teachResearchStatistics.coursewareNum.current }}</i></p>
        </div>
        <div class="s__flex_cell">
          <h5>上传讲义数</h5>
          <div :class="[ teachResearchStatistics.handoutNum.class ]">{{ teachResearchStatistics.handoutNum.compare }}</div>
          <p><i>{{ teachResearchStatistics.handoutNum.current }}</i></p>
        </div>
      </div>
    </div>

    <div class="m__section">
      <h4>
        <span>备课统计</span>
        <el-tooltip effect="dark" content="备课统计较昨日" placement="top">
          <sub class="el-icon-question"></sub>
        </el-tooltip>
      </h4>
      <RankingComponent />
    </div>
  </div>
</template>
<script lang="ts">
import { useStore } from 'vuex';
import MenuList, { RouterConf } from '/@/core/menu-list';
import { useRoute, useRouter } from 'vue-router';
import RankingComponent from './ranking.vue';
import axios, {AxiosResponse} from 'axios';
import { reactive, ref, watch } from 'vue';
import { AxResponse } from '/@/core/axios'
export default {
  name: 'index-content',
  components: { RankingComponent },
  props: { nickName: String },
  setup() {
    const store = useStore();
    let teachResearchStatistics = reactive({coursewareNum: {}, handoutNum: {}, paperNum: {}, questionNum: {}});
    axios.get<any, AxiosResponse>(`/permission/indexStatistics/teachResearchStatistics?userId=${store.getters.userInfo.user.id}`).then((res: any) => {
      if (res.result) Object.keys(res.json).map(key => {
        res.json[key].class = res.json[key].range === 'DOWN' ? 'is__down' : (res.json[key].range === 'LINE' ? 'is__not' : '');
        res.json[key].compare = res.json[key].compare === 0 ? '' : res.json[key].compare;
        teachResearchStatistics[key] = res.json[key];
      });
    });
    let list: { value: RouterConf[] } = ref([]);
    let initPath = useRoute().path;
    let router = useRouter()
    MenuList.map((res: any) => {
      res.closed = initPath.includes(res.key);
      list.value.push(res);
    });
    const menuClick = (menu, link) => {
      router.push(link.key)
      menu.closed = !menu.closed
    }

    return { list, initPath, teachResearchStatistics, menuClick }
  }
}
</script>
<style lang="scss" scoped>
.index__user {
  h1 {
    padding-left: 20px;
    margin-bottom: 10px;
    color: #333;
    font-size: 32px;
    line-height: 1.4;
    font-weight: 400;
  }
  h2 {
    padding-left: 20px;
    margin-bottom: 22px;
    color: #77808D;
    font-size: 24px;
    line-height: 1.4;
    font-weight: 400;
  }
}
.c__main {
  padding: 30px 42px 0 24px;
  border-radius: 20px;
  background: #EFF5FB;
  position: relative;
  &::after {
    content: '';
    display: table;
    clear: both;
  }
  .m__head_bg {
    width: 346px;
    position: absolute;
    top: 0;
    right: 20px;
    margin-top: -122px;
    pointer-events: none;
  }
  .m__menu {
    display: flex;
    height: 64px;
    padding: 0 24px;
    margin-bottom: 40px;
    color: #fff;
    white-space: nowrap;
    line-height: 64px;
    border-radius: 10px;
    background: #3ABAB3;
    .m__inline_title {
      font-size: 22px;
      margin-right: 20px;
    }
    .m__menu_cell {
      height: 45px;
      margin-top: 10px;
      padding: 0 12px;
      line-height: 45px;
      font-size: 18px;
      border-radius: 8px;
      transition: all .25s;
      cursor: pointer;
      &:not(:last-child) {
        margin-right: 14px;
      }
      &:active {
        opacity: .8;
      }
      &:hover,
      &.active {
        background: rgba($color: #fff, $alpha: .4);
      }
    }
  }

  .m__section {
    margin-bottom: 40px;
    color: #333;
    font-size: 20px;
    line-height: 28px;
    h4 {
      margin-bottom: 10px;
      sub {
        margin-left: 6px;
        color: #77808D;
        font-size: 16px;
        vertical-align: middle;
        &.el-icon-question {
          font-size: 20px;
          cursor: pointer;
        }
      }
    }
    .s__flex {
      display: flex;
      .s__flex_cell {
        flex: 1;
        max-width: 220px;
        height: 110px;
        padding: 15px;
        background: #F6F9FC;
        border-radius: 12px;
        border: solid 5px #fff;
        transition: all .25s;
        cursor: pointer;
        &:hover {
          background: #fff;
          box-shadow: 0px 4px 11px 0px rgba(123, 154, 153, 0.3);
        }
        &:not(:last-child) {
          margin-right: 20px;
        }
        h5 {
          float: left;
          font-size: 18px;
          line-height: 25px;
          margin-bottom: 10px;
        }
        div {
          float: right;
          height: 30px;
          padding: 0 16px 0 30px;
          color: #fff;
          font-size: 16px;
          line-height: 30px;
          border-radius: 6px;
          background: #3ABAB3;
          position: relative;
          &.is__down {
            background: #FA5F1D;
            &::before {
              margin-top: -1px;
            }
            &::after {
              border-top-color: rgba($color: #fff, $alpha: 1);
              border-bottom-color: rgba($color: #fff, $alpha: 0);
              top: 18px;
            }
          }
          &::before,
          &::after {
            content: '';
            display: block;
            position: absolute;
          }
          &::before {
            height: 15px;
            width: 4px;
            background: #fff;
            top: 8px;
            left: 17px;
          }
          &::after {
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 6px;
            border-top-color: rgba($color: #fff, $alpha: 0);
            border-right-color: rgba($color: #fff, $alpha: 0);
            border-bottom-color: rgba($color: #fff, $alpha: 1);
            border-left-color: rgba($color: #fff, $alpha: 0);
            top: 0;
            left: 13px;
          }
          &.is__not {
            width: 60px;
            &::before,
            &::after {
              width: 15px;
              height: 2px;
              border: 0;
              background: #fff;
              top: 50%;
              left: 50%;
              margin-top: -2px;
              transform: translateX(20%);
            }
            &::before {
              transform: translateX(-120%);
            }
          }
        }
        p {
          font-size: 34px;
          line-height: 1;
          clear: both;
          i {
            display: inline-block;
            font-style: initial;
            transform: scaleX(.8);
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 1680px) {
  .index__user {
    h1 { font-size: 26px; }
    h2 { font-size: 18px; }
  }
  .c__main {
    padding: 30px 24px;
    .m__head_bg { width: 263px; margin-top: -84px; }
    .m__menu {
      height: 50px; line-height: 50px;
      .m__inline_title { font-size: 16px; }
      .m__menu_cell { height: 34px; margin-top: 8px; font-size: 14px; line-height: 34px; padding: 0 9px; }
    }
    .m__section {
      h4 { font-size: 18px; sub { font-size: 14px; } }
      .s__flex .s__flex_cell {
        height: 100px;
        padding: 10px;
        h5 { font-size: 16px; margin-bottom: 8px; }
        div {
          height: 26px; line-height: 26px; border-radius: 4px; padding: 0 14px 0 26px;
          &::before { left: 15px; height: 13px; }
          &::after { left: 11px;  }
          &.is__down::before { margin-top: -2px; }
          &.is__down::after { top: 16px; }
          &.is__not { width: 56px; &::before, &::after { width: 13px; } }
        }
        p { font-size: 26px; }
      }
    }
  }
}
@media only screen and (max-width: 1440px) {
  .index__user {
    h1 { font-size: 26px; }
    h2 { font-size: 20px; }
  }
  .c__main {
    padding: 30px 24px;
    .m__head_bg { width: 263px; margin-top: -84px; }
    .m__menu {
      height: 50px; line-height: 50px; margin-bottom: 30px;
      .m__inline_title { font-size: 16px; }
      .m__menu_cell { height: 34px; margin-top: 8px; font-size: 14px; line-height: 34px; padding: 0 9px; }
    }
    .m__section {
      margin-bottom: 30px;
      h4 { font-size: 16px; sub { font-size: 12px; } }
      .s__flex .s__flex_cell {
        height: 90px; padding: 8px; border-radius: 8px;
        &:not(:last-child) { margin-right: 14px; }
        h5 { font-size: 14px; margin-bottom: 8px; }
        div {
          height: 22px; font-size: 14px; line-height: 22px; padding: 0 8px 0 18px;
          &::before { width: 3px; top: 7px; left: 11px; height: 10px; transform: translateX(-10%); }
          &::after { left: 7px; border-width: 5px; }
          &.is__down::before { margin-top: -2px; }
          &.is__down::after { top: 14px; }
          &.is__not { width: 40px; &::before, &::after { height: 2px; width: 10px; } }
        }
        p { font-size: 26px; }
      }
    }
  }
}
@media only screen and (max-width: 1280px) {
  .index__user {
    h1 { font-size: 24px; }
    h2 { font-size: 16px; }
  }
  .c__main {
    padding: 20px;
    .m__head_bg { width: 200px; margin-top: -54px; }
    .m__menu {
      height: 45px; line-height: 45px; margin-bottom: 30px;
      .m__inline_title { font-size: 14px; margin-right: 8px; }
      .m__menu_cell { height: 30px; line-height: 30px; margin-right: 2px !important; }
    }
    .m__section {
      .s__flex .s__flex_cell {
        height: 80px;
        div {
          height: 23px; line-height: 23px; font-size: 12px; border-radius: 4px; padding: 0 8px 0 10px; text-indent: -4em; overflow: hidden;
          &::before { left: 8px; }
          &::after { left: 4px; }
        }
      }
    }
  }
}
</style>
