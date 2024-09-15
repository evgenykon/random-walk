<script setup>
import { useGeolocation } from '@vueuse/core'
import {onMounted, ref, watch} from "vue";
const emit = defineEmits(['error', 'success', 'update'])

const { coords, locatedAt, error, resume, pause } = useGeolocation()
watch(error, (value) => {
  if (error && (error.code || error.message)) {
    emit("error", error)
  } else {
    emit("success")
  }
});
watch(coords, (value) => {
  emit('update', value)
  console.log('geo update', value)

})
</script>

<template>
  <progress v-if="error === null && !locatedAt" class="progress is-small is-light" max="100"></progress>
  <div v-if="error" class="notification is-warning p-1 m-1">
    GeoPosition Sensor error: {{error.message}}
  </div>
</template>

<style scoped lang="scss">

</style>