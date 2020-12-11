<template>
  <div class="lay__header__container">
    <el-popover placement="bottom-start" :width="200" trigger="click">
      <template #reference>
        <div class="age__class"><span>小学数学</span><i class="el-icon-arrow-down" /></div>
      </template>
      <div class="class__container">
        <div v-for="grade in subjects" :key="grade.id">
          <h4>{{ grade.name }}</h4>
          <div class="grade__content">
            <div v-for="course in grade.child" :key="course.id">{{ course.name }}</div>
          </div>
        </div>
      </div>
    </el-popover>

    <div ref="slot" class="cus__slot"></div>

    <div class="header-user">
      <el-dropdown @command="commandList.get($event)()">
        <div class="el-dropdown-link">
          <span class="user-name">Hi，用户名</span>
          <i class="el-icon-arrow-down"></i>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="el-icon-user" disabled>个人中心</el-dropdown-item>
            <el-dropdown-item icon="el-icon-setting" disabled>主题设置</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import emitter from './../utils/mitt';
import { useStore } from 'vuex';
import axios from 'axios';
import { REMOVE_USER_INFO } from '../store/types';
import { AxResponse } from '../core/axios';

export default {
  name: 'lay-header',
  setup(props, ctx) {

    let route = useRoute();
    let router = useRouter();
    let store = useStore();

    let breadcrumb = computed(
      () => route.matched.reduce((t: string[], c) => { c.meta.title && t.push(c.meta.title); return t; }, [])
    );

    /* 接受组件传递内容插入至 slot, 路由变更时，清空 slot 内容 */
    let slot: { value: HTMLElement | null } = ref(null);
    emitter.on('slot', s => slot.value?.append(...s.value.children) );
    watch(() => route.path, (e) => ( (slot.value as HTMLElement).innerHTML = '' ));

    let effectList = [];
    emitter.on('effect', (fns) => effectList = typeof fns === 'function' ? [fns] : fns);

    let subjects = ref([]);
    axios.post<any, AxResponse>('/permission/user/userDataSubjects').then(res => subjects.value = res.json)

    let commandList = new Map([
      ['logout', () => {
        store.commit(REMOVE_USER_INFO)
        router.push('/login');
      }]
    ]);

    return { breadcrumb, slot, commandList, subjects }
  }
}
</script>
<style lang="scss" scope>
.lay__header__container {
  display: flex;
  .el-breadcrumb {
    .el-breadcrumb__inner, 
    .el-breadcrumb__separator {
      color: #fff;
      &:hover {
        color: #fff;
      }
    }
    line-height: 60px;
  }
  .header-user {
    .el-dropdown {
      color: #fff;
    }
    margin-left: auto;
    cursor: pointer;
  }
}
.cus__slot {
  flex: auto;
  padding: 0 40px;
}
.age__class {
  margin-left: 20px;
  color: #fff;
  font-size: 18px;
  font-weight: 400;
  cursor: pointer;
  span {
    display: inline-block;
    min-width: 72px;
  }
  i {
    margin-left: 8px;
  }
}
.class__container {
  h4 {
    color: #000;
    margin: 12px 0;
  }
  & > div:not(:first-child) {
    margin-top: 16px;
  }
  .grade__content {
    overflow: hidden;
    & > div {
      float: left;
      color: #77808d;
      margin: 0 12px 8px 0;
      cursor: pointer;
      &:hover,
      &.active {
        color: #1AAFA7;
      }
    }
  }
}
</style>