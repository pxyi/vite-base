import axios from 'axios'
// import qs from 'qs'
import store from '../store/index';
import { ElMessage } from "element-plus";
// import { Message,MessageBox } from 'element-ui'
// import { getUser,removeToken, removeUser, removeCookieRoles, removeUserInfo } from '../utils/cookies'
const service = axios.create({
  baseURL:process.env.VUE_APP_BASE_API
})

service.interceptors.request.use(
  (config:any) => {
    if (store.getters.userInfo.accessToken) {
        let userInfo:any = store.getters.userInfo;
        config.headers['accessToken'] =userInfo.accessToken || '';
        config.headers['userId'] =userInfo.user.id //|| JSON.parse(userInfo).id
    }
    if (config.headers['Content-Type'] == 'multipart/form-data') {
      return config;
    }
    // config.data = config.headers.type === "1"?config.data:qs.stringify(config.data)
    return config

  },
  (error: any) => {
    Promise.reject(error)
  }
)
service.interceptors.response.use(
    (response:any) => {
        const res = response.data
        if(response.status !== 200){
          console.log('请求错误操作');
          // return response
            // 请求错误操作
        }else{
            return response.data
        }
    },
    (error: any) => {

      let {status} = error.response;
      console.log(status,`${status === 403 ? '你已被登出' : '' }`);
      if(status === 403){
        // MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        //   confirmButtonText: '重新登录',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   removeToken();
        //   removeCookieRoles();
        //   removeUser();
        //   removeUserInfo();
        //   location.reload();
        // })
      }else{
        ElMessage({
          type:'error',
          message:'服务器未知错误，请联系管理员'
        })
      }
        return Promise.reject(error)
    }
)
export default service
