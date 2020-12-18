<template>
    <div>
        <QueryClassComponent  />
    </div>
</template>

<script lang='ts'>
import { ref, onMounted, Ref } from 'vue';
import QueryClassComponent from './components/query-class.vue';

export default {
    components: { QueryClassComponent },
}
</script>