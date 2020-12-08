/**
 * @module Axios 配置信息
 */

import axios, { AxiosRequestConfig } from 'axios';
import VueAxios from 'vue-axios';
// import Qs from 'qs';
import { ElMessage } from 'element-plus';
import { App } from 'vue';
// import router from '@/router';

/* ------------------------- 默认请求格式, 和全局请求地址 ------------------------- */
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

axios.interceptors.request.use((res: AxiosRequestConfig) => {
  /* ------------ 序列化参数 ------------- */
  res.headers.accessToken = 'd7fe8a482f06103ae8907427cd6651f1';
  res.headers.userId = '2';
  res.headers.system = 2019;
  res.headers.os = 2019;
  res.data = res.data || {};
  res.withCredentials = true;
  if (res.headers['Content-Type'] === 'application/json') {
    return res;
  }
  // res.data = Qs.stringify(res.data);
  return res;
});

/* ----------------- 返回结果拦截, 如未登录直接跳转到登录页 ----------------- */
axios.interceptors.response.use(res => {
  if (res.data.code && res.data.code === 401) {
    // router.push('/login');
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
