<template>
  <div>
    <v-dialog
      v-model="showDialog"
      max-width="600px"
    >
      <ChooseShippingOption
        :order="order"
        :is-submitting="isSubmitting"
        @submit="orderHadSent"
        @close="showDialog = false"
      />
    </v-dialog>
    <v-col v-if="order.status >= orderStatus.PAID" class="pa-0">
      <v-card elevation="6" color="grey lighten-3">
        <v-col>
          <v-card-title class="pt-0 pb-4">
            وضعیت:
            {{ order.statusText }}
          </v-card-title>
          <v-card-subtitle class="pt-0 pb-4">
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
          <v-card-subtitle class="py-0">
            کد پستی: {{ order.customer.postalCode }}
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
          <v-row v-if="order.status === orderStatus.PAID" no-gutters justify="space-around">
            <v-btn color="red lighten-1" class="white--text" @click.prevent="cancelOrder(order)">لغو</v-btn>
            <v-btn color="green" class="white--text font-weight-bold" @click.prevent="verifyOrder(order)">تایید سفارش</v-btn>
          </v-row>
          <!-- if order status is verified -->
          <v-col v-else-if="order.status === orderStatus.VERIFIED" class="px-0 py-2">
            <div class="text-body-2 px-4 py-1">مهلت ارسال: {{ deliveryDeadline(order) }}</div>
            <v-row justify="center" no-gutters>
              <v-btn color="green" class="white--text font-weight-bold" @click.prevent="showDialog = true">ارسال کردم</v-btn>
            </v-row>
          </v-col>
        </v-col>
      </v-card>
    </v-col>
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'
import OrderItem from '~/components/order/OrderItem.vue'
import ChooseShippingOption from '~/components/order/ChooseShippingOption.vue'
import OrderStatus from '@/models/order_status'

export default {
  name: 'OrderCard',
  components: {
    ChooseShippingOption,
    OrderItem
  },
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      orderStatus: OrderStatus,
      isSubmitting: false,
      showDialog: false
    }
  },
  methods: {
    ...mapActions('order', ['editOrder']),

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
    orderHadSent (order, shippingOpt) {
      const o = { ...order }
      o.status = OrderStatus.SHIPPED
      o.shippedBy = shippingOpt
      this.isSubmitting = true

      this.editOrder(o).then(() => {
        this.isSubmitting = false
        this.showDialog = false
      })
    },
    deliveryDeadline (order) {
      const now = moment()
      const deadline = moment(order.verifiedAt).add(1, 'days')
      const hours = deadline.diff(now, 'hours')
      const minutes = deadline.diff(now, 'minutes') - hours * 60
      return `${hours} ساعت و ${minutes} دقیقه`
    }
  }
}
</script>
