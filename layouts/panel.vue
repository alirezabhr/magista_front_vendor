<template>
  <v-app>
    <v-main class="background">
      <v-container py-0 py-md-5>
        <v-row class="pt-3 pt-md-5">
          <NavigationDrawer />
          <v-col
            sm="9"
            md="6"
            class="surface rounded-lg my-0 pa-0 mx-auto mx-md-10"
          >
            <v-container>
              <Nuxt />
            </v-container>
            <BottomNavigation />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'

export default {
  name: 'PanelLayout',
  components: {
    NavigationDrawer,
    BottomNavigation
  },
  middleware: ['auth']
}
</script>
