<script setup>
import {computed} from "vue";
import moment from 'moment'
import {marathonStore} from "../store/marathon.js";
const {marathon,} = defineProps({
  marathon: Object
})
const emit = defineEmits(['open'])

const startedAt = computed(() => {
  return moment(marathon.startedAt).format('llll');
})

const finishedAt = computed(() => {
  return marathon.finishedAt ? moment(marathon.finishedAt).format('llll') : '';
})

const cancelledAt = computed(() => {
  return marathon.cancelledAt ? moment(marathon.cancelledAt).format('llll') : '';
})

const runningTime = computed(() => {
  const zeroPad = (num, places) => String(num).padStart(places, '0')
  const startedAt = moment(marathon.startedAt);
  const finishedAt = marathon.finishedAt ? moment(marathon.finishedAt) : moment();
  const duration = moment.duration(finishedAt.diff(startedAt))
  if (duration.hours() < 24) {
    return duration.hours() + ":" + zeroPad(duration.minutes(), 2) + ":" + zeroPad(duration.seconds(), 2);
  }
  return duration.humanize();
})

const pointsTaken = computed(() => {
  return marathon.takenPoints.reduce((acc, point) => {
    return point.score > 0 ? acc + 1 : acc;
  }, 0);
})

const pointsTotal = computed(() => {
  return marathon.totalPoints.value;
})

const score = computed(() => {
  return marathon.takenPoints.reduce((acc, point) => {
    return acc + point.score;
  }, 0);
})

const totalScore = computed(() => {
  return marathon.targets.length * marathonStore.calculateScore(marathon.distance.value, marathon.totalPoints.value, marathon.timeLimit.value).perTargetCenter;
})

const scoreCalculation = computed(() => {
  return marathonStore.calculateScore(marathon.distance.value, marathon.totalPoints.value, marathon.timeLimit.value);
})
</script>

<template>
  <a class="marathon-data-card card box mb-3" href="#" @click="emit('open', marathon)">

    <div class="card-content p-2">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">{{ marathon.title }}</p>
          <p class="times" v-if="marathon.startedAt"><strong>Started at</strong> {{ startedAt }}</p>
          <p v-else class="times">Not started</p>
          <p v-if="finishedAt" class="times"><strong>Finished at</strong> {{ finishedAt }}</p>
          <p v-if="cancelledAt" class="times"><strong>Cancelled at</strong> {{ cancelledAt }}</p>
        </div>
      </div>

      <div class="stat content">
        <div>Running time <span class="tag is-dark">{{ runningTime }}</span></div>
        <div>Points taken <span class="tag is-dark">{{ pointsTaken }} / {{pointsTotal}}</span></div>
        <div>Score <span class="tag is-warning">{{ score }} / {{ totalScore }}</span></div>
        <div>Status: <span class="tag" :class="marathonStore.getStatus(marathon).toLowerCase()">{{ marathonStore.getStatus(marathon) }}</span></div>
      </div>

    </div>
  </a>
</template>

<style lang="scss">
@use "bulma/sass/utilities/mixins";
.marathon-data-card.card {
  .title.is-4 {
    margin-bottom: 5px;
  }
  .times {
    font-size: 0.8rem;
  }
  .media {
    margin-bottom: 5px;
  }
  .stat > div {
    width: 70%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  .tag.finished {
    color: #33ef00;
  }
  .tag.running {
    color: #0093ef;
  }
  .times {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @include mixins.until(550px) {
    .stat > div {
      width: 100%;
    }
  }
}
</style>