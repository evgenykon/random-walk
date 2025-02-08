<script setup>
import { marathonStore } from '../store/marathon.js'
import { authStore } from '../store/auth.js'
import {computed, ref, onMounted, onUnmounted} from "vue";
const emit = defineEmits(['upload', 'download', 'drop-server', 'drop-local'])

const error = ref(null)
</script>

<template>
  <div class="card box cloud-data">
    <div v-if="error" class="notification is-warning p-1 m-1">
      <button class="btn-close delete p-0" @click="error = null"></button>
      {{ error }}
    </div>
    <h3 class="subtitle">Cloud Data</h3>
    <div class="block">

      <div class="field is-flex">
        <label class="label full-width-label">ID</label>
        <div class="control full-width-input">
          <input class="input is-success" type="text" readonly :value="authStore.auth">
        </div>
      </div>

      <div class="field is-flex" v-if="authStore.serverData.lastConnection">
        <label class="label full-width-label">Last connection</label>
        <div class="control full-width-input">
          <input class="input is-success" type="text" readonly :value="authStore.serverData.lastConnection">
        </div>
      </div>

      <div class="field is-flex" v-if="authStore.serverData.lastIp">
        <label class="label full-width-label">Last IP</label>
        <div class="control full-width-input">
          <input class="input is-success" type="text" readonly :value="authStore.serverData.lastIp">
        </div>
      </div>

      <div class="field is-flex" v-if="authStore.serverData.routes !== undefined">
        <label class="label full-width-label">Stored routes number</label>
        <div class="control full-width-input">
          <input class="input is-success" type="text" readonly :value="authStore.serverData.routes.length">
        </div>
      </div>

      <div class="is-flex is-gap-1 is-flex-wrap-wrap">
        <button class="button is-link is-flex-shrink-1" @click="$emit('upload')">Save my routes</button>
        <button class="button is-flex-shrink-1" @click="$emit('download')">Reload my local routes</button>
        <button class="button is-flex-shrink-1" @click="$emit('drop-server')">Drop my data on server</button>
        <button class="button is-flex-shrink-1" @click="$emit('drop-local')">Drop my local data</button>
      </div>

    </div>
  </div>
</template>

<style lang="scss">
.cloud-data {
  width: 100%;
  .full-width-label {
    padding: 8px 12px;
    flex-wrap: nowrap;
    white-space: nowrap;
  }
  .full-width-input {
    width: 100%;
  }
}
</style>