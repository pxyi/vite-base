<template>
    <template ref="headerRef">
        <HeaderRefComponent @type-change="params.type = $event" @search="params.title = $event" />
    </template>
    <div>
        <QueryClassComponent @query="$refs.list.request($event)" />
        <div class="cus-list">
             <cus-list ref="list" has-page url="/tiku/paper/queryPaperPage" :default="params" :auto-request="false">
                <template v-slot:avatar>
                <img src="/@/assets/test-paper/list-avatar.png" style="width: 86px" alt="爱学标品">
                </template>
                <template v-slot="{ data }">
                <div class="cus_content">
                    <h2>{{ data.title }}</h2>
                    <p>来源：<span class="cus_tag">{{ data.source }}</span></p>
                    <div>
                    <div><span>题目数：{{ data.questionCount || 0 }}</span><span>下载次数：{{ data.downloadCount || 0 }}</span></div>
                    <div><span>创建人：{{ data.creatorName }}</span><span>创建时间：{{ data.createTime }}</span></div>
                    </div>
                </div>
                </template>
                <template v-slot:actions="{ data }">
                <div class="list__actions">
                    <el-button type="text" @click="preview(data.filePath)"><i class="el-icon-magic-stick" /><span>预览</span></el-button>
                    <el-button type="text" v-if="data.sourceFrom !== 3"><i class="el-icon-edit-outline" /><span>编辑</span></el-button>
                    <el-button type="text" @click="download(data)"><i class="el-icon-printer" /><span>下载/打印</span></el-button>
                    <el-popconfirm title="这是一段内容确定删除吗？" confirmButtonText='确定' cancelButtonText='取消' @confirm="remove(data.id, $refs.list)">
                    <template #reference>
                        <el-button type="text"><i class="el-icon-delete" /><span>删除</span></el-button>
                    </template>
                    </el-popconfirm>
                </div>
                </template>
            </cus-list>
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