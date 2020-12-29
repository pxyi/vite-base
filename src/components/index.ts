import { App } from 'vue';
import CusEditor from './editor/index.vue';
import CusTree from './tree/index.vue';
import CusList from './list/index.vue';
import CusForm from './form/index.vue';
import CusEmpty from './empty/index.vue';
import CusSkeleton from './skeleton/index.vue';
import CusQuery from './query/index.vue';
import CusCondition from './condition/index.vue';
import CusTable from './table/index.vue';

const AppComponents: any = {
  CusEditor,
  CusTree,
  CusList,
  CusTable,
  CusForm,
  CusEmpty,
  CusSkeleton,
  CusQuery,
  CusCondition,
};

const install = (Vue: App) => {
  Object.keys(AppComponents).map(key => Vue.component(AppComponents[key].name, AppComponents[key]));
};

export default {
  version: '0.0.1',
  install,
}
