/**
 * @module Axios 配置信息
 */

import axios, { AxiosRequestConfig } from 'axios';
import VueAxios from 'vue-axios';
import { ElMessage } from 'element-plus';
import { App } from 'vue';
import { useRouter } from 'vue-router';

/* ------------------------- 默认请求格式, 和全局请求地址 ------------------------- */
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL as string;
axios.interceptors.request.use((res: AxiosRequestConfig) => {

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
