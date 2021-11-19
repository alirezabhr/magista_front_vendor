<template>
  <NuxtLink :to="productRoute(product.shortcode)">
    <v-card flat rounded="0">
      <v-img :aspect-ratio="1" :src="productImageUrl(product.displayImage)">
        <v-overlay
          absolute
          :value="!product.originalPrice"
          class="my-overlay"
        >
          <v-img :src="noPriceImage" :aspect-ratio="1"/>
        </v-overlay>
      </v-img>
    </v-card>
  </NuxtLink>
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
  methods: {
    productImageUrl (src: string) {
      return process.env.baseURL + src
    },
    productRoute (shortcode: string) {
      return `product/${shortcode}`
    }   
  },
  computed: {
    noPriceImage() {
      return require('~/assets/images/empty_state.png')
    }
  }
}
</script>

<style scoped>
  .my-overlay >>> .v-overlay__content {
    width: 100%;
    height: 100%;
  }
</style>