<template>
  <el-container>
    <el-aside :width="asideWidth"><lay-menu /></el-aside>
    <el-container>
      <el-header height="60px" v-if="!hideHeader"><lay-header /></el-header>
      <el-main :class="{ is__index: hideHeader}">
        <router-view v-slot="{ Component }">
          <div class="layout__container">
            <component :is="Component" />
          </div>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import LayMenu from './menu.vue';
import LayHeader from './header.vue';
import TreeItem from '../components/tree/components/tree-item.vue';
import { ref, computed, Ref, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'lay-base',
  components: { LayMenu, LayHeader, TreeItem },
  setup() {
    let route = useRoute();

    let hideHeader = computed(() => ['/home'].includes(route.path));

    let asideWidth = ref(document.body.offsetWidth > 1080 ? '200px' : '54px');

    onUnmounted(() => {
      let drawer = document.querySelectorAll('[class^=__drawer__]') || [];
      let modal = document.querySelectorAll('[class^=__modal__]') || [];
      let screen = document.querySelectorAll('[class^=__screen__]') || [];
      drawer.forEach(i => i.remove());
      modal.forEach(i => i.remove());
      screen.forEach(i => i.remove());
    })
    
    return { hideHeader, asideWidth }
  }
}
</script>
<style lang="scss" scoped>
.el-container {
  height: 100%;
}
.el-header {
  height: 60px;
  clear: #fff;
  line-height: 60px;
  background: #1AAFA7;
}
.el-aside {
  overflow: initial;
}
.el-main {
  background: #F4F5F9;
  &.is__index {
    background: #fff;
  }
}
.layout__container {
  height: 100%;
  overflow: auto;
}
</style>