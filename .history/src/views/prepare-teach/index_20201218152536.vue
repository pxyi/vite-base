<template>
    <template ref="headerRef">
        <HeaderRefComponent @type-change="params.type = $event" @search="params.title = $event" />
    </template>
    <div>
        <QueryClassComponent @query="$refs.list.request($event)" />
        <div class="cus-list">
            <el-row :gutter="20">
                <div v-for="(item,index) in courseList" :key="index">
                <el-col :span="5"  class="course-list">
                <div>
                    <p class="courseTitle">{{item.courseName}}</p>
                    <p></p>
                </div>
                </el-col>
                </div>
            </el-row>
            <template>
                <img src="/@/assets/prepare-teach/courseBg.png" style="width: 86px" alt="爱学标品">
            </template>
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

        let courseList: Ref<any> = ref([
            {
               courseName: 1231,
               gradeName: 222,
               courseTypeName:333,
               semesterName:2323, 
            },{},{},{},{},{}
        ])

        return { headerRef, params, courseList }
    }
}
</script>

<style lang="scss" scoped>
    .cus-list{
        background: #fff;
        border: 1px solid rgb(235,240,252);
        box-shadow: raba(91, 125, 255, 0.08) 0 1px 6px 0;
        border-radius: 6px;
        padding: 30px 20px;

        .course-list{
            cursor: pointer;
            padding: 20px 10px 0 10px;
            height: 200px;
            border: 1px solid #dee4f1;
            border-radius: 10px;
            margin-top: 30px;
            .courseTitle{
                font-size: 16px;
                margin-top: 2px;
                margin-bottom: 10px;
                font-weight: 400;
                color: #1A2633;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
            }
        }
        .course-list:hover{
            box-shadow: 0px 2px 11px 0px rgba(23, 18, 45, 0.2);
        }
    }
    
</style>