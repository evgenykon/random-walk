<script setup>

import {computed} from "vue";
import * as olProj from "ol/proj.js";

const {position, } = defineProps({
  position: Array,
  number: String
})
const convertedPosition = computed(() => {
  const posValues = position.map(item => item)
  return olProj.transform(posValues.reverse(),'EPSG:4326','EPSG:3857');
})
</script>

<template>
  <ol-feature v-if="convertedPosition">
    <ol-geom-point :coordinates="convertedPosition"></ol-geom-point>
    <ol-geom-circle :center="convertedPosition" :radius="50"></ol-geom-circle>
    <ol-style>
      <ol-style-stroke color="red" :width="3"></ol-style-stroke>
      <ol-style-fill color="rgba(255,200,0,0.2)"></ol-style-fill>
    </ol-style>
  </ol-feature>
  <ol-feature v-if="convertedPosition">
    <ol-geom-point :coordinates="convertedPosition"></ol-geom-point>
    <ol-geom-circle :center="convertedPosition" :radius="150"></ol-geom-circle>
    <ol-style>
      <ol-style-stroke color="rgba(255,100,0,0.2)" :width="1"></ol-style-stroke>
      <ol-style-fill color="rgba(255,100,0,0.2)"></ol-style-fill>
    </ol-style>
  </ol-feature>
  <ol-feature v-if="convertedPosition">
    <ol-geom-point :coordinates="convertedPosition"></ol-geom-point>
    <ol-style>
      <ol-style-text :text="`#${number + 1}`" fill="rgba(100,10,0,1)"></ol-style-text>
    </ol-style>
  </ol-feature>
</template>
