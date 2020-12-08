<template>
  <div class="lay__menu__container">
    
    <div class="logo">
      <img src="/@/assets/menu/logo.png" alt="logo">
    </div>
    <div class="menu-content">
      <template v-for="(menu) in list" :key="menu.key">
        <div class="menu-item" :class="{ 'is-closed': menu.closed }">
          <div class="menu-title" 
            @click="menu.isLeaf && !$route.path.includes(menu.key) ? $router.push(menu.key) : (menu.closed = !menu.closed)"
            :class="{ 'active': $route.path.includes(menu.key) }"
          >
            <img :src="menu.icon" alt="icon" />
            <span>{{ menu.title }}</span>
            <i class="el-icon-arrow-up" v-if="!menu.isLeaf"></i>
          </div>
          <div class="menu-sub" v-if="!menu.isLeaf" :style="{ height: `${menu.children.length * 45}px` }">
            <div class="menu-sub-item" v-for="link in menu.children" :key="link.key" @click="$router.push(link.key)" :class="{ 'active': $route.path === link.key }">{{ link.title }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, ref } from 'vue';
import MenuList, { RouterConf } from './../core/menu-list';

export default {
  name: 'lay-menu',
  setup() {
    let list: { value: RouterConf[] } = ref([]);

    MenuList.map(async res => {res.icon = (await res.icon).default; list.value.push(res)});

    return { list }
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
  background: #232323;
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
    color: #DDDDDD;
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
      color: #fff;
      padding-left: 48px;
      line-height: $--menu--item-height;
      transition: all .1s;
      &:hover, &.active {
        background: #1AAFA7;
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
</style>
