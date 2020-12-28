<template>
  <div class="lay__menu__container">
    <div class="logo">
      <img src="/@/assets/menu/logo.png" alt="logo">
    </div>
    <div class="menu-content">
      <template v-for="(menu) in list" :key="menu.key">
        <div class="menu-item" :class="{ 'is-closed': !menu.closed }">
          <div class="menu-title" 
            @click="menu.isLeaf && !$route.path.includes(menu.key) ? $router.push(menu.key) : (menu.closed = !menu.closed)"
            :class="{ 'active': $route.path.includes(menu.key) }"
          >
            <img :src="`nav-icon/${menu.icon}.png`" alt="icon" />
            <span>{{ menu.title }}</span>
            <i class="el-icon-arrow-up" v-if="!menu.isLeaf"></i>
          </div>
          <div class="menu-sub" v-if="!menu.isLeaf" :style="{ height: `${menu.children.length * 45}px` }">
            <div class="menu-sub-item" v-for="link in menu.children" :key="link.key" @click="$router.push(link.key)" :class="{ 'active': $route.path === link.key }">{{ link.title }}</div>
          </div>
        </div>
      </template>
      <div class="menu-item">
        <div class="menu-title" @click="goSystem"><img :src="'nav-icon/system.png'" alt="进入后台"><span>进入后台</span></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, ref } from 'vue';
import MenuList, { RouterConf } from './../core/menu-list';
import { useRoute } from 'vue-router';
import { ElMessageBox } from 'element-plus';

export default {
  name: 'lay-menu',
  setup() {
    let list: { value: RouterConf[] } = ref([]);

    let initPath = useRoute().path;
    MenuList.map((res: any) => {
      res.closed = initPath.includes(res.key);
      list.value.push(res);
    });

    const goSystem = async () => { 
      let confirm = await ElMessageBox.confirm('是否进入后台管理系统？', '进入后台', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
      confirm && (window.location.href = import.meta.env.VITE_APP_SYSTEM_URL as string);
    }
    
    return { list, initPath, goSystem }
  }
}
</script>

<style lang="scss" scope>
$--menu--item-height: 45px;
.lay__menu__container {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #fff;
  box-shadow: 2px 0px 8px 0px rgba(45, 113, 183, 0.15);
  .logo {
    height: 120px;
    background: url('./../assets/menu/logo-bg.png') no-repeat 0 0;
    background-size: 40px 100px;
    overflow: hidden;
    cursor: pointer;
    img {
      display: block;
      width: 80px;
      margin: 30px 0 0 65px;
    }
  }
}

.menu-content {
  flex: auto;
  overflow: auto;
  .menu-item {
    color: #333;
    line-height: $--menu--item-height;
    position: relative;
    cursor: pointer;
    .menu-title {
      padding-left: 48px;
      transition: all .1s;
      position: relative;
      &.active {
        color: #1AAFA7;
        font-weight: 600;
        &::after {
          display: block;
          content: '';
          width: 4px;
          height: 20px;
          border-radius: 2px;
          background: #1AAFA7;
          position: absolute;
          right: 2px;
          top: 50%;
          margin-top: -10px;
        }
      }
      &:hover {
        color: #1AAFA7;
      }
      i {
        float: right;
        line-height: $--menu--item-height;
        margin-right: 12px;
        transition: all .3s;
      }
    }
    &.is-closed {
      i {
        transform: rotateZ(180deg);
      }
      .menu-sub{
        height: 0 !important;
      }
    }
    .menu-sub {
      transition: all .3s;
      overflow: hidden;
    }
    .menu-sub .menu-sub-item {
      color: #77808D;
      padding-left: 48px;
      line-height: $--menu--item-height;
      transition: all .1s;
      &:hover, &.active {
        background: rgba(26, 175, 167, 0.1);
      }
      &.active {
        pointer-events: none;
      }
    }
    img {
      display: block;
      width: 20px;
      position: absolute;
      top: 50%;
      left: 20px;
      margin-top: -10px;
    }
  }
}

@media only screen and (min-width: 1680px) {
  .menu-title, .menu-sub-item { font-size: 16px; }
}
</style>
