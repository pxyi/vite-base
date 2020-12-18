<template>
    <template ref="headerRef">
        <HeaderRefComponent @type-change="params.type = $event" @search="params.title = $event" />
    </template>
    <div>
        <QueryClassComponent @query="$refs.list.request($event)" />
        <div class="cus-list">
            <div class="course-list">

            </div>
            <div class="course-list">

            </div>
            <div class="course-list">

            </div>
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

        let courseList: Ref<any> = ref()

        return { headerRef, params }
    }
}
</script>

<style lang="scss" scoped>
    .cus-list{
        background: #fff;
        border: 1px solid rgb(235,240,252);
        box-shadow: raba(91, 125, 255, 0.08) 0 1px 6px 0;
        border-radius: 6px;
        padding: 18px 20px;
        .course-list{
            height: 200px;
            width: 300px;
            display: flex;
            justify-content: space-around;
            border: 1px solid #000;
            flex-wrap:wrap
            .box-card{
                border-radius: 10px;
            }
        }
    }
    
</style>