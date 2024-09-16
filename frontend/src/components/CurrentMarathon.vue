<script setup>
import { marathonStore } from '../store/marathon.js'
import { geoStore } from '../store/geo.js'
import MarathonOlMap from "./MarathonOlMap.vue";
import {computed, ref} from "vue";

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
}

const goHome = () => {
  emit('home')
}

const isShowNotIntersectedConfirmation = ref(false);
const notIntersectedWarningText = ref('');
const isShowFinalModal = ref(false);

const checkPoint = () => {
  const score = marathonStore.checkIntersectionScore(geoStore.position);
  if (score > 0) {
    if (score < marathonStore.scoreForSmallCircleReach) {
      notIntersectedWarningText.value = `You have not reached the center of the zone. The reward will be ${score} points. Confirm checkpoint?`;
      isShowNotIntersectedConfirmation.value = true;
    } else {
      confirmCheckPoint()
    }
  } else {
    isShowNotIntersectedConfirmation.value = true;
    notIntersectedWarningText.value = `You have not reached the checkpoint area. If you confirm the action, the achievement will not be counted.`;
  }
}

const confirmCheckPoint = () => {
  marathonStore.checkPoint(geoStore.position);
  isShowNotIntersectedConfirmation.value = false;
  if (marathonStore.current?.finishedAt) {
    isShowFinalModal.value = true
  }
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

  <!-- Confirm checkpoint modal -->
  <div class="modal" :class="{'is-active': isShowNotIntersectedConfirmation}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Checkpoint score warning</p>
      </header>
      <section class="modal-card-body">
        {{notIntersectedWarningText}}
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-warning" @click="confirmCheckPoint()">Confirm</button>
          <button class="button" @click="isShowNotIntersectedConfirmation = false;">Cancel</button>
        </div>
      </footer>
    </div>
  </div>

  <!-- Final modal -->
  <div class="modal" :class="{'is-active': isShowFinalModal}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">The marathon is over!</p>
      </header>
      <section class="modal-card-body">
        <span class="has-text-warning	">Congratulations! You have completed the current challenge!</span>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-primary" @click="isShowFinalModal = false;">Done</button>
        </div>
      </footer>
    </div>
  </div>


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
                         :class="{'geotools': marathonStore.current.isDebug}"
                         :position="geoStore.position"
                         :initial-zoom="15"
                         :visible-targets="marathonStore.visibleTargets"
                         :is-debug="marathonStore.current.isDebug"
        />
        <div v-if="marathonStore.current.isDebug">
          <button class="button" @click="geoStore.testChangeGeo(-0.0001, 0)">Down</button>
          <button class="button" @click="geoStore.testChangeGeo(0.0001, 0)">Up</button>
          <button class="button" @click="geoStore.testChangeGeo(0, -0.0001)">Left</button>
          <button class="button" @click="geoStore.testChangeGeo(0, 0.0001)">Right</button>
        </div>
      </div>

      <div class="content action-bar">
        <button v-if="!marathonStore.current.startedAt" class="button is-primary is-dark" @click="startMarathon()">I am ready to Start!</button>

        <button v-if="marathonStore.current.startedAt && !marathonStore.current.cancelledAt && !marathonStore.current.finishedAt"
                class="button is-primary is-dark" @click="checkPoint()">Checkpoint</button>

        <button v-if="marathonStore.current.startedAt && !marathonStore.current.cancelledAt && !marathonStore.current.finishedAt"
                class="button is-warning is-dark" @click="abort()">Abort</button>



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
  height: calc(100vh - 52px);
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
  .card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    .action-bar {
      margin-top: auto;
    }
  }

  @include mixins.until(550px) {
    .card-content {
      padding: 5px;
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
        .marathon-map {
          height: calc(100vh - 200px);
          &.geotools {
            height: calc(100vh - 255px);
          }
        }
      }
      .action-bar {
        margin-top: auto;
        height: 6vh;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.8vw;
      }
    }
  }

}

</style>