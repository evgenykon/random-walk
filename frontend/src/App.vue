
<script setup>
import {onBeforeMount, ref} from "vue";
import { marathonStore } from './store/marathon.js'
import { geoStore } from './store/geo.js'
import PageLoader from "./components/PageLoader.vue";
import AppNotification from "./components/AppNotification.vue";

import { notificationStore } from './store/notification.js'
import AppNavbar from "./components/AppNavbar.vue";
import MarathonData from "./components/MarathonData.vue";
import NewMarathonForm from "./components/NewMarathonForm.vue";
import CurrentMarathon from "./components/CurrentMarathon.vue";


const isLoading = ref(false);
const showScreen = ref('home');

onBeforeMount(() => {
  marathonStore.init();
})

const openMarathon = (item) => {
  marathonStore.setCurrent(item);
  showScreen.value = 'marathon'
  console.log(item)
}

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

    <h3 v-if="showScreen === 'home'" class="title">Random Marathon</h3>
    <marathon-data v-if="showScreen === 'home' && geoStore.position" @open="openMarathon"></marathon-data>
    <div  v-if="showScreen === 'home' && !geoStore.position" class="box m-5">
      <h4 class="subtitle">Waiting for GPS data</h4>
    </div>
    <current-marathon v-if="showScreen === 'marathon'" @home="showScreen = 'home'" />
  </div>


<!--  <ol-map></ol-map>-->
</template>