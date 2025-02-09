
<script setup>
import {onBeforeMount, ref} from "vue";
import { authStore } from './store/auth.js'
import { marathonStore } from './store/marathon.js'
import { geoStore } from './store/geo.js'
import PageLoader from "./components/PageLoader.vue";
import AppNotification from "./components/AppNotification.vue";

import AppNavbar from "./components/AppNavbar.vue";
import MarathonData from "./components/MarathonData.vue";
import NewMarathonForm from "./components/NewMarathonForm.vue";
import CurrentMarathon from "./components/CurrentMarathon.vue";
import ScanQr from "./components/ScanQr.vue";
import CloudData from "./components/CloudData.vue";
import ClearLocalDataDialog from "./components/ClearLocalDataDialog.vue";
import AboutScreen from "./components/AboutScreen.vue";
import HomeScreen from "./components/HomeScreen.vue";
import ClearServerDataDialog from "./components/ClearServerDataDialog.vue";


const isLoading = ref(false);
const showScreen = ref('home');
const isClearLocalData = ref(false)
const isClearServerData = ref(false)

onBeforeMount(async () => {
  marathonStore.init();
  await authStore.init();
})

const openMarathon = async (item) => {
  await marathonStore.setCurrent(item);
  showScreen.value = 'marathon'
}

const clearLocalData = async () => {
  marathonStore.clearAll()
  isClearLocalData.value = false
}

const clearServerData = async () => {
  authStore.generateNewAuth()
  isClearServerData.value = false
}

const saveToServer = async () => {
  isLoading.value = true
  try {
    await authStore.saveRoutes(marathonStore.list)
  } catch (e) {
    console.error('saveToServer', e)
  } finally {
    isLoading.value = false
  }
}

const loadFromServer = async () => {
  isLoading.value = true
  try {
    marathonStore.list = await authStore.loadRoutes()
  } catch (e) {
    console.error('saveToServer', e)
  } finally {
    isLoading.value = false
  }
}
</script>


<template>

  <div class="container">
    <app-navbar
        @new-marathon="showScreen = 'new-marathon'"
        @clear-stored-data="isClearLocalData = true"
        @home="showScreen = 'home'"
        @about="showScreen = 'about'"
        @scan-qr="showScreen = 'scan-qr'"
        @cloud="showScreen = 'cloud'"
    />
    <app-notification />

    <clear-local-data-dialog v-if="isClearLocalData" @clear="clearLocalData" @cancel="isClearLocalData = false" />
    <clear-server-data-dialog v-if="isClearServerData" @clear="clearServerData" @cancel="isClearLocalData = false" />

    <new-marathon-form v-if="showScreen === 'new-marathon'"
                       @cancel="showScreen = 'home'"
                       @create="showScreen = 'home'"
    />

    <home-screen v-if="showScreen === 'home'" @open-route="openMarathon" />

    <cloud-data v-if="showScreen === 'cloud'"
                @drop-local="isClearLocalData = true"
                @drop-server="isClearServerData = true"
                @upload="saveToServer"
                @download="loadFromServer"
    ></cloud-data>

    <about-screen  v-if="showScreen === 'about'"  />

    <current-marathon v-if="showScreen === 'marathon'" @home="showScreen = 'home'" />

    <scan-qr v-if="showScreen === 'scan-qr'" @home="showScreen='home'"></scan-qr>
  </div>


<!--  <ol-map></ol-map>-->
</template>