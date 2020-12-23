<template>
  <div class="cus__skeleton__container">
    <div class="cus__skeleton__loading" :class="{ 'is__transition': transition }" v-if="loading">
      <div class="cus__skeleton__header" v-if="avatar"><div></div></div>
      <div class="cus__skeleton__content">
        <h3 />
        <ul>
          <li v-for="i in rows" :key="i" />
        </ul>
      </div>
    </div>
    <template v-else>
      <slot />
    </template>
  </div>
</template>
<script lang="ts">
export default {
  name: 'cus-skeleton',
  props: {
    loading: {
      type: Boolean,
      default: () => true
    },
    transition: {
      type: Boolean,
      default: () => true
    },
    avatar: {
      type: Boolean,
      default: () => false
    },
    rows: {
      type: Number,
      default: () => 3
    }
  }
}
</script>
<style lang="scss" scoped>
$--background-color: #f2f2f2;

@mixin transition {
  background: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%);
  background-size: 400% 100%;
  animation: ant-skeleton-loading 1.4s ease infinite;
}
@keyframes ant-skeleton-loading{0%{background-position:100% 50%}to{background-position:0 50%}}
.cus__skeleton__loading {
  display: flex;
  background: #fff;
  padding: 10px 20px 20px;
  .cus__skeleton__header {
    padding-right: 16px;
    vertical-align: top;
    div {
      width: 40px;
      height: 40px;
      background: $--background-color;
      border-radius: 50%;
    }
  }
  .cus__skeleton__content {
    flex: auto;
    h3 {
      width: 38%;
      height: 16px;
      margin-top: 12px;
      background: $--background-color;
    }
    ul {
      margin-top: 28px;
      li {
        height: 16px;
        margin-bottom: 12px;
        background: $--background-color;
        &:last-child {
          width: 61%;
          margin-bottom: 0;
        }
      }
    }
  }
  &.is__transition {
    .cus__skeleton__header > div,
    .cus__skeleton__content h3,
    .cus__skeleton__content ul li {
      @include transition;
    }
  }
}
</style>