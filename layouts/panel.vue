<template>
  <v-app>
    <v-main class="background">
      <v-container pa-0 py-md-5>
        <v-row class="pt-0 pt-md-5" no-gutters>
          <NavigationDrawer @logout="logout" />
          <v-col
            sm="9"
            md="6"
            class="surface rounded-lg my-0 pa-0 mx-auto mx-md-10"
          >
            <v-container style="height: 680px;" class="pa-0">
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
import { mapActions } from 'vuex'

import NavigationDrawer from '@/components/NavigationDrawer.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'

export default {
  name: 'PanelLayout',
  components: {
    NavigationDrawer,
    BottomNavigation
  },
  middleware: ['auth'],
  methods: {
    ...mapActions('auth', ['userLogout']),

    logout () {
      this.userLogout()
    }
  }
}
</script>
