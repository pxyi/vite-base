<template>
    <template>
        <Header/>
    </template>
    <div>
        <QueryClassComponent  />
    </div>
</template>

<script lang='ts'>
import { ref, onMounted, Ref } from 'vue';
import Header from './components/header.vue'
import QueryClassComponent from './components/query-class.vue';

export default {
    components: { Header, QueryClassComponent },
}
</script>