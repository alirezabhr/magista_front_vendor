<template>
  <v-app>
    <v-main class="background">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  middleware: ['auth']
}
</script>
