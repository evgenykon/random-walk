<script setup>
import { useGeolocation } from '@vueuse/core'
import {onMounted, ref, watch} from "vue";
const emit = defineEmits(['error', 'success', 'update'])

import { geoStore } from '../store/geo.js'
import { marathonStore } from '../store/marathon.js'

const { coords, locatedAt, error, resume, pause } = useGeolocation()
watch(error, (value) => {
  if (error && (error.code || error.message)) {
    emit("error", error)
    geoStore.setApiError(error);
  } else {
    emit("success")
    geoStore.setApiError(null);
  }
});
watch(coords, (value) => {
  emit('update', value)
  console.log('geo update', value)
  geoStore.setGeoAPiData(coords);
  marathonStore.addGeoToTrack([value?.latitude ?? 0, value?.longitude ?? 0]);
})


</script>

<template>
  <font-awesome-icon v-if="error === null && !locatedAt" icon="fa-solid fa-location-pin-lock" class="geo-pending" />

  <font-awesome-icon v-else-if="error" icon="fa-solid fa-location-pin-lock" class="geo-blocked" />

  <template v-else>
    <font-awesome-icon  icon="fa-solid fa-location-crosshairs" class="geo-allowed" :class="{
      'acc-good': coords.accuracy ? coords.accuracy < 20 : false,
      'acc-mid': coords.accuracy ? coords.accuracy >= 20 : true
    }" />
  </template>
</template>

<style scoped lang="scss">
.geo-pending {
  animation: pending 1s infinite;
}
.geo-blocked {
  color: #ca0000;
}
.geo-allowed.acc-good {
  color: #33ef00;
}
.geo-allowed.acc-mid {
  color: #b8b464;
}
@keyframes pending {
  from {
    color: #6a6a6a;
  }
  to {
    color: #373737;
  }
}
</style>