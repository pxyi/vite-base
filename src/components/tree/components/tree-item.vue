<template>
  <div class="tree__item">
    <div 
      :class="{ 
        'has__children': data.children,
        'is__selected': data.selected,
        'tree__item__title': true 
      }"
      :style="{ paddingLeft: `${ data.level * 18 }px` }"
      @click="openedChange"
    >
      <i :class="{'el-icon-caret-right': true, 'is__opened': data.opened }" v-if="data.children && showCheckbox" />
      <span class="tree__expanded" v-if="data.children && !showCheckbox">{{ data.opened ? '-' : '+' }}</span>
      <el-checkbox v-if="showCheckbox" @click.stop :disabled="data.disabled" :indeterminate="data.indeterminate" v-model="data.checked" @change="checkHandle" />
      <span>{{ data.title }}</span>
      <i class="el-icon-loading" v-show="data.loading" />
    </div>
    <div class="tree__item__group" :class="{ 'is__show': data.opened }" v-show="data.children">
      <tree-item v-for="item in data.children" :data="item" :key="item.key" />
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { ref, computed, watch, inject } from 'vue';
import { ItemData } from './../store';
import store from './../store';
import mitt from './../../../utils/mitt';

export default {
  name: 'tree-item',
  props: {
    data: {
      type: Object as PropType<ItemData>,
      default: () => ({})
    }
  },
  setup(props) {
    let event = `event-${inject('uuid')}`;
    let lazy = inject('lazy');
    let load = inject('load') as (node: any, resolve: any) => void;
    let showCheckbox = inject('showCheckbox');
    let allowSelect = inject('allowSelect');

    const openedChange = async () => {
      mitt.emit(event, { type: 'click', data: props.data });

      if (props.data.children) {
        store.commit('set_item_opened', { key: props.data.key });
        mitt.emit(event, { type: 'fold', data: props.data });
      }

      if (allowSelect) {
        props.data.selected = !props.data.selected;
        store.commit('set_item_selected', props.data.key);
      }
      
      if (lazy && !props.data.children && !props.data.isLeaf) {
        let res = await new Promise((resolve) => { load(props.data, resolve); props.data.loading = true; });

        props.data.loading = false;
        props.data.children = res as ItemData[];
      }
    }

    const checkHandle = () => {
      store.commit('set_item_checked', { key: props.data?.key });
      mitt.emit(event, { type: 'check', data: props.data });
    }

    return { openedChange, checkHandle, showCheckbox }
  }
}
</script>
<style lang="scss">
$--opend-icon-color: #c0c4cc;
.tree__item__title {
  padding: 0 6px;
  font-size: 14px;
  line-height: 36px;
  font-weight: 400;
  border-radius: 3px;
  cursor: pointer;
  transition: all .2s;
  position: relative;
  text-indent: 32px;
  &.has__children, & > * {
    text-indent: 0;
  }
  &:hover {
    background: #F5F7FA;
  }
  &.is__selected {
    background: rgba($color: #19aea6, $alpha: .3);
  }
  .el-icon-caret-right {
    margin: 0 6px 0 12px;
    color: $--opend-icon-color;
    transition: all .2s;
    &.is__opened {
      transform: rotateZ(90deg);
    }
  }
  .el-icon-loading {
    color: #80848c;
    margin-left: 8px;
  }
  .el-checkbox {
    margin-right: 6px;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner{
    background: #19aea6 !important;
    border-color: #19aea6 !important;
  }
  .el-checkbox__inner {
    width: 18px;
    height: 18px;
    &::after {
      border-width: 0px 2px 2px 0px;
      height: 10px;
      left: 5px;
    }
  }
  .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
    height: 3px;
    top: 6px;
  }
  .tree__expanded {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin: 0 6px 0 12px;
    color: #fff;
    font-size: 16px;
    line-height: 14px;
    text-align: center;
    border-radius: 3px;
    background: #19aea6 !important;
  }
}
.tree__item__group {
  transition: all .25s;
  height: 0;
  overflow: hidden;
  &.is__show {
    height: auto;
  }
}
</style>