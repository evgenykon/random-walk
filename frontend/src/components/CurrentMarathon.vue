<script setup>
import { marathonStore } from '../store/marathon.js'
import { geoStore } from '../store/geo.js'
import MarathonOlMap from "./MarathonOlMap.vue";

const emit = defineEmits(['home', 'start'])
const decline = () => {
  marathonStore.decline(marathonStore.current)
  goHome()
}

const startMarathon = () => {
  emit('start')
  marathonStore.startCurrent()
}

const abort = () => {
  marathonStore.abortCurrent()
  goHome()
}

const goHome = () => {
  emit('home')
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
        Current score <span class="tag is-dark">0</span>
        Status <span class="tag is-dark">Aborted</span>
      </div>

      <div class="content is-flex is-justify-content-space-between">
        <marathon-ol-map class="marathon-map"
                         :position="geoStore.position"
                         :initial-zoom="15"
                         :visible-targets="marathonStore.visibleTargets"
        />
      </div>

      <div class="content is-flex is-justify-content-space-between">
        <div v-if="!marathonStore.current.startedAt">
          <button class="button is-primary is-dark" @click="startMarathon()">I am ready to Start!</button>
        </div>
        <div v-if="marathonStore.current.startedAt && !marathonStore.current.cancelledAt && !marathonStore.current.finishedAt">
          <button class="button is-warning is-dark" @click="abort()">Abort</button>
        </div>
        <div v-if="!marathonStore.current.startedAt">
          <button class="button" @click="decline()">Decline</button>
        </div>
        <div v-if="!marathonStore.current.cancelledAt || !marathonStore.current.finishedAt">
          <button class="button" @click="goHome()">Go to list</button>
        </div>
        <div v-if="marathonStore.current.cancelledAt || marathonStore.current.finishedAt">
          <button class="button" @click="decline()">Delete</button>
        </div>
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