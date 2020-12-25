<template>
  <div class="tree__container">
    <tree-item v-for="item in dataset" :key="item.key" :data="item" />
  </div>
</template>

<script lang="ts">
import { ref, unref, onMounted, computed, provide, getCurrentInstance ,inject} from 'vue';
import type { PropType } from 'vue';
import TreeItem from './components/tree-item.vue';
import store, { ItemData } from './store';
import mitt from './../../utils/mitt';


type IDataSet = PropType<ItemData[]>;

type IButtons = PropType<Array<'delete' | 'sort' | 'add'>>;

export default {
  name: 'cus-tree',
  components: { TreeItem },
  props: {
    // dataSet: {
    //   type: Array as IDataSet,
    //   default: () => []
    // },
    showCheckbox: {
      type: Boolean,
      default: () => false
    },
    buttons: {
      type: Array as IButtons,
      default: () => []
    },
    load: {
      type: Function,
      default: () => (() => {})
    },
    lazy: {
      type: Boolean,
      default: false
    },
    allowSelect: {
      type: Boolean,
      default: false
    }
  },
  
  setup(props, { emit }) {
    let uuid = getCurrentInstance()?.uid;
 const dataset = inject("dataset");
    provide('uuid', uuid);
    provide('lazy', props.lazy);
    provide('load', props.load);
    provide('allowSelect', props.allowSelect);
    provide('showCheckbox', props.showCheckbox);

    mitt.on(`event-${uuid}`, ({ type, data }) => emit(`on-${type}`, data) );

    store.commit('set_data', JSON.parse(JSON.stringify(unref(props.dataSet))));

    // let dataset = computed(() => store.state.data);
    console.log(dataset);
    

    return { dataset }
  }
}
</script>