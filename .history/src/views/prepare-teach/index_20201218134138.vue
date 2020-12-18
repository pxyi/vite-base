<template>
    <template ref="headerRef">
        <HeaderRefComponent @type-change="params.type = $event" @search="params.title = $event" />
    </template>
    <div>
        <QueryClassComponent @query="$refs.list.request($event)" />
        <div class="cus-list">
            <div ref="list">
                <template v-slot="{ data }">
                <el-row :gutter="20">
                    <el-col :span="4">
                         <div class="courseInfo">
                          <div class="courseInfoBox">
                            <div class="courseTitle">
                              {{data.courseName}}
                            </div>
                            <div class="courseTrip">
                              {{data.gradeName||'--'}}/{{data.courseTypeName||'--'}}/{{data.semesterName||'--'}}
                            </div>

                          </div>
                    </el-col>
                    <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
                    <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
                    <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
                </el-row>
                <template>
                    <img src="/@/assets/prepare-teach/courseBg.png" style="width: 86px" alt="爱学标品">
                </template>
            </div>
             <!-- < cus-list ref="list" has-page url="/tiku/paper/queryPaperPage" :default="params" :auto-request="false">
                <template v-slot="{ }">
                
                </template>
                
            </cus-list> -->
            
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


        return { headerRef, params }
    }
}
</script>

<style lang="scss" scoped>
      .courseInfo{
        width: 100%;
        height: 85px;
        border-bottom: 1px solid #DEE4F1;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .courseInfoBox{
        width: 178px;
        height: 100%;
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
        .courseTrip{
            font-size: 12px;
            font-weight: 400;
            color: #77808D;
        }
        }
        .courseImg{
        width: 60px;
        height: 60px;
        }
    }
</style>