<template>
  <div>
    111231234
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'

export default ({
  prprs: {
    content: String
  },
  setup(props, { emit }) {
    console.log(props.content)
  }
})
</script>

<style lang="scss" scoped>

</style>