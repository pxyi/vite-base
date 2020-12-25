<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="资料名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ref, reactive, Ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { AxResponse } from "../../../core/axios";
import emitter from "../../../utils/mitt";
import Modal from "../../../utils/modal";
import { ElMessage, ElLoading } from "element-plus";
export default {
  props: {
    contentList: {
      type: Object,
      default: () => [],
    },
  },
  setup(props) {
    let form = reactive({
      name: "DOC文档",
    });
    // console.log(props.contentList.value);

    return { form };
  },
};
</script>

<style lang="scss" scoped></style>
