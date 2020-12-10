<template>
  <div class="lay__header__container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="i in breadcrumb" :key="i">{{ i }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div ref="slot"></div>

    <div class="header-user">
      <el-dropdown>
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
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import emitter from './../utils/mitt';

export default {
  name: 'lay-header',
  setup(props, ctx) {

    let $route = useRoute();
    let breadcrumb = computed(
      () => $route.matched.reduce((t: string[], c) => { c.meta.title && t.push(c.meta.title); return t; }, [])
    );

    let slot: { value: HTMLElement | null } = ref(null);

    watch(() => $route.path, (e) => { (slot.value as HTMLElement).innerHTML = ''; });

    emitter.on('slot', s => slot.value?.append(...s.value.children) );

    return { breadcrumb, slot }
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
</style>