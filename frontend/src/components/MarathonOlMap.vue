<script setup>
import {ref, onMounted, onBeforeMount, computed} from "vue";
import * as olProj from 'ol/proj';
import User from "./map/User.vue";
import Target from "./map/Target.vue";
import GeoTrack from "./map/GeoTrack.vue";
import {marathonStore} from "../store/marathon.js";
const {position, initialZoom,track,visibleTargets,isDebug} = defineProps({
  position: Array,
  track: Array,
  initialZoom: Number,
  visibleTargets: Array,
  isDebug: Boolean
})


const center = ref([0, 0]);
const projection = ref('EPSG:3857');
const zoom = ref(6);
const rotation = ref(0);

onBeforeMount(() => {
  const posValues = position.map(item => item)
  if (Array.isArray(posValues)) {
    center.value = olProj.transform(posValues.reverse(),'EPSG:4326','EPSG:3857') ;
  }
  if (initialZoom) {
    zoom.value = initialZoom;
  }

})

const drawTrack = computed(() => {
  if (!track || track.length === 0) {
    return [];
  }
  return track.map(item => olProj.transform([item[0], item[1]].reverse(),'EPSG:4326','EPSG:3857')).filter(c => c[0] && c[1]);
})
</script>

<template>
<div class="marathon-ol-map">
  <ol-map class="ol-map-container" :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true">
    <ol-view
        ref="view"
        :center="center"
        :rotation="rotation"
        :zoom="zoom"
        :projection="projection"
    />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <ol-vector-layer>
      <ol-style>
        <ol-source-vector>
          <user v-if="position" :position="position" />

          <target v-for="visibleTarget of visibleTargets"
                  :key="visibleTarget.order"
                  :position="visibleTarget.coords"
                  :number="visibleTarget.order"
                  :is-taken="!!visibleTarget.takeAt"
          />

          <geo-track :coordinates="drawTrack" />

        </ol-source-vector>
      </ol-style>
    </ol-vector-layer>
  </ol-map>

</div>



</template>

<style scoped lang="scss">
.ol-map-container {
  height: 100%;
  width: 100%;
}
.ol-map {
  position: relative;
}
.ol-map-loading:after {
  content: "";
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  margin-top: -40px;
  margin-left: -40px;
  border-radius: 50%;
  border: 5px solid rgba(180, 180, 180, 0.6);
  border-top-color: var(--vp-c-brand-1);
  animation: spinner 0.6s linear infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>