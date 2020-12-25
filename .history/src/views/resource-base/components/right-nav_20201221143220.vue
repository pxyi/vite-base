<template>
  <div class="aaa">
    <span>文件名 <i class="el-icon-bottom"></i></span>
    <span>上传时间 <i class="el-icon-bottom"></i></span>
    <span>引用次数<i class="el-icon-bottom"></i></span>
  </div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss" scoped>
.aaa {
  background-color: #ebecf0;
  height: 46px;
  margin-top: 20px;
  display: flex;
  span {
    padding: 0 40px;
    line-height: 45px;
    i{
        display: none;
    }
    i:hover{
      cursor:pointer;
      display: block;
      color: skyblue;
    }
  }
}
</style>
