<template>
  <div class="container">
    <div class="box">
      <div class="picture"><img src="/@/assets/404.png" alt="404"></div>
      <div class="text">
        <h2>迷路了！</h2>
        <h4>您无法进入此页面...</h4>
        <p>请检查您输入的URL是否正确，{{ num }} 秒后自动跳转或单击下方按钮返回主页。</p>
        <el-button type="primary" round @click="goBack">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'
export default {
  setup() {
    let router = useRouter();
    let num = ref(5);
    const setInter = (() => {
      num.value > 0 ? setTimeout(() => { num.value--; setInter(); }, 1000) : router.push('/');
    })
    setInter();
    return { goBack: () => router.push('/'), num}
  }
}
</script>
<style scoped lang="scss">
  .container {
    height: 100%;
    position: relative;
  }
  .box {
    width: 1000px;
    padding: 0 50px;
    transform: translate(-50%,-50%);
    position: absolute;
    top: 40%;
    left: 50%;
    overflow: hidden;
  }
  .picture {
    width: 600px;
    float: left;
  }
  .picture img {
    display: block;
    width: 100%;
  }
  .text {
    width: 300px;
    float: left;
    padding: 30px 0;
    h2 {
      font-size: 32px;
      line-height: 40px;
      color:#19aea6;
      margin-bottom: 42px;
    }
    h4 {
      font-size: 20px;
      line-height: 24px;
      color: #222;
      margin-bottom: 10px;
    }
    p {
      margin-top: 0;
      line-height: 21px;
      color: grey;
      margin-bottom: 30px;
    }
  }
</style>