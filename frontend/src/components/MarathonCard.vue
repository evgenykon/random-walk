<script setup>
const {marathon,} = defineProps({
  marathon: Object
})
const emit = defineEmits(['open'])
</script>

<template>
  <a class="card box mb-3" href="#" @click="emit('open', marathon)">
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">{{ marathon.title }}</p>
          <p v-if="marathon.startedAt" class="subtitle is-6">{{ marathon.startedAt }}</p>
          <p v-else class="subtitle is-6">Not started</p>
        </div>
      </div>

      <div class="content">
        Running time <span class="tag is-dark">0 h</span>
        <br />
        Points taken <span class="tag is-dark">0 / 10</span>
        <br />
        Current score <span class="tag is-warning">0</span>
      </div>
    </div>
  </a>
</template>

<style scoped lang="scss">

</style>