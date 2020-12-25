<template>
    <div class="tan">
        <nav>
               <a
                  v-for="(item, index) in fileTypeAndCount"
                  :style="{ 'z-index': item.id === activeId ? 9 : 1 }"
                  :class="{ active: item.id == activeId }"
                  :key="index"
                  @click.prevent="selectActive(item)"
                >
                  {{ item.name }}
                  <span class="num">
                    {{ item.count }}
                  </span>
                </a>
        </nav>

    </div>
</template>

<script lang='ts'>
    export default {
        
    }
</script>

<style lang="scss" scoped>

</style>