<script setup>
const {coordinates,} = defineProps({
  coordinates: Array
})
</script>

<template>
  <ol-feature>
    <ol-geom-line-string
        :coordinates="coordinates"
    ></ol-geom-line-string>
    <ol-style>
      <ol-style-stroke color="rgba(155,50,150,1)" width="2"></ol-style-stroke>
    </ol-style>
  </ol-feature>
</template>

<style scoped lang="scss">

</style>