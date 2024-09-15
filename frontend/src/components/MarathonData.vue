<script setup>
import { marathonStore } from '../store/marathon.js'
import MarathonCard from "./MarathonCard.vue";
</script>

<template>
  <div class="block p-2">
    <h3 class="title">Random Marathon</h3>

    <marathon-card v-for="item in marathonStore.list" />

    <div class="box">No active items</div>
  </div>

</template>

<style scoped lang="scss">

</style>