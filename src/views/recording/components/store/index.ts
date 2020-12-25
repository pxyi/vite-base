import Vuex from 'vuex';
export default new Vuex.Store({
  state: {
    focusData: null,
    dataSet: [],
    isSync: false
  },
  mutations: {
    'set_focus_data' (state, payload) {
      state.focusData = payload;
      state.isSync = false;
    },
    'set_data_set'(state, payload) {
      state.dataSet = payload
    },
    'set_is_sync'(state, payload) {
      state.isSync = payload;
    },
    'delete_data'(state, payload) {
      state.focusData = null;
      state.dataSet = state.dataSet.filter((i: {id}) => i.id !== payload);
    },
    'reset'(state) {
      state.focusData = null;
      state.dataSet = [];
      state.isSync = false;
    }
  }
});