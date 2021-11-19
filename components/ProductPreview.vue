<template>
  <v-card flat class="pa-0 ma-0 blue" rounded="0">
    <v-img :aspect-ratio="1" :src="this.productImageUrl" class="pa-0 ma-0" />
  </v-card>
</template>

<script lang="ts">
import { PropType } from 'vue'
import Product from '~/models/product'

export default {
  name: 'ProductPreview',
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  computed: {
    productImageUrl () {
      return process.env.baseURL + this.product.displayImage
    }
  }
}
</script>
