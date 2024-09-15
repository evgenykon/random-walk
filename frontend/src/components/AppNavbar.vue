<script setup>
import {ref} from 'vue'

const menuExpanded = ref(false)
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img src="../assets/vue.svg">
      </a>

      <a class="navbar-item" href="/">
        <img src="../assets/vue.svg">
      </a>

      <a :class="{'is-active': menuExpanded}"
         :aria-expanded="menuExpanded"
         role="button" class="navbar-burger"  aria-label="menu"  data-target="navbarBasicExample"
         @click="menuExpanded = !menuExpanded">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>



    <div id="navbarBasicExample" class="navbar-menu" :class="{'is-active': menuExpanded}">
      <div class="navbar-start">
        <a class="navbar-item">
          Home
        </a>
        <a class="navbar-item">
          Documentation
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">

</style>