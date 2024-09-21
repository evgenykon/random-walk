
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
const isClearData = ref(false)

onBeforeMount(() => {
  marathonStore.init();
})

const openMarathon = async (item) => {
  await marathonStore.setCurrent(item);
  showScreen.value = 'marathon'
}

const clearAllData = async () => {
  marathonStore.clearAll()
  isClearData.value = false
}
</script>


<template>

  <div class="container">
    <app-navbar
        @new-marathon="showScreen = 'new-marathon'"
        @clear-stored-data="isClearData = true"
        @home="showScreen = 'home'"
    />
    <app-notification />

    <!-- Clear data confirmation -->
    <div class="modal" :class="{'is-active': isClearData}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Confirm the clearing of all data (tracks, marathons)</p>
        </header>
        <section class="modal-card-body">
          <div> <span class="has-text-warning	">Sure?</span></div>
        </section>
        <footer class="modal-card-foot">
          <div class="buttons">
            <button class="button is-warning" @click="clearAllData">Clear all data</button>
            <button class="button" @click="isClearData = false">Cancel</button>
          </div>
        </footer>
      </div>
    </div>


    <new-marathon-form v-if="showScreen === 'new-marathon'"
                       @cancel="showScreen = 'home'"
                       @create="showScreen = 'home'"
    />

<!--    <button @click="test">test db</button>-->

    <h3 v-if="showScreen === 'home'" class="title">Random Marathon</h3>
    <marathon-data v-if="showScreen === 'home' && geoStore.position" @open="openMarathon"></marathon-data>
    <div  v-if="showScreen === 'home' && !geoStore.position" class="box m-5">
      <h4 class="subtitle">Waiting for GPS data</h4>
    </div>
    <current-marathon v-if="showScreen === 'marathon'" @home="showScreen = 'home'" />
  </div>


<!--  <ol-map></ol-map>-->
</template>