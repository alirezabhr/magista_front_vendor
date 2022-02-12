<template>
  <v-container class="indigo lighten-5" style="height: 100%">
    <ShippingForm :shop-city="shopCity" @submit="submit" />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import ShippingForm from '@/components/ShippingForm.vue'

export default {
  name: 'ProfileShippingPage',
  components: {
    ShippingForm
  },
  computed: {
    ...mapGetters('shop', ['getCurrentShop']),

    shopCity () {
      return this.getCurrentShop.city
    }
  },
  methods: {
    submit (payload) {
      console.log(payload)
    }
  }
}
</script>
