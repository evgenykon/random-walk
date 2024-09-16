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
  <div v-if="marathonStore.current?.id" class="current-marathon card box">
    <div class="card-content">

      <div class="marathon-name content">
        <p class="title">{{ marathonStore.current.title }}
          <span v-if="marathonStore.current.isDebug" class="tag is-dark debug-tag">Debug mode</span>
        </p>
      </div>

      <div class="stat-line content">
        <div class="cell">
          <span class="label">Running time</span>
          <span class="tag is-dark">0 h</span>
        </div>

        <div class="cell">
          <span class="label">Points taken</span>
          <span class="tag is-dark">{{ marathonStore.current.takenPoints.length }} / {{ marathonStore.current.targets.length }}</span>
        </div>

        <div class="cell">
          <span class="label">Current score</span>
          <span class="tag is-dark">{{ currentScore }}</span>
        </div>

        <div class="cell">
          <span class="label">Status</span>
          <span class="tag is-dark status" :class="currentStatus.toLowerCase()">{{ currentStatus }}</span>
        </div>

      </div>

      <div class="content map-wrapper">
        <marathon-ol-map class="marathon-map"
                         :position="geoStore.position"
                         :initial-zoom="15"
                         :visible-targets="marathonStore.visibleTargets"
                         :is-debug="marathonStore.current.isDebug"
        />
      </div>

      <div class="content is-flex is-justify-content-space-between">
          <button v-if="!marathonStore.current.startedAt" class="button is-primary is-dark" @click="startMarathon()">I am ready to Start!</button>

          <button v-if="marathonStore.current.startedAt && !marathonStore.current.cancelledAt && !marathonStore.current.finishedAt"
                  class="button is-primary is-dark" @click="checkPoint()">Checkpoint</button>

          <button v-if="marathonStore.current.startedAt && !marathonStore.current.cancelledAt && !marathonStore.current.finishedAt"
                  class="button is-warning is-dark" @click="abort()">Abort</button>

        <div v-if="marathonStore.current.isDebug">
          <button class="button" @click="geoStore.testChangeGeo(-0.0001, 0)">Down</button>
          <button class="button" @click="geoStore.testChangeGeo(0.0001, 0)">Up</button>
          <button class="button" @click="geoStore.testChangeGeo(0, -0.0001)">Left</button>
          <button class="button" @click="geoStore.testChangeGeo(0, 0.0001)">Right</button>
        </div>

        <button v-if="!marathonStore.current.startedAt" class="button" @click="decline()">Decline</button>

        <button v-if="!marathonStore.current.cancelledAt || !marathonStore.current.finishedAt" class="button" @click="goHome()">Go to list</button>

        <button v-if="marathonStore.current.cancelledAt || marathonStore.current.finishedAt" class="button" @click="decline()">Delete</button>

      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "bulma/sass/utilities/mixins";
$breakpoint: 1280px;

.current-marathon.card.box {
  margin: 0;
  padding: 0;
  .stat-line {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    margin-bottom: 5px;
    .label {
      margin-bottom: 0;
    }
  }
  .marathon-map {
    width: 100%;
    height: 70vh;
  }
  .status {
    &.finished {
      color: #00ff00;
    }
  }

  @include mixins.until(550px) {
    .card-content {
      padding: 5px;
    }
    .marathon-name {
      margin-bottom: 5px;
      .title {
        font-size: 14px;
      }
    }
    .debug-tag {
      display: none;
    }
    .stat-line {
      .label {
        font-size: 10px;
      }
    }
    .map-wrapper {
      padding: 0;
    }
    button.button {

    }
  }

}

</style>