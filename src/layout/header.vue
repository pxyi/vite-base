<template>
  <div class="lay__header__container">
    <el-popover v-model:visible="visible" placement="bottom-start" :width="200" trigger="click">
      <template #reference>
        <div class="age__class"><span>{{ subject.name }}</span><i class="el-icon-arrow-down" /></div>
      </template>
      <div class="class__container">
        <div v-for="grade in subjectList" :key="grade.id">
          <h4>{{ grade.name }}</h4>
          <div class="grade__content">
            <div
              v-for="course in grade.child"
              :key="course.code"
              :class="{ 'active': subject.code === course.code }"
              @click="setSubject(course)"
            >{{ course.name }}</div>
          </div>
        </div>
      </div>
    </el-popover>

    <div ref="slot" class="cus__slot"></div>

    <div class="header-user" v-if="userInfo">
      <el-dropdown @command="commandList.get($event)()">
        <div class="el-dropdown-link">
          <span class="user-name">Hi，{{ userInfo.nickname }}</span>
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
import { computed, ref, onMounted, watch, Ref, isRef} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import emitter from './../utils/mitt';
import { useStore } from 'vuex';
import axios from 'axios';
import {REMOVE_SUBJECT_LIST, REMOVE_USER_INFO, SET_SUBJECT, SET_SUBJECT_LIST} from '../store/types';
import { AxResponse } from '../core/axios';

const getSubjectList = (store): Promise<any> => {
  return new Promise(async resolve => {
    if (store.getters.subjectList) {
      resolve(store.getters.subjectList);
    } else {
      let res = await axios.post<any, AxResponse>('/permission/user/userDataSubjects');
      store.commit(SET_SUBJECT_LIST, res.json);
      try {
        let subStr = window.localStorage.getItem('subject')
        if (subStr) {
          let subject = JSON.parse(subStr);
          let has = res.json.some(l => !!l.child.some(s => s.code === subject.code));
          store.commit(SET_SUBJECT, has ? subject : res.json[0].child[0]);
        } else {
          store.commit(SET_SUBJECT, res.json[0].child[0]);
        }
        resolve(res.json);
      } catch (error) {
        store.commit(SET_SUBJECT, res.json[0].child[0]);
        resolve(res.json);
      }
    }
  })
}

export default {
  name: 'lay-header',
  setup(props, ctx) {

    let route = useRoute();
    let router = useRouter();
    let store = useStore();

    let userInfo = computed(() => store.getters?.userInfo?.user);

		let visible = ref(false)

    /* 接受组件传递内容插入至 slot, 路由变更时，清空 slot 内容 */
    let slot: { value: HTMLElement | null } = ref(null);
    const __setSlot = s => slot.value?.append(s.$el ? s.$el : s.value.children[0]);
    emitter.on('slot', __setSlot );
    watch(() => route.path, (e) => ( (slot.value as HTMLElement).innerHTML = '' ));

    /* 接受 组件传递的方法，如果已存在 subject 则只需 */
    let effectList: (([key]: string) => void)[] = [];
    const __setFns = (calls) => {
      let fns = typeof calls === 'function' ? [ calls ] : calls;
      effectList = [ ...effectList, ...fns ];
      subject.value.code && fns.map(fn => fn(subject.value.code));
    }
    emitter.on('effect', __setFns);
    watch(() => route.path, (to, from) => to !== from && (effectList = []))

    /* 获取 sbujectList，并监听subject 变更，执行组件传递来的方法 */
    let subjectList = ref([]);
    getSubjectList(store).then(res => { subjectList.value = res; });
    let subject: Ref<{[key: string]: any}> = computed(() => store.getters.subject);
    watch(subject, () => effectList.map(fn => fn(subject.value.code)) );

    let subjectName = ref('');
    const setSubject = (course) => {
      store.commit(SET_SUBJECT, course);
      visible.value = false;

    }

    let commandList = new Map([
      ['logout', () => {
        store.commit(REMOVE_USER_INFO);
        store.commit(REMOVE_SUBJECT_LIST);
        router.push('/login');
      }]
    ]);

    return { slot, commandList, subjectList, subject, setSubject, visible, userInfo }
  }
}
</script>
<style lang="scss" scoped>
.lay__header__container {
  display: flex;
  .header-user {
    .user-name, .el-icon-arrow-down {
      color: #fff;
    }
    margin-left: auto;
    cursor: pointer;
  }
}
.cus__slot {
  flex: auto;
  height: 100%;
  padding: 0 30px;
  overflow: hidden;
}
:deep(.header_ref) .el-input__suffix i {
  color: #fff !important;
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
