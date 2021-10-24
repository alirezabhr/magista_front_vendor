<template>
  <v-container>
    <v-snackbar
      v-model="showSnackbar"
      color="grey darken-3"
    >
      {{ snackbarMessage }}
    </v-snackbar>
    <v-row class="py-6" justify="center">
      <v-col col="10" sm="6" md="4">
        <InstagramIdForm
          v-if="creationStep === 'instagram username'"
          :is-submitting-ig-id="isLoading"
          @submitForm="retrieveInstagramMedia"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

import InstagramIdForm from '@/components/create_shop/InstagramIdForm.vue'

export default {
  name: 'CreateShopPage',
  components: {
    InstagramIdForm
  },
  data () {
    return {
      showSnackbar: false,
      snackbarMessage: '',
      creationStep: 'instagram username',
      isLoading: false
    }
  },
  methods: {
    ...mapActions('shop', ['getInstagramMedia']),

    retrieveInstagramMedia (instagramUsername) {
      console.log('in retrieveInstagramMedia')
      this.isLoading = true

      this.getInstagramMedia({
        instagram_username: instagramUsername
      }).then((response) => {
        this.isLoading = false
        console.log('then in retrirveInstagramMedia')
        console.log(response)
      }).catch((response) => {
        console.log('catch in retrirveInstagramMedia')
        this.isLoading = false
        if (response.status === 404) {
          this.snackbarMessage = response.data.error[0]
          this.showSnackbar = true
        } else {
          console.log(response)
        }
      })
    }
  }
}
</script>
