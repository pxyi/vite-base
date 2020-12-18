<template>
    <div>
        <QueryClassComponent @query="$refs.list.request($event)" />
    </div>
</template>

<script lang='ts'>
import QueryClassComponent from './components/query-class.vue';

export default {
    
}
</script>