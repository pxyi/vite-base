<template>
    <div>
  <el-form :model="formGroup" :rules="rules" ref="formRef" label-width="80px" class="cus__modal__form__container">
    <input type="text" style="display:none" />
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
import { ElMessage, ElLoading ,ElInput} from "element-plus";
    export default {
        setup() {
         let  form = reactive({
          name: '',
        })
        console.log(form);
        
            return {form}
        }
    }
</script>

<style lang="scss" scoped>

</style>