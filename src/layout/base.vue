<template>
  <el-container>
    <el-aside width="200px"><lay-menu /></el-aside>
    <el-container>
      <el-header height="60px"><lay-header /></el-header>
      <el-main>
        <router-view v-slot="{ Component }">
          <transition :name="transitionName">
            <div>
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import LayMenu from './menu.vue';
import LayHeader from './header.vue';
import TreeItem from '../components/tree/components/tree-item.vue';
import { ref, watch } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';

export default {
  name: 'lay-base',
  components: { LayMenu, LayHeader, TreeItem },
  setup() {
    let transitionName: { value: string } = ref('slide-right');
    onBeforeRouteUpdate((to, from) => {
      // transitionName.value = 'slide-right';
      // if (to.meta.index > from.meta.index){
      //   transitionName.value = 'slide-left';
      // } else{
      //   transitionName.value = 'slide-right';
      // }
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      transitionName.value = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    })
    return { transitionName }
  }
}
</script>
<style lang="scss" scoped>
.el-container {
  height: 100%;
}
.el-header {
  height: 60px;
  line-height: 60px;
  box-shadow: 0px 1px 2px 0px rgba(45, 113, 183, 0.15);
}
.el-aside {
  box-shadow: 2px 0px 8px 0px rgba(45, 113, 183, 0.15);
}
.container {
  height: 100%;
  overflow: auto;
}



.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  width: 100%;
  transition: all 300ms;
  position: absolute;
  z-index: 1;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-10%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(10%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(10%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-10%, 0, 0);
}
</style>