<template>
    <template ref="headerRef">
        <HeaderRefComponent @type-change="params.type = $event" @search="params.title = $event" />
    </template>
    <div>
        <QueryClassComponent @query="$refs.list.request($event)" />
        <div class="cus-list">
            <div ref="list">
                <el-row :gutter="20">
                    <el-col :span="4" >
                        <div class="course-list">

                        </div>
                    </el-col>
                </el-row>
                <template>
                    <img src="/@/assets/prepare-teach/courseBg.png" style="width: 86px" alt="爱学标品">
                </template>
            </div> 
        </div>
    </div>
</template>

<script lang='ts'>
import { ref, onMounted, Ref } from 'vue';
import HeaderRefComponent from './components/header-ref.vue';
import QueryClassComponent from './components/query-class.vue';
import emitter from './../../utils/mitt';
import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus'
import { AxResponse } from './../../core/axios';
import createElement from './../../utils/createElement';
import Modal from './../../utils/modal';

export default {
    components: { HeaderRefComponent, QueryClassComponent },
    setup(){
        let headerRef = ref();
        onMounted(() => emitter.emit('slot', headerRef));

        let params: Ref<any> = ref({});
        emitter.emit('effect', (id) => params.value.subjectId = id)

        let courseList: Ref<any> = ref()

        return { headerRef, params }
    }
}
</script>

<style lang="scss" scoped>
    .cur-list{
        .course-list{
            height: 100px;
            border: 1px solid #000;
        }
    }
    
</style>