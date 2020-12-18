<template>
    <template ref="headerRef">
        <HeaderRefComponent @type-change="params.type = $event" @search="params.title = $event" />
    </template>
    <div>
        <QueryClassComponent @query="$refs.list.request($event)" />
        <div class="cus-list">
             <cus-list ref="list" has-page url="/tiku/paper/queryPaperPage" :default="params" :auto-request="false">
                <template v-slot="{ data }">
                
                </template>
                <template v-slot:avatar>
                <img src="/@/assets/test-paper/list-avatar.png" style="width: 86px" alt="爱学标品">
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

<style lang="sass" scoped>
    
</style>