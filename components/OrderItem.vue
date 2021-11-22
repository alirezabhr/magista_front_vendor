<template>
  <v-card flat rounded="lg">
    {{ order.count }}
  </v-card>
</template>

<script lang="ts">
import { PropType } from 'vue'
import OrderItem from '~/models/order_item'

export default {
  name: 'OrderItem',
  props: {
    order: {
      type: Object as PropType<OrderItem>,
      required: true
    }
  }
}
</script>
