<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <div class="container">
        <component :is="Component" />
      </div>
    </transition>
  </router-view>
</template>