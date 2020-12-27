<template>
  <div class="course-details" v-loading="dialogLoading">
    <ul>
        <li v-for="(item,index) in courseIndexList" :key="index">
            <div class="detaias">第{{ item.orderNo }}讲 {{ item.courseIndexName }}</div>
            <div class="menu">
                <el-button type="primary" round size="small" v-show="item.lessonStatus === 0" @click="courseDetailFileList(item, index)">去备课</el-button>
                <el-button type="warning" round size="small" v-show="item.lessonStatus === 1" @click="courseDetailFileList(item, index)">继续备课</el-button>
                <el-button type="primary" round size="small" v-show="item.lessonStatus === 2" @click="courseDetailFileList(item, index)">已备课</el-button>
            </div>
        </li>
    </ul>   
    <cus-empty v-if="!courseIndexList.length && !dialogLoading" />
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
        let dialogLoading = ref(false)

        const queryData = async() => {
          dialogLoading.value = true
          let res = await axios.post<any,AxResponse>('/courseIndex/query', { courseId: props.courseId}, { headers: { type: 1, 'Content-Type': 'application/json' }});
            if(res.result) {
              courseIndexList.value = res.json
           }
           dialogLoading.value = false
        }
        queryData()
        
        const courseDetailFileList = (item, index) => {
            Screen.create( CurriculumPapers, { title: item.courseIndexName, id: item.id }).then((data: any) => {
                if(data) {
                    queryData()
                }
            })
        }

        return { courseIndexList, dialogLoading, courseDetailFileList, queryData }
    }
}
</script>

<style lang="scss" scoped>
    :deep(.modal-body){
        padding: 0 20px 30px;
    }
    .course-details{
        ul{
            max-height: 500px;
            li{
                height: 60px;
                background: #FFFFFF;
                border-radius: 10px;
                display: flex;
                justify-content: space-between;
                margin: 10px 0px;
                border: 1px solid #DEE4F1;
                align-content: center;
                line-height: 60px;
                .detaias{
                text-indent: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #77808D;
                }
                .menu{
                    margin-right: 30px;
                }
                &:hover{
                    background: #F5F7FA;
                }
            }
        }
    }
</style>