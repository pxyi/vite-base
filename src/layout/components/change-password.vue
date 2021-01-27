<template>
  <cus-form :nodes="nodes" ref="formRef"></cus-form>
</template>

<script lang="ts">
import { ref } from 'vue'
import axios from 'axios';
import { AxResponse } from '/@/core/axios';
import { ElMessage } from 'element-plus';
import md5 from 'js-md5';
export default {
  setup() {
    let formRef = ref();
    const validateChangePassword = (_, value, callback, formGroup) => {
      callback(value !== formGroup.password ? new Error('两次输入密码不一致!') : undefined)
    };
    let nodes = ref([
      { label: '旧密码', type: 'password', key: 'oldPassword', rule: { required: true, message: '请输入旧密码' } },
      { label: '新密码', type: 'password', key: 'password', rule: { required: true, message: '请输入新密码' } },
      { label: '确认密码', type: 'password', key: 'newPassword', rule: [{ required: true, message: '请输入新密码' },{ validator: validateChangePassword, trigger: 'change' }] }
    ]);
    const save = (resolve, reject) => {
      formRef.value.validate(valid => {
        valid ? axios.post<null, AxResponse>('/permission/auth/changePassword', {
          oldPassword: md5(valid.oldPassword),
          newPassword: md5(valid.newPassword)
        }).then(res => {
          res.result ? resolve() : reject();
          ElMessage[res.result ? 'success' : 'warning'](res.msg);
        }) : reject()
      })
    }
    return { nodes, save, formRef }
  }
}
</script>