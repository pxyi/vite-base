/**
 * @module Axios 配置信息
 */

import axios, { AxiosRequestConfig } from 'axios';
import VueAxios from 'vue-axios';
import { ElMessage } from 'element-plus';
import { App } from 'vue';
import { useRouter } from 'vue-router';
import Store from './../store';

/* ------------------------- 默认请求格式, 和全局请求地址 ------------------------- */
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL as string;
axios.interceptors.request.use((res: AxiosRequestConfig) => {
  res.headers['accessToken'] = window.localStorage.getItem('token');
  res.headers['userId'] = Store.getters.userInfo ? Store.getters.userInfo.user.id : null;
  res.data = res.data ? stringify(res.data) : res.data;
  return res;
});

/* ----------------- 返回结果拦截, 如未登录直接跳转到登录页 ----------------- */
axios.interceptors.response.use(res => {
  if (res.data.code && res.data.code === 401) {
    useRouter().push('/login');
    ElMessage({ type: 'warning', message: res.data.message });
  }
  return res.data;
}, err => {
  ElMessage({ type: 'error', message: '服务器开小差了~！' });
  return err;
});

export default {
  install: (vue: App) => { vue.use(VueAxios, axios) }
}


const stringify = (obj) => {
  return Object.entries(obj).map(i => i.join('=')).join('&')
}

export interface AxResponse {
  result: boolean;
  msg: string;
  json?: any;
  record?: any;
}