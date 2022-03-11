<template>
  <div>
    <v-dialog
      v-model="showDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          آیا سفارش را ارسال کرده‌اید؟
        </v-card-title>
        <v-card-actions class="justify-end">
          <v-btn text color="red" @click.prevent="showDialog=false">خیر</v-btn>
          <v-btn text color="green darken-1" class="mx-0 font-weight-bold" @click.prevent="orderHadSent()">ارسال کردم</v-btn>
        </v-card-actions>
      </v-card>
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
            <v-row v-for="(orderItem, i) in order.orderItems" :key="i" class="px-2" justify="center" no-gutters>
              <OrderItem :order-item="orderItem" />
            </v-row>
          </div>
          <v-row class="px-4 blue--text text--darken-2" no-gutters>
            روش ارسال انتخاب شده:
            <strong class="px-2">{{ orderDeliveryType }}</strong>
          </v-row>
          <v-col>
            <v-row class="text-subtitle-2" no-gutters>
              قیمت کالاها:
              {{ order.totalOrderItemsOriginalPrices }}
              تومان
            </v-row>
            <v-row class="text-subtitle-2" no-gutters>
              تخفیف‌ها:
              {{ order.totalDiscountAmount }}
              تومان
            </v-row>
            <v-row class="text-subtitle-2" no-gutters>
              ارسال:
              {{ order.deliveryCost }}
              تومان
            </v-row>
            <v-row class="text-subtitle-2 font-weight-bold" no-gutters>
              جمع:
              {{ order.finalPrice }}
              تومان
            </v-row>
          </v-col>

          <!-- if order status is paid -->
          <v-row v-if="order.status === orderStatus.PAID" justify="space-around" no-gutters>
            <v-btn color="red lighten-1" class="white--text" @click.prevent="cancelOrder()">لغو</v-btn>
            <v-btn color="green" class="white--text font-weight-bold" @click.prevent="verifyOrder()">تایید سفارش</v-btn>
          </v-row>
          <!-- if order status is verified -->
          <v-col v-else-if="order.status === orderStatus.VERIFIED" class="px-0 py-2">
            <div class="text-body-2 px-4 py-1">مهلت ارسال: {{ deliveryRemaining }}</div>
            <v-row v-if="deliveryRemainingHourMinuteObject.minutes >= 0" justify="center" no-gutters>
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
import OrderStatus from '@/models/order_status'

const deliveryTypeText = ['پست پیشتاز', 'پیک آنلاین']

export default {
  name: 'OrderCard',
  components: {
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
  computed: {
    orderDeliveryType () {
      if (this.order.delivery) {
        return deliveryTypeText[this.order.delivery.type]
      }
      return ''
    },
    deliveryRemainingHourMinuteObject () {
      const now = moment()
      const deadline = moment(this.order.verifiedAt).add(1, 'days')
      const hours = deadline.diff(now, 'hours')
      const minutes = deadline.diff(now, 'minutes') - hours * 60
      return { hours, minutes }
    },
    deliveryRemaining () {
      const hourMinuteObject = this.deliveryRemainingHourMinuteObject
      const hours = hourMinuteObject.hours
      const minutes = hourMinuteObject.minutes
      if (hours < 0) {
        return 'تمام شده'
      }
      return `${hours} ساعت و ${minutes} دقیقه`
    }
  },
  methods: {
    ...mapActions('order', ['editOrder']),

    async verifyOrder () {
      const o = { ...this.order }
      o.status = OrderStatus.VERIFIED
      await this.editOrder(o)
    },
    async cancelOrder () {
      const o = { ...this.order }
      o.status = OrderStatus.CANCELED
      await this.editOrder(o)
    },
    orderHadSent () {
      const o = { ...this.order }
      o.status = OrderStatus.SHIPPED
      this.isSubmitting = true

      this.editOrder(o).then(() => {
        this.isSubmitting = false
        this.showDialog = false
      })
    }
  }
}
</script>
