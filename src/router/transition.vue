<template>
	<transition name="fade-transform" mode="out-in">
		<router-view v-slot="{ Component }">
			  <component :is="Component" />
	  </router-view>
	</transition>
</template>
