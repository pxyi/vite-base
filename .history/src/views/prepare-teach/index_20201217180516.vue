<template>
    <template>
        <HeaderRefComponent/>
    </template>
    <div>
        <QueryClassComponent @query="$refs.list.request($event)" />
    </div>

</template>

<script lang='ts'>
import { ref, onMounted, Ref } from 'vue';

import HeaderRefComponent from './components/header-ref.vue';
import QueryClassComponent from './components/query-class.vue';

export default {
    components: { HeaderRefComponent, QueryClassComponent },
}
</script>