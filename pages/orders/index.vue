<template>
  <div v-if="isLoadingPage">
    <v-col cols="12">
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-col>
  </div>
  <div v-else>
    <v-col v-if="getInvoiceList.length === 0" cols="12">
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
    <v-col v-else cols="12" class="ma-0 pa-0">
      <v-row v-for="invoice in getInvoiceList" :key="invoice.id" no-gutters class="ma-0 pa-0">
        <v-card>
          <v-card-subtitle>
            {{ invoice.createdAt }}
          </v-card-subtitle>
          <v-row v-for="(orderItem, index) in invoice.orders" :key="index">
            <OrderItem :order="orderItem" />
          </v-row>
        </v-card>
      </v-row>
    </v-col>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import OrderItem from '~/models/order_item'

export default {
  name: 'OrdersPage',
  components: {
    OrderItem
  },
  layout: 'panel',
  data () {
    return {
      isLoadingPage: false
    }
  },
  computed: {
    ...mapGetters('invoice', ['getInvoiceList']),

    getEmptyStateImage () {
      return require('~/assets/images/empty_state.png')
    }
  },
  async mounted () {
    this.isLoadingPage = true
    await this.shopInvoices()
    this.isLoadingPage = false
  },
  methods: {
    ...mapActions('invoice', ['shopInvoices'])
  }
}
</script>
