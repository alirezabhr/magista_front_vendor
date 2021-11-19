<template>
  <div v-if="isLoadingPage">
    <v-col cols="12">
      loading ...
    </v-col>
  </div>
  <div v-else>
    <v-col v-if="getShops.length === 0" cols="12">
      <v-row class="pa-10 text-h5 font-weight-bold grey--text" justify="center">
        هیچ فروشگاهی ندارید!
      </v-row>
      <v-row justify="center">
        <v-img
          contain
          max-height="250"
          max-width="250"
          :src="getEmptyStateImageUrl"
        />
      </v-row>
      <v-row class="pa-10 text-h5 font-weight-bold grey--text" justify="center">
        <v-btn
          class="primary font-weight-bold py-5"
          @click.prevent="$router.push('/create-shop')"
        >
          ساخت فروشگاه جدید
        </v-btn>
      </v-row>
    </v-col>
    <v-col v-else cols="12" class="ma-0 pa-0">
      <v-row no-gutters class="ma-0 pa-0" dir="ltr">
        <v-col cols="4" v-for="prod in getCurrentShopProducts" :key="prod.id" class="ma-0 pa-0">
          <ProductPreview :product="prod" />
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ProductPreview from '@/components/ProductPreview.vue'

export default {
  name: 'DashboardPage',
  components: {
    ProductPreview
  },
  layout: 'panel',
  data () {
    return {
      isLoadingPage: false
    }
  },
  async mounted () {
    this.isLoadingPage = true
    await this.getUserShops()
    if (this.getShops.length > 0) {
      await this.currentShopProducts()
    }
    this.isLoadingPage = false
  },
  methods: {
    ...mapActions('shop', ['getVendorShops', 'createShop', 'currentShopProducts']),

    async getUserShops () {
      await this.getVendorShops().catch((response) => {
        for (const key in response.data) {
          this.snackbarMessage = response.data[key][0]
          this.showSnackbar = true
        }
      })
    }
  },
  computed: {
    ...mapGetters('shop', ['getShops', 'getCurrentShopProducts']),

    getEmptyStateImageUrl() {
      return process.env.baseURL + 'media/source/empty_state.png'
    }
  }
}
</script>
