<template>
  <NuxtLink :to="productRoute(post.shortcode)">
    <v-card flat rounded="0">
      <v-img
        :aspect-ratio="1"
        :src="productImageUrl((post.productImages)[0].displayImage)"
      >
        <v-overlay
          absolute
          :value="!post.hasProduct"
          class="my-overlay"
        >
          <v-img :src="noProductImage" :aspect-ratio="1" />
        </v-overlay>
      </v-img>
    </v-card>
  </NuxtLink>
</template>

<script lang="ts">
import { PropType } from 'vue'
import Post from '~/models/post'

export default {
  name: 'PostPreview',
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true
    }
  },
  computed: {
    noProductImage () {
      // TODO image should change to no product
      return require('~/assets/images/no_price.png')
    }
  },
  methods: {
    productImageUrl (src: string) {
      return process.env.baseURL + src
    },
    productRoute (shortcode: string) {
      return `product/${shortcode}`
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
