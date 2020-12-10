<template>
  
</template>
<script lang="ts">
export default {
  setup(props) {
    
  } 
}
</script>
<style lang="scss" scoped>
.cus__query__container {
  &::after {
    content: '';
    clear: both;
    display: block;
  }
  .query__cell {
    margin-right: 20px;
    margin-bottom: 20px;
    position: relative;
    display: flex;
    float: left;
    &.is__buttons {
      float: right;
      &::before {
        display: none;
      }
    }
    &:last-child {
      margin-right: 0;
    }
    &::before {
      content: attr(data-before);
      display: block;
      padding: 0 15px;
      color: #909399;
      font-size: 14px;
      line-height: 38px;
      font-weight: 400;
      background: #F5F7FA;
      border-radius: 4px 0 0 4px;
      border: solid 1px #DCDFE6;
      border-right: 0;
      white-space: nowrap
    }
    .el-input input {
      border-radius: 0 4px 4px 0;
    }
  }

  .query__slot__buttons {
    float: right;
  }
}
</style>