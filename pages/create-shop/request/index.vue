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
          v-if="step === 'instagram username'"
          :is-submitting-ig-id="isSubmitting"
          @submitForm="creationStep"
        />
        <ShopRequestForm
          v-else-if="step === 'shop request'"
          :is-submitting-form="isSubmitting"
          :request-sent="requestSent"
          @submit="requestForShop"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

import ShopRequestForm from '@/components/create_shop/ShopRequestForm.vue'
import InstagramIdForm from '@/components/create_shop/InstagramIdForm.vue'

import Step from '@/models/shop_creation/creation_step'

export default {
  name: 'CreateShopRequestPage',
  components: {
    ShopRequestForm,
    InstagramIdForm
  },
  middleware: ['auth'],
  data () {
    return {
      step: 'instagram username',
      requestSent: false,
      isSubmitting: false,
      showSnackbar: false,
      snackbarMessage: ''
    }
  },
  methods: {
    ...mapMutations('shop', ['setInstagramUsername']),
    ...mapActions('shop', ['shopCreationStep', 'saveInstagramMediaQueryFile', 'getInstagramMediaQueryFile', 'shopRequest', 'shopData']),

    creationStep (igUsername) {
      // make it lower to find correct media directory in backend
      const instagramUsername = igUsername.toLowerCase()

      this.shopCreationStep(instagramUsername).then((stepData) => {
        this.setInstagramUsername(instagramUsername)
        switch (stepData.step) {
          case Step.REQUESTED:
            this.snackbarMessage = 'در حال بررسی پیج شما هستیم'
            this.showSnackbar = true
            break
          case Step.VERIFIED:
            this.saveMediaQuery(instagramUsername)
            break
          case Step.FORM_SUBMITTED:
            this.shopData(instagramUsername).then(() => {
              this.retrieveInstagramMedia()
              this.$router.push('/create-shop/posts')
            })
            break
          case Step.CREATED:
            this.snackbarMessage = 'این فروشگاه قبلا ساخته شده است.'
            this.showSnackbar = true
            break
        }
      }).catch((e) => {
        if (e.response.status === 404) {
          this.setInstagramUsername(instagramUsername)
          this.step = 'shop request'
        } else {
          throw e
        }
      })
    },
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
          this.snackbarMessage = 'محتوای فروشگاه شما در حال آماده‌سازی است.'
          this.showSnackbar = true
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
      }).catch(() => {
        this.isSubmitting = false
        this.snackbarMessage = 'خطا در ثبت!'
        this.showSnackbar = true
      })
    }
  }
}
</script>
