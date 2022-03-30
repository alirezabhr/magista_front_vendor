<template>
  <v-app>
    <v-main class="background">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
// Created to have a layout which doesn't have authentication middleware
export default {
  name: 'AuthLayout'
}
</script>
