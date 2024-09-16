<script setup>
import {onMounted, ref} from 'vue'
import GeolocationSetup from "./GeolocationSetup.vue";
import PageLoader from "./PageLoader.vue";
const emit = defineEmits(['new-marathon', 'home'])

import { geoStore } from '../store/geo.js'

const menuExpanded = ref(false)

const selectMenuItem = (item) => {
  emit(item)
  menuExpanded.value = false
}
</script>

<template>



  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="#" @click="selectMenuItem('home')">
        <img src="../assets/vue.svg">
      </a>

      <a class="navbar-item" href="#">
        <geolocation-setup />
        {{ geoStore.position }}
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



    <div id="navbarBasicExample" class="navbar-menu mb-5" :class="{'is-active': menuExpanded}">
      <div class="navbar-start mb-5">
        <a class="navbar-item" @click="selectMenuItem('new-marathon')">
          Create new Marathon
        </a>
        <a class="navbar-item">
          Summary
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
#navbarBasicExample {
  height: 100vh;
}
</style>