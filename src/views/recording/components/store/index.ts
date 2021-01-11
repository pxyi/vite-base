import Vuex from 'vuex';
import axios from 'axios';
import { cloneDeep } from 'lodash';

export default new Vuex.Store({
  state: {
    focusData: null,
    errorList: [],
    dataSet: [],
    isSync: false
  },
  mutations: {
    'set_focus_data' (state, payload) {
      state.focusData = cloneDeep(payload);
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
    set_error_list(state, payload) {
      state.errorList = payload;
    },
    'reset'(state) {
      state.focusData = null;
      state.dataSet = [];
      state.errorList = [];
      state.isSync = false;
    }
  },
  actions: {
    'focus_data_change'({ commit, state }, payload) {
      if (state.focusData) {
        let data = cloneDeep(state.focusData);
        data.operationType = 2;
        data.questionSources && data.questionSources.length && data.questionSources.map(i => {
          if (i.provinceCity) {
            i.provinceId = i.provinceCity[0];
            i.cityId = i.provinceCity[1];
            i.areaId = i.provinceCity[2];
          };
          return i;
        })
        axios.post<null, any>('/tiku/question/editQuestion', 
          data, 
          { headers: { 'Content-Type': 'application/json' } 
        }).then(res => {
          commit('set_data_set', cloneDeep(state.dataSet.map((d: any) => { d.id === res.json.id && (d.failReason = res.json.failReason); return d;}) ));
        });
        commit('set_focus_data', payload);
      }
    }
  }
});