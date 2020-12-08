<template>
  <el-container>
    <el-aside width="200px"><lay-menu /></el-aside>
    <el-container>
      <el-header height="60px"><lay-header /></el-header>
      <el-main>
        <div class="container"><router-view /></div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import LayMenu from './menu.vue';
import LayHeader from './header.vue';

export default {
  name: 'lay-base',
  components: { LayMenu, LayHeader },
  setup() {
    
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
.container {
  height: 100%;
  overflow: auto;
}
</style>