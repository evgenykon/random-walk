<script setup>
import { ref, onMounted } from "vue";
import * as olProj from 'ol/proj';

const center = ref([0, 0]);
// const projection = ref("EPSG:3857");
const zoom = ref(8);
const rotation = ref(0);
const currentCenter = ref(center.value);
const currentZoom = ref(zoom.value);
const currentRotation = ref(rotation.value);
const currentResolution = ref(0);

const moscowMercator = {lat: 4140041.6874567242, long: 7558119.1338031795};
const moscowEPSG = [55, 43];
const moscow9009 = olProj.transform(moscowEPSG,'EPSG:4326','EPSG:3857');

function resolutionChanged(event) {
  currentResolution.value = event.target.getResolution();
  currentZoom.value = event.target.getZoom();
}
function centerChanged(event) {
  currentCenter.value = event.target.getCenter();
}
function rotationChanged(event) {
  currentRotation.value = event.target.getRotation();
}

onMounted(() => {
  center.value = [moscowEPSG.long,moscowEPSG.lat];
  if (!("geolocation" in navigator)) {
    this.errorStr = "Geolocation is not available.";
    return;
  }
  navigator.geolocation.watchPosition(
      pos => {
        // this.gettingLocation = false;
        center.value = moscow9009 // [pos.coords.latitude, pos.coords.longitude]
        // this.initialPosition.lat = pos.coords.latitude;
        // this.initialPosition.lng = pos.coords.longitude;
        // const userData = {
        //   position: {
        //     lat: pos.coords.latitude,
        //     lng: pos.coords.longitude
        //   },
        //   // userName: this.usersName
        // };
        // this.userlocation = userData;
        // this.updateRoom(userData);
      },
      err => {
        this.gettingLocation = false;
        this.errorStr = err.message;
      }
  );
});
</script>

<template>

  <ol-map class="ol-map-container" :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true">
    <ol-view
        ref="view"
        :center="center"
        :rotation="rotation"
        :zoom="zoom"
        :projection="projection"
        @change:center="centerChanged"
        @change:resolution="resolutionChanged"
        @change:rotation="rotationChanged"
    />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

  </ol-map>

  <ul>
    <li>center : {{ currentCenter }}</li>
    <li>resolution : {{ currentResolution }}</li>
    <li>zoom : {{ currentZoom }}</li>
    <li>rotation : {{ currentRotation }}</li>
  </ul>
</template>

<style scoped lang="scss">
.ol-map-container {
  height: 50vh;
  width: 50vw;
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