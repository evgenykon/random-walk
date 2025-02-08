<script setup>
const emit = defineEmits(['clear', 'cancel'])
</script>

<template>
  <!-- Clear local data confirmation -->
  <div class="modal" :class="{'is-active': true}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Confirm the clearing of all local data (tracks, routes)</p>
      </header>
      <section class="modal-card-body">
        <div> <span class="has-text-warning	">Sure? The only way to restore routes is to reload its from server.</span></div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-warning" @click="$emit('clear')">Clear local data</button>
          <button class="button" @click="$emit('cancel')">Cancel</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>