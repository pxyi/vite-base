import Vuex from 'vuex';
import { SET_USER_INFO, REMOVE_USER_INFO } from '../types';
interface UserState {
  userInfo: any;
  accessToken: string;
}
let userInfo = window.localStorage.getItem('userinfo');
const state = {
  userInfo: userInfo ? JSON.parse(userInfo) : null,
  accessToken: ''
}
const mutations = {
  [ SET_USER_INFO ] (state: UserState, payload: any) {
    state.userInfo = payload;
    window.localStorage.setItem('userinfo', JSON.stringify(payload))
  },
  [ REMOVE_USER_INFO ] (state: UserState) {
    window.localStorage.removeItem('userinfo');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('subject')
  }
}


export default {
  state,
  mutations
};
