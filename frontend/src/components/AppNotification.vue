<script setup>
import { notificationStore } from '../store/notification.js'

const closeNotification = (item) => {
  notificationStore.delete(item)
}
</script>

<template>
  <div v-for="notification of notificationStore.list" class="block mb-1">
    <div class="notification is-warning p-1 m-1">
      <button class="btn-close delete p-0" @click="closeNotification(notification)"></button>
      {{ notification.text }}
    </div>
  </div>

</template>

<style scoped lang="scss">
.delete.btn-close {
  top: 0.4rem;
  right: 0.4rem;
  inset-inline-end: 0.4rem;
}
</style>