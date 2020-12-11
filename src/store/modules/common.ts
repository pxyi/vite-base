import Vuex from 'vuex';
import { SET_SUBJECT, SET_SUBJECT_LIST } from '../types';

const state = {
  subjectList: null,
  subject: null
}
const mutations = {
  [ SET_SUBJECT ] (state, payload) {
    state.subject = payload;
  },
  [ SET_SUBJECT_LIST ] (state, payload) {
    state.subjectList = payload;
  }
}


export default {
  state,
  mutations
};