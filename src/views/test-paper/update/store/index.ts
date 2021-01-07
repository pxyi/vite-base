import Vuex from 'vuex';
import { cloneDeep } from 'lodash';

export default new Vuex.Store({
  state: {
    paperInfo: {
      paperCharpts: []
    },
    classType: 1
  },
  mutations: {
    set_paper_info(state, payload) {
      state.paperInfo = cloneDeep(payload);
    }, 
    set_paper_charpts(state, payload) {
      state.paperInfo.paperCharpts = cloneDeep(payload);
    },
    set_class_type(state, payload) {
      state.classType = payload
    }
  },
  getters: {
    paperCharpts: state => state.paperInfo.paperCharpts
  }
});