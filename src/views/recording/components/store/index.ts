import Vuex from 'vuex';
import axios from 'axios';
import $ from '$';

interface IState {
  checkedIndex: number;
  errorList: any[];
  dataSet: any[];
}

export default new Vuex.Store<IState>({
  state: {
    checkedIndex: -1,
    errorList: [],
    dataSet: []
  },
  mutations: {
    'set_checked_index'(state, payload) {
      state.checkedIndex = payload;
    },
    'set_data_set'(state, payload) {
      state.dataSet = payload
    },
    'delete_data'(state, payload) {
      state.checkedIndex = -1;
      state.dataSet = state.dataSet.filter((i: {id}) => i.id !== payload);
    },
    set_error_list(state, payload) {
      state.errorList = payload;
    },
    'reset'(state) {
      state.checkedIndex = -1;
      state.dataSet = [];
      state.errorList = [];
    }
  },
  actions: {
    'checked_index_change'({ commit, state }, payload: number) {
      if (state.checkedIndex > -1) {
        let data = $.clone(state.dataSet[state.checkedIndex]);
        data.operationType = 2;
        data.questionSources && data.questionSources.length && data.questionSources.map(i => {
          if (i.provinceCity && i.provinceCity.length) {
            i.provinceId = i.provinceCity[0];
            i.cityId = i.provinceCity[1] || null;
            i.areaId = i.provinceCity[2] || null;
          };
          return i;
        })
        axios.post<null, any>('/tiku/question/editQuestion', 
          data, 
          { headers: { 'Content-Type': 'application/json' } 
        }).then(res => {
          commit('set_data_set', $.clone(state.dataSet.map((d: any) => { d.id === res.json.id && (d.failReason = res.json.failReason); return d;}) ));
        });
      }
      commit('set_checked_index', payload);
    }
  }
});