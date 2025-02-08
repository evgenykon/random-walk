<script setup>
const emit = defineEmits(['clear', 'cancel'])
</script>

<template>
  <!-- Clear server data confirmation -->
  <div class="modal" :class="{'is-active': true}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Confirm the clearing of your server data (tracks, routes).</p>
      </header>
      <section class="modal-card-body">
        <div> <span class="has-text-warning	">Server will forget you and reset your local personal ID. There is no way to restore data.</span></div>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-warning" @click="$emit('clear')">Clear your server data</button>
          <button class="button" @click="$emit('cancel')">Cancel</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>