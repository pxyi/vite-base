import Vuex from 'vuex';
import { cloneDeep } from 'lodash';
import emitter from '/@/utils/mitt'

export default new Vuex.Store({
  state: {
    paperInfo: {
      paperCharpts: []
    },
    classType: 1
  },
  mutations: {
    set_paper_info(state, payload) {
      emitter.emit('test-paper-change');
      state.paperInfo = cloneDeep(payload);
    },
    set_paper_charpts(state, payload) {
      emitter.emit('test-paper-change');
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
