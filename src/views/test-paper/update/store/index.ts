import Vuex from 'vuex';
import { cloneDeep } from 'lodash';

export default new Vuex.Store({
  state: {
    paperInfo: {
      paperCharpts: []
    }
  },
  mutations: {
    set_paper_info(state, payload) {
      state.paperInfo = payload;
    }
  },
  getters: {
    questionList: state => state.paperInfo.paperCharpts
  }
});