<template>
    <div>
<el-form ref="form"  label-width="80px">
  <el-form-item label="活动名称">
    <el-input ></el-input>
  </el-form-item>
  </el-form>
    </div>
</template>

<script lang='ts'>
import { ref, reactive, Ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { AxResponse } from "../../../core/axios";
import emitter from "../../../utils/mitt";
import Modal from '../../../utils/modal'
import newName from './new-name.vue'
import { ElMessage, ElLoading ,ElDialog } from "element-plus";
    export default {
        setup() {
            let from = {
                name:'张三'
            }
            return {from}
        }
    }
</script>

<style lang="scss" scoped>

</style>