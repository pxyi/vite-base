<template>
    <template ref="headerRef">
        <HeaderRefComponent @type-change="params.type = $event" @search="params.title = $event" />
    </template>
    <div>
        <QueryClassComponent @query="$refs.list.request($event)" />
    </div>
</template>

<script lang='ts'>
import { ref, onMounted, Ref } from 'vue';
import axios from 'axios';
import HeaderRefComponent from './components/query-class.vue'
import QueryClassComponent from './components/header-ref.vue';

export default {
    components: { QueryClassComponent , HeaderRefComponent },
}
</script>