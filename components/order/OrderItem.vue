<template>
  <v-col cols="11" class="pa-0">
    <v-card outlined class="mb-2">
      <v-row class="pa-2" no-gutters>
        <v-col cols="3">
          <v-card outlined>
            <v-img
              :aspect-ratio="1"
              :src="getFullImageUrl(orderItem.product.displayImageUrl)"
            >
              <template #placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center" no-gutters>
                  <v-progress-circular indeterminate color="grey lighten-2" />
                </v-row>
              </template>
            </v-img>
          </v-card>
        </v-col>
        <v-col cols="1" class="" align-self="center">
          <v-row class="font-weight-bold" justify="center" no-gutters>
            ×{{ orderItem.count }}
          </v-row>
        </v-col>
        <v-col cols="7">
          <v-row no-gutters>
            <div class="text-truncate">
              {{ orderItem.product.title }}
            </div>
          </v-row>
          <v-row class="font-weight-bold" no-gutters>
            {{ orderItem.price }} تومان
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import { PropType } from 'vue'
import OrderItem from '~/models/order_item'

export default {
  name: 'OrderItem',
  props: {
    orderItem: {
      type: Object as PropType<OrderItem>,
      required: true
    }
  },
  methods: {
    getFullImageUrl (src: string) {
      return process.env.baseURL + src
    }
  }
}
</script>
