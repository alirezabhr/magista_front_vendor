<template>
  <v-container class="indigo lighten-5" style="height: 100%">
    <v-snackbar
      v-model="showSnackbar"
      elevation="24"
      :color="snackbarColor"
    >
      {{ snackbarMessage }}
    </v-snackbar>
    <ShippingForm
      :shop-city="getCurrentShop.city"
      :shop-delivery-data="getCurrentShopDelivery"
      :is-submitting="isSubmittingShippingForm"
      @submit="submit"
    />
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ShippingForm from '~/components/shipping/ShippingForm.vue'

export default {
  name: 'ProfileShippingPage',
  components: {
    ShippingForm
  },
  data () {
    return {
      showSnackbar: false,
      snackbarMessage: '',
      snackbarColor: 'red',
      isSubmittingShippingForm: false
    }
  },
  computed: {
    ...mapGetters('shop', ['getCurrentShop', 'getCurrentShopDelivery'])
  },
  methods: {
    ...mapActions('shop', ['updateShopShipping']),

    submit (payload) {
      this.isSubmittingShippingForm = true
      this.updateShopShipping(payload).then(() => {
        this.snackbarColor = 'green'
        this.snackbarMessage = 'تغییرات ذخیره شد.'
        this.showSnackbar = true
        this.isSubmittingShippingForm = false
      }).catch(() => {
        this.isSubmittingShippingForm = false
        this.snackbarColor = 'red'
        this.snackbarMessage = 'ثبت با خطا مواجه شد.'
        this.showSnackbar = true
      })
    }
  }
}
</script>
