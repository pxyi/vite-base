<template>
    <template ref="headerRef">
        <HeaderRefComponent />
    </template>
    <div>
        12345
    </div>
    <!-- <div>
        <QueryClassComponent @query="$refs.list.request($event)" />
    </div> -->
</template>

<script lang='ts'>
import { ref, onMounted, Ref } from 'vue';
import axios from 'axios';
import emitter from './../../utils/mitt';
import HeaderRefComponent from './components/query-class.vue'
import QueryClassComponent from './components/header-ref.vue';

export default {
    components: { QueryClassComponent , HeaderRefComponent },
    setup(){
        // let headerRef = ref();
        // onMounted(() => emitter.emit('slot', headerRef));


        // return { headerRef }  
    }
}
</script>