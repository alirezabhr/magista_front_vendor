<template>
  <div>
    <v-snackbar
      v-model="showSnackbar"
      color="grey darken-3"
    >
      {{ snackbarMessage }}
    </v-snackbar>
    <v-row justify="center" no-gutters>
      <v-col col="10" sm="6" md="5" lg="4">
        <InstagramIdForm
          v-if="creationStep === 'instagram username'"
          :is-submitting-ig-id="isSubmitting"
          @submitForm="saveMediaQuery"
        />
        <ShopRequestForm
          v-else-if="creationStep === 'shop request'"
          :is-submitting-form="isSubmitting"
          :request-sent="requestSent"
          @submit="requestForShop"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import ShopRequestForm from '@/components/create_shop/ShopRequestForm.vue'
import InstagramIdForm from '@/components/create_shop/InstagramIdForm.vue'

export default {
  name: 'CreateShopRequestPage',
  components: {
    ShopRequestForm,
    InstagramIdForm
  },
  middleware: ['auth'],
  data () {
    return {
      creationStep: 'instagram username',
      requestSent: false,
      isSubmitting: false,
      showSnackbar: false,
      snackbarMessage: ''
    }
  },
  methods: {
    ...mapActions('shop', ['saveInstagramMediaQueryFile', 'getInstagramMediaQueryFile', 'shopRequest']),

    saveMediaQuery (igUsername) {
      this.isSubmitting = true

      // make it lower to find correct media directory in backend
      const instagramUsername = igUsername.toLowerCase()

      this.saveInstagramMediaQueryFile(instagramUsername).then(() => {
        this.retrieveInstagramMedia()
        this.$router.push('/create-shop/info')
        this.isSubmitting = false
      }).catch((response) => {
        this.isSubmitting = false
        if (response.status === 404) {
          this.snackbarMessage = 'صفحه مورد نظر یافت نشد.'
          this.showSnackbar = true
        } else if (response.status === 451) {
          this.snackbarMessage = 'پیج مورد نظر پرایوت است.'
          this.showSnackbar = true
        } else if (response.status === 400 && response.data.error) {
          this.snackbarMessage = response.data.error[0]
          this.showSnackbar = true
        } else if (response.status === 500) { // if media is not ready
          this.creationStep = 'shop request'
        }
      })
    },
    retrieveInstagramMedia () {
      this.isGettingQueryMedia = true

      this.getInstagramMediaQueryFile().then(() => {
        this.isGettingQueryMedia = false
      }).catch(() => {
        this.isGettingQueryMedia = false
        this.snackbarMessage = 'خطا در دریافت محتوای اینستاگرام'
        this.showSnackbar = true
      })
    },
    requestForShop (email) {
      this.isSubmitting = true
      this.shopRequest(email).then(() => {
        this.isSubmitting = false
        this.snackbarMessage = 'درخواست شما با موفقیت ثبت شد.'
        this.showSnackbar = true
        this.requestSent = true
      })
    }
  }
}
</script>
