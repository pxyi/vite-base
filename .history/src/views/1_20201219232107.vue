<template>
    <div>

    </div>
</template>

<script lang='ts'>
import {ref} from 'vue'

           function changeCount(){
                let count =  ref(0)
            function change(){
                count.value +1 
            }
            return {count,change}
           }
           
    
    export default changeCount;
    
</script>

<style lang="scss" scoped>

</style>