<template>
  <div class="login__container">
    <div class="login__logo">
      <img src="/src/assets/login-logo.png" alt="爱学教研系统" />
    </div>
    <div class="login__cover">
      <img src="/src/assets/login-cover.png" alt="爱学教研系统" />
    </div>
    <div class="login__content">
      <h1>登录</h1>
      <p>自主、可配、安全、高效</p>
      <el-form :model="formGroup" :rules="rules" ref="formRef" class="login__form">
        <el-form-item prop="mobile">
          <el-input placeholder="请输入用户名" prefix-icon="el-icon-mobile-phone" v-model="formGroup.mobile" />
        </el-form-item>
        <el-form-item prop="md5Password">
          <el-input placeholder="请输入密码" :type="showPassword ? 'test' : 'password'" prefix-icon="el-icon-lock" v-model="formGroup.md5Password">
            <template #suffix>
              <div @click="showPassword = !showPassword">
                <img src="/src/assets/login-password-hide.png" class="password__icon" v-if="!showPassword" />
                <img src="/src/assets/login-password-show.png" class="password__icon" v-if="showPassword" />
              </div>
            </template>
          </el-input>
        </el-form-item>
        <div class="login__remember">
          <div class="login__label" @click="remember = !remember">
            <i class="el-icon-check" v-show="remember" />
            <span>记住密码</span>
          </div>
        </div>
        <div class="login__submit" :class="{ is__disabled: loading }" @click="login">登录</div>
      </el-form>
      <div class="login__desc">
        <span>忘记密码请联系管理员哟！</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive } from "vue";
import axios from "axios";
import md5 from "js-md5";
import { ElMessage } from "element-plus";
import { AxResponse } from "./../core/axios";
import { useStore } from "vuex";
import { SET_USER_INFO } from "../store/types";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    let remember = ref(true);
    let showPassword = ref(false);
    let formRef = ref();
    let store = useStore();
    let router = useRouter();
    let loading = ref(false);
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
      loading.value = true;
      if (remember.value) { window.localStorage.setItem('account', JSON.stringify(formGroup)) } else { window.localStorage.removeItem('account') }
      let res: AxResponse = await axios.post("/permission/auth/login", params);
      loading.value = false;
      if (res && res.result) {
        store.commit(SET_USER_INFO, res.json);
        localStorage.setItem("token", res.json.accessToken);
        router.push("/index");
      } else {
        ElMessage.warning(res.msg);
      }
    };
    return { showPassword, remember, formRef, formGroup, rules, login, loading };
  },
};
</script>

<style lang="scss">
.login__container {
  height: 100%;
  background: url("/src/assets/login-background.png") no-repeat center center;
  background-size: cover;
  position: relative;
  overflow: hidden;
}

.login__logo {
  width: 260px;
  position: absolute;
  top: 100px;
  left: 260px;
}
.login__cover {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-800px, -45%, 0);
}
.login__content {
  width: 510px;
  height: 600px;
  padding: 60px 90px 0;
  background: #fff;
  box-shadow: 0px 16px 40px 0px rgba(0, 126, 193, 0.5);
  border-radius: 12px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(165px, -50%, 0);
  box-sizing: border-box;
  h1 {
    color: #007ec1;
    font-size: 40px;
    line-height: 55px;
    font-weight: 400;
    margin-bottom: 12px;
  }
  p {
    color: #91a5c2;
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 60px;
  }
}
.login__form {
  .el-form-item {
    margin-bottom: 30px;
  }
  .el-input__prefix {
    font-size: 22px;
    line-height: 50px;
    left: 12px;
  }
  .el-input__inner {
    font-size: 16px;
    height: 50px;
    line-height: 50px;
    padding-left: 50px;
  }
  .el-input__suffix {
    right: 10px;
  }
}
.password__icon {
  width: 30px;
  margin-top: 10px;
  cursor: pointer;
}
.login__remember {
  height: 30px;
  color: #91a5c2;
  font-size: 16px;
  line-height: 30px;
  text-align: right;
  margin-top: -10px;
  margin-bottom: 40px;
  .login__label {
    display: inline-block;
    position: relative;
    line-height: 30px;
    cursor: pointer;
    &::before {
      content: "";
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-top: 5px;
      border-radius: 4px;
      background: #e9edf3;
    }
    i {
      position: absolute;
      top: 8px;
      left: 3px;
    }
    span {
      margin-left: 10px;
      vertical-align: top;
    }
  }
}
.login__submit {
  color: #fff;
  font-size: 26px;
  line-height: 50px;
  font-weight: 400;
  text-align: center;
  background: linear-gradient(270deg, #007ec1 0%, #09cabf 100%);
  border-radius: 8px;
  cursor: pointer;
  &:active {
    opacity: 0.9;
  }
  &.is__disabled {
    pointer-events: none;
    opacity: 0.6;
  }
}
.login__desc {
  padding-top: 54px;
  color: #91a5c2;
  font-size: 18px;
  text-align: center;
  font-weight: 400;
  position: relative;
  &::before {
    content: "";
    display: block;
    width: 100%;
    border-bottom: dashed 1px #91a5c2;
    position: absolute;
    top: 30px;
    left: 0;
  }
  &::after {
    content: "or";
    display: block;
    width: 48px;
    height: 20px;
    color: #91a5c2;
    font-size: 20px;
    line-height: 1;
    background: #fff;
    position: absolute;
    top: 20px;
    left: 50%;
    margin-left: -24px;
  }
}
</style>