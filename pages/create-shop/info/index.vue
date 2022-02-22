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
          v-if="form === 'firstForm'"
          :is-submitting-form="isSubmitting"
          @submit="submitShopForm1"
        />
        <ShopDataForm2
          v-if="form === 'secondForm'"
          :is-submitting-form="isSubmitting"
          @submit="submitShopForm2"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import ShopDataForm from '@/components/create_shop/ShopDataForm.vue'
import ShopDataForm2 from '@/components/create_shop/ShopDataForm2.vue'

export default {
  name: 'CreateShopInfoPage',
  components: {
    ShopDataForm,
    ShopDataForm2
  },
  data () {
    return {
      isSubmitting: false,
      showSnackbar: false,
      snackbarMessage: '',
      form: 'firstForm',
      shopData: {
        email: '',
        province: '',
        city: '',
        address: '',
        bio: '',
        preparation: '',
        delivery: ''
      }
    }
  },
  methods: {
    ...mapActions('shop', ['createShop']),

    submitShopForm1 (data) {
      this.shopData.email = data.email
      this.shopData.province = data.province
      this.shopData.city = data.city
      this.shopData.address = data.address

      this.form = 'secondForm'
    },
    submitShopForm2 (data) {
      this.isSubmitting = true

      this.shopData.bio = data.bio
      this.shopData.preparation = data.preparation
      this.shopData.delivery = data.delivery

      this.createShop(this.shopData).then(() => {
        this.$router.push('/create-shop/posts')
        this.isSubmitting = false
      }).catch(() => {
        this.isSubmitting = false
        this.snackbarMessage = 'خطا در فرآیند ساخت فروشگاه.'
        this.showSnackbar = true
      })
    }
  }
}
</script>
