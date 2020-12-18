import { App } from 'vue';
import CusTree from './tree/index.vue';
import CusList from './list/index.vue';
import CusForm from './form/index.vue';
import CusEmpty from './empty/index.vue';
import CusSkeleton from './skeleton/index.vue';
import CusQuery from './query/index.vue';

const AppComponents: any = {
  CusTree,
  CusList,
  CusForm,
  CusEmpty,
  CusSkeleton,
  CusQuery
};

const install = (Vue: App) => {
  Object.keys(AppComponents).map(key => Vue.component(AppComponents[key].name, AppComponents[key]));
};

export default {
  version: '0.0.1',
  install,
}