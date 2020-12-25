<template>
    <div>
123
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
            
        }
    }
</script>

<style lang="scss" scoped>

</style>