
<script setup>
import {onBeforeMount, ref} from "vue";
import { marathonStore } from './store/marathon.js'
import PageLoader from "./components/PageLoader.vue";
import AppNotification from "./components/AppNotification.vue";

import { notificationStore } from './store/notification.js'
import AppNavbar from "./components/AppNavbar.vue";
import MarathonData from "./components/MarathonData.vue";
import NewMarathonForm from "./components/NewMarathonForm.vue";


const isLoading = ref(false);
const showScreen = ref('home');

onBeforeMount(() => {
  marathonStore.init();
})
</script>


<template>

  <div class="container">
    <app-navbar
        @new-marathon="showScreen = 'new-marathon'"
        @home="showScreen = 'home'"
    />
    <app-notification />
    <new-marathon-form v-if="showScreen === 'new-marathon'"
                       @cancel="showScreen = 'home'"
                       @create="showScreen = 'home'"
    />
    <marathon-data v-if="showScreen === 'home'"></marathon-data>
<!--    <div class="box">I'm in a box.</div>-->
  </div>


<!--  <ol-map></ol-map>-->
</template>