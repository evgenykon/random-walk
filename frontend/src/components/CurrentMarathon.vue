<script setup>
import { marathonStore } from '../store/marathon.js'
import { geoStore } from '../store/geo.js'
import MarathonOlMap from "./MarathonOlMap.vue";

const emit = defineEmits(['decline'])
const decline = () => {
  emit('decline')
  marathonStore.decline(marathonStore.current)
}
</script>

<template>
  <div v-if="marathonStore.current.id" class="card box mb-3 mt-0 pt-0">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">{{ marathonStore.current.title }}</p>
        </div>
      </div>

      <div class="content is-flex is-justify-content-space-between">
        Running time <span class="tag is-dark">0 h</span>
        Points taken <span class="tag is-dark">0 / 10</span>
        Current score <span class="tag is-warning">0</span>
      </div>

      <div class="content is-flex is-justify-content-space-between">
        <marathon-ol-map class="marathon-map"
                         :initial-center="geoStore.position"
                         :initial-zoom="15"
        />
      </div>

      <div class="content is-flex is-justify-content-space-between">
        <div>
          <button class="button is-primary is-dark">I am ready to Start!</button>
        </div>
        <div><button class="button" @click="decline()">Decline</button></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.marathon-map {
  width: 100%;
  height: 70vh;
}
</style>