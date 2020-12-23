<template>
  <div class="course-details" v-loading="dialogLoading">
    <ul>
        <li v-for="(item,index) in courseIndexList" :key="index">
        <div class="detaias">第{{item.orderNo}}讲 {{item.courseIndexName}}</div>
        <div class="menu">
        <!-- <el-button type="primary" size="small" @click="operation(item)" >去备课</el-button> -->
        <el-button type="primary" size="small" v-show="item.lessonStatus===0" @click="courseDetailFileList(item,index)">去备课</el-button>
        <el-button type="primary" size="small" v-show="item.lessonStatus===1" @click="courseDetailFileList(item,index)">继续备课</el-button>
        <el-button type="primary" size="small" v-show="item.lessonStatus===2" @click="courseDetailFileList(item,index)">已备课</el-button>

        </div>
        </li>
    </ul>   
    <div v-if="courseIndexList.length == 0" style="text-align: center">暂无数据</div>
  </div>
  

</template>   

<script lang='ts'>
import { ref } from 'vue';
import axios from 'axios';
import { AxResponse } from './../../../core/axios';
import { ElLoading } from 'element-plus';
import Screen from './../../../utils/screen';
import CurriculumPapers from './curriculum-papers.vue';


export default {
    props: {
        courseId: String
    },
    setup(props, { emit }) {
        
        // 列表数据
        let courseIndexList = ref([])
        let dialogLoading = ref(true)
        axios.post<any,AxResponse>(
            '/courseIndex/query',
            { courseId: props.courseId},
            { headers: { type: 1, 'Content-Type': 'application/json' }}
        ).then(res => {
            if(res.result){
                courseIndexList.value = res.json
            }
            dialogLoading.value = false
        })
       
        const courseDetailFileList = (item,index) => {
            console.log(item,111)
            Screen.create( CurriculumPapers, { title: item.courseIndexName, id: item.id })
        }

        return { courseIndexList, dialogLoading, courseDetailFileList }
    }
}
</script>

<style lang="scss" scoped>
     .course-details{
        ul{
            max-height: 500px;
            li{
                height: 52px;
                background: #FFFFFF;
                border-radius: 4px;
                display: flex;
                justify-content: space-between;
                margin: 15px 20px;
                border: 1px solid #e8e8e8;
                align-content: center;
                line-height: 52px;
                .detaias{
                width: 50%;
                text-indent: 30px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                }
                .menu{
                    margin-right: 30px;
                }
            }
        }
    }
</style>