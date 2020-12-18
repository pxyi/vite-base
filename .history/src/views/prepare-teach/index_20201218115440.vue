<template>
    <template ref="headerRef">
        <HeaderRefComponent @type-change="params.type = $event" @search="params.title = $event" />
    </template>
    <div>
        <QueryClassComponent @query="$refs.list.request($event)" />
        <div class="cus-list">
             <!-- <cus-list ref="list" has-page url="/tiku/paper/queryPaperPage" :default="params" :auto-request="false">
                <template v-slot="{ }">
                
                </template>
                <template v-slot:avatar>
                <img src="/@/assets/prepare-teach/courseBg.png" style="width: 86px" alt="爱学标品">
                </template>
            </cus-list> -->
             <el-row>
                <el-col :span="24">
                    <ul>
                      <li class="list" v-for="(item,index) in courseList" :key="index" @click.stop.prevent="Godetails(item)" >
                        <div class="courseInfo">

                          <div class="courseInfoBox">
                            <div class="courseTitle">
                              {{item.courseName}}
                            </div>
                            <div class="courseTrip">
                              {{item.gradeName||'--'}}/{{item.courseTypeName||'--'}}/{{item.semesterName||'--'}}
                            </div>

                          </div>
                          <template v-slot:avatar>
                            <img src="/@/assets/prepare-teach/courseBg.png" style="width: 86px" alt="爱学标品">
                        </template>

                        </div>
                        <div class="btnBox">
                          <span>课程详情</span>
                          <!-- <img src="../../../assets/arrow-down.png" alt=""> -->
                          <img src="../../../assets/enter.png" width="16" height="16" alt="">
                        </div>
                        <!-- <div class="rightbox">
                          <span>{{item.gradeName}}</span>
                        </div>
                        <div class="slicebox"></div>
                        <span>{{item.courseName}}</span>
                        <img src="../../../assets/prelesson_bkicon.png" style="margin-top: -52px;margin-left: 202px;z-index: -1;" alt=""> -->
                      </li>
                  </ul>
                  <p v-if="!courseList.length" style="text-align:center;">暂无数据...</p>
                </el-col>
            </el-row>
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

<style lang="sass" scoped>
    
</style>