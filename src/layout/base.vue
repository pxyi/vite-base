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
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'lay-base',
  components: { LayMenu, LayHeader },
  setup() {
    let route = useRoute();

    let hideHeader = computed(() => ['/home'].includes(route.path));

    let asideWidth = ref(document.body.offsetWidth > 1080 ? '200px' : '54px');
    
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
  height: calc(100vh - 100px);
  overflow: auto;
}
</style>