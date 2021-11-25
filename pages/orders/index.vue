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
    <v-col v-if="getShopOrderList.length === 0" cols="12">
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
      <v-row v-for="(shopOrder, index) in getShopOrderList" :key="index" no-gutters class="ma-0 py-4 px-0" justify="center">
        <v-col cols="11">
          <v-card elevation="6" color="grey lighten-3">
            <v-col>
              <v-card-title class="pt-0 pb-6">
                وضعیت:
                {{ shopOrder.statusText }}
              </v-card-title>
              <v-card-subtitle class="py-0">
                {{ shopOrder.createdAt }}
              </v-card-subtitle>
              <v-card-subtitle class="py-0">
                گیرنده:
                {{ shopOrder.customer.name }}
              </v-card-subtitle>
              <v-card-subtitle class="py-0">
                <v-icon>mdi-map-marker-outline</v-icon>
                {{ shopOrder.customer.province }} -
                {{ shopOrder.customer.city }} -
                {{ shopOrder.customer.address }}
              </v-card-subtitle>
              <v-divider class="mt-2 pb-6" />
              <div class="py-2">
                <v-row v-for="(orderItem, i) in shopOrder.orderItems" :key="i" class="px-2" justify="center">
                  <OrderItem :order-item="orderItem" />
                </v-row>
              </div>
              <v-row class=" py-2 px-3 text-subtitle1" no-gutters>
                قیمت کل:
                {{ shopOrder.totalPrice }}
                تومان
              </v-row>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import OrderItem from '@/components/OrderItem.vue'

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
    ...mapGetters('shopOrder', ['getShopOrderList']),
    ...mapGetters('shop', ['getCurrentShop']),

    getEmptyStateImage () {
      return require('~/assets/images/empty_state.png')
    }
  },
  async mounted () {
    this.isLoadingPage = true
    if (this.getCurrentShop) {
      await this.shopShopOrders()
    }
    this.isLoadingPage = false
  },
  methods: {
    ...mapActions('shopOrder', ['shopShopOrders'])
  }
}
</script>
