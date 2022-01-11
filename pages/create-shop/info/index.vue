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
        <ShopDataForm
          :is-submitting-form="isSubmitting"
          @submit="submitShopForm"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import ShopDataForm from '@/components/create_shop/ShopDataForm.vue'

export default {
  name: 'CreateShopInfoPage',
  components: {
    ShopDataForm
  },
  data () {
    return {
      isSubmitting: false,
      showSnackbar: false,
      snackbarMessage: ''
    }
  },
  methods: {
    ...mapActions('shop', ['createShop']),

    submitShopForm (shopData) {
      this.isSubmitting = true

      this.createShop(shopData).then(() => {
        this.isSubmitting = false
        this.$router.push('/create-shop/posts')
      }).catch(() => {
        this.isSubmitting = false
        this.snackbarMessage = 'خطا در فرآیند ساخت فروشگاه. در صورت امکان به پشتیبانی اطلاع دهید.'
        this.showSnackbar = true
      })
    }
  }
}
</script>
