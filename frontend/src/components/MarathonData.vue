<script setup>
import { marathonStore } from '../store/marathon.js'
import MarathonCard from "./MarathonCard.vue";
const emit = defineEmits(['open'])
</script>

<template>
  <div class="block p-2">

    <marathon-card v-for="item in marathonStore.list.reverse()"
                   :key="item.id"
                   :marathon="item"
                   @open="(item) => emit('open', item)"
    />

    <div class="box" v-if="marathonStore.list.length === 0">No active items</div>
  </div>

</template>

<style scoped lang="scss">

</style>