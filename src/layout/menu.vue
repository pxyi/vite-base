<template>
  <div class="lay__menu__container" :class="{ 'is__ipad': isIpad, 'is__slide': isSlide }">
    <template v-if="isIpad && !isSlide">
      <div class="logo"></div>
      <div class="menu-content">
        <template v-for="(menu) in list" :key="menu.key">
          <div class="menu-cell" :class="{ 'is__current': $route.path.includes(menu.key) }">
            <template v-if="menu.isLeaf" @click="!$route.path.includes(menu.key) && $router.push(menu.key)">
              <img :src="`nav-icon/${menu.icon}.png`" alt="icon" />
            </template>
            <template v-else>
              <el-popover placement="right-start" :width="100" :title="menu.title" trigger="hover">
                <ul class="menu-item-box">
                  <li v-for="item in menu.children" :key="item.key" 
                    @click="!$route.path.includes(item.key) && $router.push(item.key)"
                    :class="{ 'is__current': $route.path.includes(item.key) }"
                  >{{ item.title }}</li>
                </ul>
                <template #reference><img :src="`nav-icon/${menu.icon}.png`" alt="icon" /></template>
              </el-popover>
            </template>
          </div>
        </template>
        <div class="menu-cell" @click="goSystem"><img :src="'nav-icon/system.png'" alt="进入后台"></div>
      </div>
    </template>
    <template v-else>
      <div class="logo-xinzhou" v-if="isXinzhou">
        <img src="./../assets/menu/logo-xinzhou.png" alt="logo">
      </div>
      <div class="logo" v-else>
        <img src="./../assets/menu/logo.png" alt="logo">
      </div>
      <div class="menu-content">
        <template v-for="(menu) in list" :key="menu.key">
          <div class="menu-item" :class="{ 'is-closed': !menu.closed }">
            <div class="menu-title"
              @click=" menu.isLeaf && !$route.path.includes(menu.key) ? $router.push(menu.key) : (menu.closed = !menu.closed)"
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
    </template>

    <div class="lay__menu__slide-btn" v-if="isIpad" @click="isSlide = !isSlide"><img src="/src/assets/menu/slide-icon.png" alt="爱学标品"></div>
  </div>
</template>

<script lang="ts">
import { reactive, ref, Ref, watch, computed, nextTick } from 'vue';
import MenuList, { RouterConf } from './../core/menu-list';
import { useRoute } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { useStore } from 'vuex';
import { cloneDeep } from 'lodash';
interface IlistItem extends RouterConf { closed?: boolean };

export default {
  name: 'lay-menu',
  setup() {
    let store = useStore();

    let initPath = useRoute().path;

    let userInfo = computed(() => store.getters.userInfo);
    let allowPath = ref(userInfo.value.roles.reduce((path, role) => path += role.menuUrls, '') || '');
    let dynamicRoutes = cloneDeep(MenuList).reduce((arr, node: IlistItem) => {
      node.closed = initPath.includes(node.key);
      if (allowPath.value.includes(node.key)) {
        if (!node.isLeaf) {
          node.children = node.children!.filter(item => allowPath.value.includes(item.key));
        }
        arr.push(node);
      }
      return arr;
    }, [] as IlistItem[]);
    let list: Ref<IlistItem[]> = ref(dynamicRoutes);
    
    const goSystem = () => {
      ElMessageBox.confirm('是否进入后台管理系统？', '进入后台', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(_ => {
        window.open(`${import.meta.env.VITE_APP_SYSTEM_URL}`)
      }).catch(_ => {})
    }

    let isXinzhou = import.meta.env.VITE_IS_XINZHOU === 'true';
    let isSike = import.meta.env.VITE_IS_SIKE === 'true';

    let isIpad = ref(document.body.offsetWidth <= 1080);

    let isSlide = ref(false);

    return { list, initPath, goSystem, isXinzhou, isIpad, isSlide }
  }
}
</script>

<style lang="scss">
$--menu--item-height: 45px;
.lay__menu__container {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #fff;
  box-shadow: 2px 0px 8px 0px rgba(45, 113, 183, 0.15);
  z-index: 9;
  transition: all .25s;
  width: 100%;
  &.is__slide {
    width: 200px;
    .lay__menu__slide-btn img {
      transform: rotate(180deg);
    }
  }
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
  .logo-xinzhou {
    height: 120px;
    text-align: center;
    overflow: hidden;
    cursor: pointer;
    img {
      display: inline-block;
      width: 120px;
      margin-top: 30px;
    }
  }
  .menu-content .menu-cell {
    height: 44px;
    line-height: 44px;
    text-align: center;
    &.is__current,
    &:active {
      background: rgba(26,175,167,.1);
    }
    img {
      width: 22px;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .lay__menu__slide-btn {
    width: 30px;
    height: 52px;
    line-height: 52px;
    text-align: center;
    border-radius: 10px 0 0 10px;
    background: #D1D6DF;
    position: absolute;
    bottom: 100px;
    right: 0;
    img {
      display: inline-block;
      width: 17px;
    }
  }
}
.menu-item-box {
  margin: 0 -12px;
  li {
    line-height: 32px;
    padding: 0 12px;
    &.is__current,
    &:active {
      background: rgba(26,175,167,.1);
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
      font-weight: 500;
      &:hover{
        background: #f5f7fa;
      }
      &.active {
        pointer-events: none;
        background: rgba(26, 175, 167, 0.1);
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
