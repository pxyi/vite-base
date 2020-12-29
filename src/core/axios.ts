/**
 * @module Axios 配置信息
 */

import axios, { AxiosRequestConfig } from 'axios';
import VueAxios from 'vue-axios';
import { ElMessage, ElLoading } from 'element-plus';
import { App } from 'vue';
import Store from './../store';

/* ------------------------- 默认请求格式, 和全局请求地址 ------------------------- */
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL as string;
// axios.defaults.baseURL = 'http://192.168.4.14:8080' as string;
axios.interceptors.request.use((res: AxiosRequestConfig) => {
  res.headers['accessToken'] = window.localStorage.getItem('token');
  res.headers['userId'] = Store.getters.userInfo ? Store.getters.userInfo.user.id : null;

  /* 设置 request token 该请求可被取消 */
  if (res.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    res.data = res.data ? stringify(res.data) : res.data;
    // res.cancelToken = new axios.CancelToken(cancel => requestAbort(res.url, res.data, res.params, cancel));
  }
  return res;
});

/* ----------------- 返回结果拦截, 如未登录直接跳转到登录页 ----------------- */
axios.interceptors.response.use(res => {
  /* 1s 内禁止重复请求 */
  // setTimeout(() => { delete requestMap[res.config.url as string]; }, 1000);
  return res.data;
}, err => {
  ElLoading.service().close();
  try {
    if (axios.isCancel(err)) {
      let [url, reason] = err.message.split('##');
      console.error(`${url}`, reason === 'Duplicate' ? '因请求重复被取消' : '被新请求覆盖');
    } else if (err.response.status === 403) {
      location.hash = 'login';
      ElMessage({ type: 'warning', message: '登录失效，请重新登录' });
    } else {
      requestMap = {};
      ElMessage({ type: 'error', message: '服务器开小差了，请稍后再试~！' });
    }
  } catch (error) {
    ElMessage({ type: 'error', message: '系统错误，请稍后再试或联系管理员~！' });
  }
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

let requestMap = {};
const requestAbort = function (url, data, params, cancel) {
  /* 请求地址存在 */
  if (requestMap[url]) {
    /* 参数一致则取消本次请求,否则取消上次请求 */
    if (requestMap[url].data === data && JSON.stringify(requestMap[url].params) === JSON.stringify(params)) {
      cancel(`${url}##Duplicate`)
    } else {
      requestMap[url].cancel(`${url}##Covered`);
      delete requestMap[url];
    }
  } else {
    requestMap[url] = { data, params, cancel };
  }
}
