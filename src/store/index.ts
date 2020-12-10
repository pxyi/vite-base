import Vuex from 'vuex';

import getters from './getters';

import UserStore from './modules/user';
import CommonStore from './modules/common';

const store = new Vuex.Store({
  modules: { 
    user: UserStore,
    common: CommonStore
  },
  getters
})

export default store
