import Vuex from 'vuex';
import $, { emitter } from '$';

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
      state.paperInfo = $.clone(payload);
    },
    set_paper_charpts(state, payload) {
      emitter.emit('test-paper-change');
      state.paperInfo.paperCharpts = $.clone(payload);
    },
    set_class_type(state, payload) {
      state.classType = payload
    }
  },
  getters: {
    paperCharpts: state => state.paperInfo.paperCharpts
  }
});
