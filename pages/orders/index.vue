<template>
  <div v-if="isLoadingPage" style="height: 100%;">
    <v-row class="fill-height" align="center" justify="center" no-gutters>
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-row>
  </div>
  <div v-else>
    <v-col v-if="getOrderList.length === 0" cols="12">
      <v-row class="pa-10 text-h5 font-weight-bold grey--text" justify="center">
        هیچ سفارشی ندارید!
      </v-row>
      <v-row justify="center">
        <v-img
          contain
          max-height="250"
          max-width="250"
          :src="getEmptyStateImage"
        />
      </v-row>
    </v-col>
    <v-col v-else cols="12" class="ma-0 px-0 pt-0 pb-10">
      <v-row v-for="(order, index) in getOrderList" :key="index" no-gutters class="ma-0 py-4 px-0" justify="center">
        <OrderCard :order="order" />
      </v-row>
    </v-col>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import OrderCard from '~/components/order/OrderCard.vue'

export default {
  name: 'OrdersPage',
  components: {
    OrderCard
  },
  layout: 'panel',
  data () {
    return {
      isLoadingPage: false
    }
  },
  computed: {
    ...mapGetters('order', ['getOrderList']),
    ...mapGetters('shop', ['getCurrentShop']),

    getEmptyStateImage () {
      return require('~/assets/images/empty_state.png')
    }
  },
  async mounted () {
    this.isLoadingPage = true
    if (this.getCurrentShop) {
      await this.shopOrders()
    }
    this.isLoadingPage = false
  },
  methods: {
    ...mapActions('order', ['shopOrders'])
  }
}
</script>
