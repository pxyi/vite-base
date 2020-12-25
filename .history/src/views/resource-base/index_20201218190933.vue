<template>
    <div>
<tree />
    </div>
</template>

<script lang="ts">
import { ref, onMounted, Ref } from 'vue';
import axios from 'axios';
import Tree from '../tree.vue'
    export default {
         components: { Tree }
    }
</script>

<style lang="scss" scoped>

</style>