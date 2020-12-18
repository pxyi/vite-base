<template>
    <template ref="headerRef">
        <HeaderRefComponent @type-change="params.type = $event" @search="params.title = $event" />
    </template>
    <div>
        <QueryClassComponent @query="$refs.list.request($event)" />
        <div class="cus-list" ref="list">
            <el-row :gutter="20">
                <el-col :span="4" v-for="(item,index) in courseList" :key="index">
                    <div class="course-list">
                        <div class="course-info">
                            <div class="course-info-top">
                                <p class="course-title">{{item.courseName}}</p>
                                <p class="course-trip"> {{item.gradeName||'--'}}/{{item.courseTypeName||'--'}}/{{item.semesterName||'--'}}</p>
                            </div>
                            <div class="course-img">
                                <img src="/@/assets/prepare-teach/courseBg.png" style="width: 60px" alt="爱学标品">
                            </div>
                        </div>
                         <div class="btn-box">
                          <span>课程详情</span>
                          <img src="../../../assets/enter.png" width="16" height="16" alt="">
                        </div>
                    </div>
                </el-col>
            </el-row>
            
        </div> 
        <template>
           <Tree/>
        </template>

    </div>
</template>

<script lang='ts'>
import { ref, onMounted, Ref } from 'vue';
import HeaderRefComponent from './components/header-ref.vue';
import Tree from '../../components/tree/index.vue';
import QueryClassComponent from './components/query-class.vue';
import emitter from './../../utils/mitt';
import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus'
import { AxResponse } from './../../core/axios';
import createElement from './../../utils/createElement';
import Modal from './../../utils/modal';

export default {
    components: { Tree,HeaderRefComponent, QueryClassComponent },
    setup(){
        let headerRef = ref();
        onMounted(() => emitter.emit('slot', headerRef));

        let params: Ref<any> = ref({});
        emitter.emit('effect', (id) => params.value.subjectId = id)

        let courseList: Ref<any> = ref([
            {
                courseName: '学习学习学习学习学习学习学习学习学习学习学习',
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
            border-radius: 10px;
            border: 1px solid #DEE4F1;
            padding: 20px;
            margin-top: 30px;
            height: 150px;
            cursor: pointer;
            &:nth-child(-n+6){
                margin-top: 0;
            }
            .course-info{
                height: 90px;
                width: 100%;
                border-bottom: 1px solid #DEE4F1;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .course-title{
                  font-size: 16px;
                  margin-top: 2px;
                  margin-bottom: 10px;
                  font-weight: 400;
                  color: #1A2633;
                  text-overflow: -o-ellipsis-lastline;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  line-clamp: 2;
                }
                .course-trip{
                  font-size: 12px;
                  font-weight: 400;
                  color: #77808D;
                }
            }
            .btn-box{
              width: 100%;
              height: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              span{
                font-size: 14px;
                font-weight: 400;
                color: #1AAFA7;
                margin-right: 10px;
              }
              span,img{
                cursor: pointer;
              }
        }
        .course-list:hover{
            box-shadow: 0px 2px 11px 0px rgba(23, 18, 45, 0.2);
        }
    }
    
</style>