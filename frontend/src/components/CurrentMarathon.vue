<script setup>
import { marathonStore } from '../store/marathon.js'
import { geoStore } from '../store/geo.js'
import MarathonOlMap from "./MarathonOlMap.vue";
import {computed} from "vue";

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

const checkPoint = () => {
  marathonStore.checkPoint(geoStore.position)
}

const finish = () => {
  marathonStore.finishCurrent()
}

const currentScore = computed(() => {
  return marathonStore.current?.takenPoints?.reduce((sum, item) => sum + item.score, 0) ?? 0
})

const currentStatus = computed(() => {
  if (!marathonStore.current.startedAt) {
    return 'Not started';
  }
  if (marathonStore.current.startedAt && !marathonStore.current.cancelledAt && !marathonStore.current.finishedAt) {
    return 'Running';
  }
  if (marathonStore.current.cancelledAt) {
    return 'Cancelled';
  }
  if (marathonStore.current.finishedAt) {
    return 'Finished';
  }
  return '-'
})

const canFinished = computed(() => {
  return marathonStore.current?.takenPoints.length === marathonStore.current?.targets.length
})
</script>

<template>
  <div v-if="marathonStore.current?.id" class="card box mb-3 mt-0 pt-0">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">{{ marathonStore.current.title }}
            <span v-if="marathonStore.current.isDebug" class="tag is-dark">Debug mode</span> </p>
        </div>
      </div>

      <div class="content is-flex is-justify-content-space-between">
        Running time <span class="tag is-dark">0 h</span>
        Points taken <span class="tag is-dark">{{ marathonStore.current.takenPoints.length }} / {{ marathonStore.current.targets.length }}</span>
        Current score <span class="tag is-dark">{{ currentScore }}</span>
        Status <span class="tag is-dark status" :class="currentStatus.toLowerCase()">{{ currentStatus }}</span>
      </div>

      <div class="content is-flex is-justify-content-space-between">
        <marathon-ol-map class="marathon-map"
                         :position="geoStore.position"
                         :initial-zoom="15"
                         :visible-targets="marathonStore.visibleTargets"
                         :is-debug="marathonStore.current.isDebug"
        />
      </div>

      <div class="content is-flex is-justify-content-space-between">
        <div v-if="!marathonStore.current.startedAt">
          <button class="button is-primary is-dark" @click="startMarathon()">I am ready to Start!</button>
        </div>

        <div v-if="marathonStore.current.startedAt && !marathonStore.current.cancelledAt && !marathonStore.current.finishedAt">
          <button class="button is-primary is-dark" @click="checkPoint()">Checkpoint</button>
        </div>

        <div v-if="marathonStore.current.startedAt && !marathonStore.current.cancelledAt && !marathonStore.current.finishedAt">
          <button class="button is-warning is-dark" @click="abort()">Abort</button>
        </div>

        <div v-if="marathonStore.current.isDebug">
          <button class="button" @click="geoStore.testChangeGeo(-0.0001, 0)">Down</button>
          <button class="button" @click="geoStore.testChangeGeo(0.0001, 0)">Up</button>
          <button class="button" @click="geoStore.testChangeGeo(0, -0.0001)">Left</button>
          <button class="button" @click="geoStore.testChangeGeo(0, 0.0001)">Right</button>
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
.status {
  &.finished {
    color: #00ff00;
  }
}
</style>