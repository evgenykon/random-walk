<script setup>
import {onMounted, ref} from 'vue'
import GeolocationSetup from "./GeolocationSetup.vue";
const emit = defineEmits(['new-marathon', 'home'])

import { geoStore } from '../store/geo.js'
import {marathonStore} from "../store/marathon.js";

const menuExpanded = ref(false)
const geoExpanded = ref(false)

const selectMenuItem = (item) => {
  emit(item)
  menuExpanded.value = false
}
</script>

<template>



  <nav class="app-navbar navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="#" @click="selectMenuItem('home')">
        <img src="../assets/favicon_128.png">
      </a>

      <a class="navbar-item" href="#" @click="geoExpanded = !geoExpanded">
        <geolocation-setup />
        <span v-if="geoExpanded" style="font-size: 12px;">
          {{ geoStore.position?.map(item => Math.round(item * 10000) / 10000) }}
          {{ Math.floor(geoStore.geoApiData?.accuracy ?? 0) }}
        </span>
      </a>

      <a class="navbar-item" href="#">
        Scores: <strong class="tag is-warning">{{ marathonStore.scoreBalance }}</strong>
      </a>

      <a :class="{'is-active': menuExpanded}"
         :aria-expanded="menuExpanded"
         role="button" class="navbar-burger"  aria-label="menu"  data-target="navbarBasicExample"
         @click="menuExpanded = !menuExpanded">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>



    <div id="navbarBasicExample" class="navbar-menu" :class="{'is-active': menuExpanded}">
      <div class="navbar-start">
        <a v-if="geoStore.position" class="navbar-item" @click="selectMenuItem('new-marathon')">
          Create new Marathon
        </a>
        <a v-if="geoStore.position" class="navbar-item" @click="selectMenuItem('scan-qr')">
          Scan QR
        </a>
        <a class="navbar-item" @click="selectMenuItem('clear-stored-data')">
          Clear stored data
        </a>
        <a class="navbar-item" @click="selectMenuItem('about')">
          About
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.app-navbar {
  height: 52px;
  .navbar-menu.is-active {
    height: calc(100vh - 52px);
  }
}
</style>