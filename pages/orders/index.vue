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
        <v-col v-if="order.status > 1" cols="11">
          <v-card elevation="6" color="grey lighten-3">
            <v-col>
              <v-card-title class="pt-0 pb-6">
                وضعیت:
                {{ order.statusText }}
              </v-card-title>
              <v-card-subtitle class="py-0">
                {{ order.createdAt }}
              </v-card-subtitle>
              <v-card-subtitle class="py-0">
                گیرنده:
                {{ order.customer.name }}
              </v-card-subtitle>
              <v-card-subtitle class="py-0">
                <v-icon>mdi-map-marker-outline</v-icon>
                {{ order.customer.province }} -
                {{ order.customer.city }} -
                {{ order.customer.address }}
              </v-card-subtitle>
              <v-divider class="mt-2 pb-6" />
              <div class="py-2">
                <v-row v-for="(orderItem, i) in order.orderItems" :key="i" class="px-2" justify="center">
                  <OrderItem :order-item="orderItem" />
                </v-row>
              </div>
              <v-row class=" py-2 px-3 text-subtitle1" no-gutters>
                قیمت کل:
                {{ order.totalPrice }}
                تومان
              </v-row>

              <!-- if order status is paid -->
              <v-row v-if="order.status === 2" no-gutters justify="space-around">
                <v-btn color="red lighten-1" class="white--text" @click.prevent="cancelOrder(order)">لغو</v-btn>
                <v-btn color="green" class="white--text font-weight-bold" @click.prevent="verifyOrder(order)">تایید سفارش</v-btn>
              </v-row>
              <!-- if order status is verified -->
              <v-row v-else-if="order.status === 3" no-gutters justify="center">
                <v-btn color="green" class="white--text font-weight-bold" @click.prevent="orderHadSent(order)">ارسال شد</v-btn>
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
import OrderStatus from '@/models/order_status'

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
    ...mapActions('order', ['shopOrders', 'editOrder']),

    async verifyOrder (order) {
      const o = { ...order }
      o.status = OrderStatus.VERIFIED
      await this.editOrder(o)
    },
    async cancelOrder (order) {
      const o = { ...order }
      o.status = OrderStatus.CANCELED
      await this.editOrder(o)
    },
    async orderHadSent (order) {
      const o = { ...order }
      o.status = OrderStatus.SHIPPED
      await this.editOrder(o)
    }
  }
}
</script>
