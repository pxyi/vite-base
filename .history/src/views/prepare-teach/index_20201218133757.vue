<template>
    <template ref="headerRef">
        <HeaderRefComponent @type-change="params.type = $event" @search="params.title = $event" />
    </template>
    <div>
        <QueryClassComponent @query="$refs.list.request($event)" />
        <div class="cus-list">
            <div ref="list">
                <el-row :gutter="20">
                    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
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
     .el-row {
        margin-bottom: 20px;
        &:last-child {
        margin-bottom: 0;
        }
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>