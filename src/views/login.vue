<template>
  <div class="login__container" ref="backgroundRef">
    <div class="login-title" v-if="system"><img src="/src/assets/login/login-title.png" alt="爱学标品"></div>
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
                <img v-if="showPassword" src="/src/assets/login/login-password-show.png" />
                <img v-else src="/src/assets/login/login-password-hide.png" />
              </div>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-remember">
          <!-- <div class="login__label" @click="remember = !remember">
            <i class="el-icon-check" v-show="remember" />
            <span>记住密码</span>
          </div> -->
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
import { useRouter } from "vue-router";
import $ from '/@/utils/$';
import backgroundImage1 from '/@/assets/login/login-bg-1.jpg';
import backgroundImage2 from '/@/assets/login/login-bg-2.jpg';
import backgroundImage3 from '/@/assets/login/login-bg-3.jpg';

export default {
  setup() {
    const system = import.meta.env.VITE_IS_BIAOPIN;
    let remember = ref(false);
    let showPassword = ref(false);
    let formRef = ref();
    let store = useStore();
    let router = useRouter();
    let saveLoading = ref(false);
    let rememberAccount = $.storage.get<any>('account') || {};
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
      if (remember.value) { $.storage.set('account', formGroup) } else { $.storage.remove('account') }
      let res: AxResponse = await axios.post("/permission/auth/login", params);
      saveLoading.value = false;
      if (res && res.result) {
        store.commit(SET_USER_INFO, res.json);

        $.storage.set('token', res.json.accessToken);
        router.push("/home");
      } else {
        ElMessage.warning(res.msg);
      }
    };

    let loading = ElLoading.service();
    let backgroundRef: Ref<HTMLElement | null> = ref(null);
    let index = Math.floor(Math.random() * 3);
    let image = new Image();
    let url = [backgroundImage1, backgroundImage2, backgroundImage3][index]
    image.src = url;
    image.onload = () => {
      loading.close();
      backgroundRef.value!.style.background = `url(${ url }) center center / cover no-repeat`;
    }
    return { backgroundRef, showPassword, remember, formRef, formGroup, rules, login, saveLoading, system };
  },
};
</script>

<style lang="scss">
.login__container {
  height: 100%;
  position: relative;
  overflow: hidden;
  .login-title {
    width: 15%;
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
    border-radius: 10px;
    background: rgba(15, 15, 15, .6);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(200px, -200px, 0);
    h1 {
      color: #fff;
      font-size: 22px;
      line-height: 40px;
      text-align: center;
      margin-bottom: 30px;
    }
    .el-input__inner {
      border-radius: 6px;
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
    text-align: center;
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
        background: #1AAFA7;
      }
      i {
        color: #fff;
        position: absolute;
        top: 2px;
        left: 1px;
      }
      span {
        display: inline-block;
        margin-left: 6px;
        color: #fff;
        vertical-align: top;
      }
    }
    p {
      color: #fff;
    }
  }
}
</style>
