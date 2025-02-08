
<script setup>
import {onBeforeMount, ref} from "vue";
import { marathonStore } from './store/marathon.js'
import { geoStore } from './store/geo.js'
import PageLoader from "./components/PageLoader.vue";
import AppNotification from "./components/AppNotification.vue";

import AppNavbar from "./components/AppNavbar.vue";
import MarathonData from "./components/MarathonData.vue";
import NewMarathonForm from "./components/NewMarathonForm.vue";
import CurrentMarathon from "./components/CurrentMarathon.vue";
import ScanQr from "./components/ScanQr.vue";


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
        @about="showScreen = 'about'"
        @scan-qr="showScreen = 'scan-qr'"
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

    <div class="box" style="display: flex;justify-content: center;">
      <a href="/">
        <img src="./assets/favicon_1024.png" style="width: 50%; max-width: 500px;">
      </a>
    </div>

    <h3 v-if="showScreen === 'home'" class="title">Routes</h3>
    <marathon-data v-if="showScreen === 'home' && geoStore.position" @open="openMarathon"></marathon-data>
    <div  v-if="showScreen === 'home' && !geoStore.position" class="box m-5">
      <h4 class="subtitle">Waiting for GPS data</h4>
    </div>
    <div  v-if="showScreen === 'about'" class="m-5">
      <div class="box">
        <h4 class="title">About this app</h4>
        <pre style="text-align: left; font-size: 12px; margin-bottom: 10px;">
{
   createdWith: Vue + Vite + Bulma + OL
   version: 1.2
   lastUpdate: Feb 09, 2025
}</pre>

        <div>
          Send your love to <a href="https://t.me/evgeny39m" target="_blank">https://t.me/evgeny39m</a>
        </div>
      </div>
      <div class="box">
        <div class="subtitle">
          <h4>Release notes</h4>
        </div>
        <div class="block" style="text-align: left; font-size: 12px; margin-bottom: 10px;">
          <strong>Feb 09, 2025 v1.2</strong>
          <p>Change naming (Random marathon -> Random walk), update icons</p>
        </div>
        <div class="block" style="text-align: left; font-size: 12px; margin-bottom: 10px;">
          <strong>Sept 22, 2024 v1.1</strong>
          <p>Sharing between devices! If you want to run with someone just share your path by QR code before the start!</p>
          <p>Your partner can scan your QR and add same path to his device.</p>
        </div>
        <div class="block" style="text-align: left; font-size: 12px; margin-bottom: 10px;">
          <strong>Sept 21, 2024 v1.0</strong>
          <p>Want to say 'hi' to all runners! New app in da base!</p>
          <p>Wish you enjoy it!</p>
          <p>Make a randomly generated route (sorry for points in the lake or something like that - its random!) and run it!</p>
        </div>
      </div>
    </div>

    <current-marathon v-if="showScreen === 'marathon'" @home="showScreen = 'home'" />

    <scan-qr v-if="showScreen === 'scan-qr'" @home="showScreen='home'"></scan-qr>
  </div>


<!--  <ol-map></ol-map>-->
</template>