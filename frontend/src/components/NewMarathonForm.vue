<script setup>
import {ref, computed} from "vue";

const emit = defineEmits(['create', 'cancel'])
import { geoStore } from '../store/geo.js'

import { marathonStore } from '../store/marathon.js'

const form = ref({
  distance: {value: 3000, label: '3 km'},
  points: {value: 5, label: '5 points'},
  timeLimit: {value: 1, label: '1 h'},
  isDebug: {value: false},
});


const createNew = () => {
  emit('create')
  marathonStore.new(form.value, geoStore.position);
}

const name = computed(() => {
  return `${form.value.distance.label} / ${form.value.points.label} / ${form.value.timeLimit.label}`;
})
</script>

<template>
<div class="card box">
  <div class="card-content">
    <p class="title is-4">Create new Marathon</p>
    <p class="subtitle is-5">{{ name }}</p>

    <div class="block is-flex is-justify-content-space-between">
      <div class="field">
        <label class="label">Distance</label>
        <div class="control">
          <div class="select is-primary">
            <select v-model="form.distance">
              <option v-for="item of marathonStore.distances" :value="item">{{item.label}}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Targets</label>
        <div class="control">
          <div class="select is-primary">
            <select v-model="form.points">
              <option v-for="item of marathonStore.points" :value="item">{{item.label}}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Time limit</label>
        <div class="control">
          <div class="select is-primary">
            <select v-model="form.timeLimit">
              <option v-for="item of marathonStore.timeLimits" :value="item">{{item.label}}</option>
            </select>
          </div>
        </div>
      </div>
    </div>


    <div class="block is-flex ">
      <div class="field">
        <div class="control">
          <label class="checkbox">
            <input type="checkbox"  v-model="form.isDebug"/>
            Debug mode
          </label>
        </div>
      </div>
    </div>

    <div class="field is-grouped">
      <div class="control">
        <button class="button is-primary is-dark" @click="createNew">Create</button>
      </div>
      <div class="control">
        <button class="button is-dark" @click="emit('cancel')">Cancel</button>
      </div>
    </div>



  </div>
</div>
</template>

<style scoped lang="scss">

</style>