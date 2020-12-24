import Vuex from 'vuex';

export default new Vuex.Store({
  state: {
    focusData: null,
    dataSet: []
  },
  mutations: {
    'set_focus_data' (state, payload) {
      state.focusData = payload;
    },
    'set_data_set'(state, payload) {
      state.dataSet = payload
    }
  }
});