
<script setup>
import {onMounted, ref} from "vue";
import PageLoader from "./components/PageLoader.vue";
import AppNotification from "./components/AppNotification.vue";

import { notificationStore } from './store/notification.js'
import AppNavbar from "./components/AppNavbar.vue";


const isLoading = ref(false);

onMounted(() => {
  // notificationStore.push('test 1')
  // notificationStore.push('test 2')
})
</script>


<template>

  <div class="container">
    <app-navbar />
    <app-notification />
    <page-loader v-if="isLoading" />
<!--    <div class="box">I'm in a box.</div>-->
  </div>


<!--  <ol-map></ol-map>-->
</template>