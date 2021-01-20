<template>
  <div class="login__container" ref="backgroundRef">
    <div class="login-title"><img src="/@/assets/login/login-title.png" alt="爱学标品"></div>
    <div class="login-content">
      <h1>欢迎登录</h1>
      <el-form :model="formGroup" :rules="rules" ref="formRef">
        <el-form-item prop="mobile">
          <el-input placeholder="请输入用户名" prefix-icon="el-icon-user" v-model="formGroup.mobile" />
        </el-form-item>
        <el-form-item prop="md5Password">
          <el-input placeholder="请输入密码" :type="showPassword ? 'test' : 'password'" prefix-icon="el-icon-lock" v-model="formGroup.md5Password">
            <template #suffix>
              <div @click="showPassword = !showPassword" class="show-password-icon">
                <img :src="`/@/assets/login/login-password-${showPassword ? 'show' : 'hide'}.png`" class="password__icon" />
              </div>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-remember">
          <div class="login__label" @click="remember = !remember">
            <i class="el-icon-check" v-show="remember" />
            <span>记住密码</span>
          </div>
          <p>忘记密码请联系管理员</p>
        </div>
        <el-button type="primary" loading:="saveLoading" @click="login">登 录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, Ref, reactive } from "vue";
import axios from "axios";
import md5 from "js-md5";
import { ElMessage, ElLoading } from "element-plus";
import { AxResponse } from "/@/core/axios";
import { useStore } from "vuex";
import { SET_USER_INFO } from "/@/store/types";
import { useRoute, useRouter } from "vue-router";
const backgroundList = Array.from(new Array(3), (v, i) => import(`/@/assets/login/login-bg-${ i + 1 }.jpg`));

export default {
  setup() {
    let remember = ref(true);
    let showPassword = ref(false);
    let formRef = ref();
    let store = useStore();
    let router = useRouter();
    let saveLoading = ref(false);
    let rememberAccount = window.localStorage.getItem('account') ? JSON.parse(window.localStorage.getItem('account')!) : {};
    let formGroup = reactive({
      mobile: rememberAccount.mobile,
      md5Password: rememberAccount.md5Password,
    });
    let rules = {
      mobile: [{ required: true, message: "请输入用户名" }],
      md5Password: [{ required: true, message: "请输入密码" }],
    };
    const login = async () => {
      await formRef.value.validate();
      let params = {
        mobile: formGroup.mobile,
        md5Password: md5(formGroup.md5Password),
      };
      saveLoading.value = true;
      if (remember.value) { window.localStorage.setItem('account', JSON.stringify(formGroup)) } else { window.localStorage.removeItem('account') }
      let res: AxResponse = await axios.post("/permission/auth/login", params);
      saveLoading.value = false;
      if (res && res.result) {
        store.commit(SET_USER_INFO, res.json);
        localStorage.setItem("token", res.json.accessToken);
        router.push("/home");
      } else {
        ElMessage.warning(res.msg);
      }
    };

    let loading = ElLoading.service();
    let backgroundRef: Ref<HTMLElement | null> = ref(null);
    let index = Math.floor(Math.random() * 3);
    backgroundList[index].then(url => {
      let image = new Image();
      image.src = url.default;
      image.onload = () => {
        loading.close();
        backgroundRef.value!.style.background = `url(${ url.default }) center center / cover no-repeat`;
      }
    })
    return { backgroundRef, showPassword, remember, formRef, formGroup, rules, login, saveLoading };
  },
};
</script>

<style lang="scss">
.login__container {
  height: 100%;
  position: relative;
  overflow: hidden;
  .login-title {
    width: 356px;
    position: absolute;
    top: 50px;
    left: 160px;
    img {
      width: 100%
    }
  }
  .login-content {
    width: 360px;
    padding: 40px 36px 60px;
    border-radius: 20px;
    background: rgba(255, 255, 255, .7);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(200px, -300px, 0);
    h1 {
      font-size: 22px;
      line-height: 40px;
      text-align: center;
      margin-bottom: 30px;
    }
    .el-input__inner {
      border-radius: 8px;
    }
    .el-input__prefix {
      font-size: 16px;
    }
    .show-password-icon {
      cursor: pointer;
    }
    .el-button {
      width: 100%;
      font-size: 16px;
      border-radius: 8px;
    }
  }

  .login-remember {
    height: 16px;
    color: #91a5c2;
    font-size: 14px;
    line-height: 16px;
    margin-bottom: 30px;
    .login__label {
      display: inline-block;
      position: relative;
      cursor: pointer;
      &::before {
        content: "";
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 4px;
        background: #e9edf3;
      }
      i {
        position: absolute;
        top: 2px;
        left: 1px;
      }
      span {
        display: inline-block;
        margin-left: 6px;
        vertical-align: top;
      }
    }
    p {
      float: right;
      color: #3ABAB3;
    }
  }
}
</style>
