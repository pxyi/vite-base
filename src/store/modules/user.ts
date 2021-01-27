import { SET_USER_INFO, REMOVE_USER_INFO } from '../types';
import $ from '/@/utils/$';
interface UserState {
  userInfo: any;
  accessToken: string;
}
let userInfo = $.storage.get('userinfo');
const state = {
  userInfo: userInfo,
  accessToken: ''
}
const mutations = {
  [ SET_USER_INFO ] (state: UserState, payload: any) {
    state.userInfo = payload;
    $.storage.set('userinfo', JSON.stringify(payload))
  },
  [ REMOVE_USER_INFO ] (state: UserState) {
    $.storage.remove('userinfo');
    $.storage.remove('token');
    $.storage.remove('subject')
  }
}


export default {
  state,
  mutations
};
