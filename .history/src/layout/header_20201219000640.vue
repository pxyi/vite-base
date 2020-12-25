<template>
  <div class="lay__header__container">
    <el-popover placement="bottom-start" :width="200" trigger="click">
      <template #reference>
        <div class="age__class"><span>小学数学111</span><i class="el-icon-arrow-down" /></div>
      </template>
      <div class="class__container">
        <div v-for="grade in subjectList" :key="grade.id">
          <h4>{{ grade.name }}</h4>
          <div class="grade__content">
            <div 
              v-for="course in grade.child" 
              :key="course.code" 
              :class="{ 'active': subjectCode === course.code }"
              @click="setSubjectCode(course.code)"
            >{{ course.name }}</div>
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
import { computed, ref, onMounted, watch, onBeforeUnmount, Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import emitter from './../utils/mitt';
import { useStore } from 'vuex';
import axios from 'axios';
import { REMOVE_USER_INFO, SET_SUBJECT, SET_SUBJECT_LIST } from '../store/types';
import { AxResponse } from '../core/axios';

const getSubjectList = (store): Promise<any> => {
  return new Promise(async resolve => {
    if (store.getters.subjectList) {
      resolve(store.getters.subjectList);
    } else {
      let res = await axios.post<any, AxResponse>('/permission/user/userDataSubjects');
      store.commit(SET_SUBJECT_LIST, res.json);
      store.commit(SET_SUBJECT, res.json[0].child[0].code);
      resolve(res.json);
    }
  })
}

export default {
  name: 'lay-header',
  setup(props, ctx) {

    let route = useRoute();
    let router = useRouter();
    let store = useStore();

    let breadcrumb = computed( () => route.matched.reduce((t: string[], c) => { c.meta.title && t.push(c.meta.title); return t; }, []) );


    /* 接受组件传递内容插入至 slot, 路由变更时，清空 slot 内容 */
    let slot: { value: HTMLElement | null } = ref(null);
    const __setSlot = s => slot.value?.append(...s.value.children)
    emitter.on('slot', __setSlot );
    watch(() => route.path, (e) => ( (slot.value as HTMLElement).innerHTML = '' ));

    /* 接受 组件传递的方法，如果已存在 subjectCode 则只需 */
    let effectList: (([key]: string) => void)[] = [];
    const __setFns = (fns) => { 
      effectList = typeof fns === 'function' ? [ fns, ...effectList ] : [ ...fns, ...effectList]; 
      subjectCode.value && effectList.map(fn => fn(subjectCode.value));
    }
    emitter.on('effect', __setFns);
    watch(() => route.path, (to, from) => to !== from && (effectList = []))

    /* 获取 sbujectList，并监听subjectCode 变更，执行组件传递来的方法 */
    let subjectList = ref([]);
    getSubjectList(store).then(res => { subjectList.value = res; });
    let subjectCode: Ref<string> = computed(() => store.getters.subject);
    watch(subjectCode, () => effectList.map(fn => fn(subjectCode.value)) );
    const setSubjectCode = (code) => store.commit(SET_SUBJECT, code);

    let commandList = new Map([
      ['logout', () => {
        store.commit(REMOVE_USER_INFO)
        router.push('/login');
      }]
    ]);

    onBeforeUnmount(() => {
      emitter.off('slot', __setSlot );
      emitter.off('effect', __setFns );
    });

    return { breadcrumb, slot, commandList, subjectList, subjectCode, setSubjectCode }
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
  padding: 0 30px;
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