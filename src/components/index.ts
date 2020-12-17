import { App } from 'vue';
import CusTree from './tree/index.vue';
import CusList from './list/index.vue';
import CusForm from './form/index.vue';

const AppComponents: any = {
  CusTree,
  CusList,
  CusForm
};

const install = (Vue: App) => {
  Object.keys(AppComponents).map(key => Vue.component(AppComponents[key].name, AppComponents[key]));
};

export default {
  version: '0.0.1',
  install,
}