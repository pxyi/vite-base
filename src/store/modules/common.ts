import { SET_SUBJECT, SET_SUBJECT_LIST, REMOVE_SUBJECT_LIST } from '../types';
import $ from '/@/utils/$';

const state = {
  subjectList: null,
  subject: {
    name: null,
    code: null
  }
}
const mutations = {
  [ SET_SUBJECT ] (state, payload) {
    $.storage.set('subject', payload);
    state.subject = payload;
  },
  [ SET_SUBJECT_LIST ] (state, payload) {
    state.subjectList = payload;
  },
  [ REMOVE_SUBJECT_LIST ] (state) {
    state.subjectList = null
  }
}


export default {
  state,
  mutations
};
