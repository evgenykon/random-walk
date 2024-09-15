<script setup>

import {computed} from "vue";
import * as olProj from "ol/proj.js";

const {position, } = defineProps({
  position: Array,
})
const convertedPosition = computed(() => {
  const posValues = position.map(item => item)
  return olProj.transform(posValues.reverse(),'EPSG:4326','EPSG:3857');
})
</script>

<template>
  <ol-feature v-if="convertedPosition">
    <ol-geom-point :coordinates="convertedPosition"></ol-geom-point>
    <ol-style>
      <ol-style-stroke color="red" :width="2"></ol-style-stroke>
      <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
      <ol-style-icon :scale="1">
        <span class="marker">👣</span>
      </ol-style-icon>
    </ol-style>
  </ol-feature>
</template>
