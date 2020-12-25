<template>
<template ref="headerRef">
    <HeaderRefComponent @type-change="params.type = $event" @search="params.title = $event" />
  </template>


</template>

<script lang="ts">
import { ref, onMounted, Ref } from "vue";
import axios from "axios";
import LeftTree from "../tree.vue";
import { AxResponse } from "~/@/core/axios";
import HeaderRefComponent from '../../views/test-paper/components/header-ref.vue';

export default {
  components: { LeftTree ,HeaderRefComponent},
 
};
</script>

<style lang="scss" scoped>
.content {
  .left_box {
    width: 250px;
    height: 860px;
    background-color: #fff;
    .left_search {
      width: 226px;
      height: 40px;
      background: rgba(255, 255, 255, 1);
      border-radius: 3px;
      border: 1px solid rgba(235, 240, 252, 1);

      img {
        display: inline-block;
        margin: 10px 6px 10px 12px;
        float: left;
      }
      input {
        float: left;
        width: 86%;
        border: 0;
        height: 100%;
        border-radius: 3px;
        background: transparent;
        outline: none;
        color: #c8cbd0;
      }
      input::placeholder {
        color: rgba(119, 128, 141, 1);
      }
    }
  }
}
</style>
