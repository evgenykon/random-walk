<script setup>
import {geoStore} from "../store/geo.js";
import MarathonData from "./MarathonData.vue";

const emit = defineEmits(['openRoute'])
</script>

<template>
  <div class="box" style="display: flex;justify-content: center;">
    <img src="../assets/favicon_1024_round.png" style="width: 50%; max-width: 500px;">
  </div>

  <h3 class="title">My Routes</h3>
  <marathon-data v-if="geoStore.position" @open="e => $emit('openRoute', e)"></marathon-data>
  <div  v-if="!geoStore.position" class="box m-5">
    <h4 class="subtitle">Waiting for GPS data</h4>
  </div>

</template>

<style scoped lang="scss">

</style>