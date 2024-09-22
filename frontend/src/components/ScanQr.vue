<script setup>

import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
import { marathonStore } from '../store/marathon.js'
const emit = defineEmits(['home'])

import { onMounted, ref, useTemplateRef} from "vue";

const error = ref(null)
const detected = ref(null)

const showError = (msg) => {
  error.value = msg
}

const onDetect = (data) => {
  detected.value = null
  if (data && data.length === 0) {
    return showError('Incorrect QR code format')
  }
  if (!data[0].rawValue) {
    return showError('Incorrect QR code data')
  }
  try {
    const val = JSON.parse(data[0].rawValue);
    if (!val.id || !val.title || !val.distance) {
      return showError('Incorrect QR code path version')
    }
    detected.value = val
  } catch (e) {
    return showError('Incorrect QR code value')
  }
}

function paintBoundingBox(detectedCodes, ctx) {
  for (const detectedCode of detectedCodes) {
    const {
      boundingBox: { x, y, width, height }
    } = detectedCode

    ctx.lineWidth = 2
    ctx.strokeStyle = '#007bff'
    ctx.strokeRect(x, y, width, height)
  }
}

const importPath = () => {
  marathonStore.importPath(detected.value);
  this.emit('home')
}
</script>

<template>
  <div class="card box">
    <div v-if="error" class="notification is-warning p-1 m-1">
      <button class="btn-close delete p-0" @click="error = null"></button>
      {{ error }}
    </div>

    <div class="card-image">
      <qrcode-stream :track="paintBoundingBox" @detect="onDetect"></qrcode-stream>
    </div>
    <div v-if="detected" class="card-content">
      <div class="card"></div>
      <strong>Scanned path</strong>
      <div>{{detected.title}}</div>
    </div>
    <div v-if="detected" class="content">
      <button type="button" class="button is-primary" @click="importPath">Import</button>
    </div>
  </div>
</template>

<style lang="scss">

</style>