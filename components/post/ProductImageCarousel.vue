<template>
  <div v-if="productImages.length === 0">
    <v-skeleton-loader
      class="ma-0 pa-0"
      type="card"
    />
  </div>
  <div v-else>
    <v-carousel
      id="imageFrame"
      v-model="carouselIndex"
      :show-arrows="false"
      :hide-delimiters="true"
      :touchless="isTouchingTag"
      class="pa-0 ma-0"
      height="100%"
    >
      <v-carousel-item
        v-for="productImage in productImages"
        :key="productImage.id"
      >
        <v-img
          :src="productImageUrl(productImage.displayImage)"
          :aspect-ratio="1"
          style="cursor: pointer;"
          @click.prevent="tapOnImage"
          @drop="onDrop($event)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div v-for="prod in productImage.products" v-show="showProductTags" :key="prod.id">
            <div
              draggable
              @dragstart="startDrag($event, prod)"
            >
              <ProductTag :product="prod" :image-clicked="imageClickTrigger" @tagTouched="touchTag" />
            </div>
          </div>
          <v-row v-show="!showProductTags && productImage.products.length > 0" class="shop-icon grey darken-4 rounded-circle pa-1" justify="center" align="center" no-gutters>
            <v-icon color="white">mdi-shopping-outline mdi-18px</v-icon>
          </v-row>
        </v-img>
      </v-carousel-item>
    </v-carousel>
    <!-- delimiter -->
    <v-row v-if="productImages.length > 1" justify="center" no-gutters>
      <v-card
        v-for="i in productImages.length"
        :key="i"
        class="ma-1"
        height="8px"
        width="8px"
        :color="i === carouselIndex+1 ? 'black' : 'grey' "
        @click.prevent="carouselIndex = i-1"
      />
    </v-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import ProductTag from '@/components/product/ProductTag'

export default {
  name: 'ProductImageCarousel',
  components: {
    ProductTag
  },
  props: {
    productImages: {
      type: Array,
      required: true
    },
    triggerShowProductTags: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      carouselIndex: 0,
      showProductTags: false,
      isTouchingTag: false,
      imageClickTrigger: false
    }
  },
  watch: {
    carouselIndex (newValue) {
      this.$emit('changeCarouselIndex', newValue)
    },
    triggerShowProductTags (_) {
      this.showProductTags = true
    }
  },
  methods: {
    ...mapActions('product', ['changeTagLocation']),

    productImageUrl (src) {
      return process.env.baseURL + src
    },
    touchTag (val) {
      this.isTouchingTag = val
    },
    tapOnImage () {
      this.showProductTags = !this.showProductTags

      // this is because of watch in product tag component to close the product menu when the image tapped
      this.imageClickTrigger = !this.imageClickTrigger
    },
    startDrag (evt, product) {
      // this method works for pc and laptop browsers. (Touchable devices are not supported)
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('draggedProductId', product.id)
      evt.dataTransfer.setData('draggedProductTagX', product.tag.x)
      evt.dataTransfer.setData('draggedProductTagY', product.tag.y)
      evt.dataTransfer.setData('firstX', evt.clientX)
      evt.dataTransfer.setData('firstY', evt.clientY)
    },
    onDrop (evt) {
      // this method works for pc and laptop browsers. (Touchable devices are not supported)
      const productId = Number.parseInt(evt.dataTransfer.getData('draggedProductId'))
      const productTagX = Number.parseInt(evt.dataTransfer.getData('draggedProductTagX'))
      const productTagY = Number.parseInt(evt.dataTransfer.getData('draggedProductTagY'))
      const width = document.getElementById('imageFrame').offsetWidth
      const deltaX = ((evt.clientX - Number.parseInt(evt.dataTransfer.getData('firstX'))) * 100) / width
      const deltaY = ((evt.clientY - Number.parseInt(evt.dataTransfer.getData('firstY'))) * 100) / width

      const newX = productTagX + Number.parseInt(deltaX)
      const newY = productTagY - Number.parseInt(deltaY)
      const payloadData = {
        x: newX,
        y: newY,
        product: productId
      }

      if (newX < 0) {
        payloadData.x = 1
      }
      if (newY < 0) {
        payloadData.y = 1
      }

      this.changeTagLocation(payloadData)
    }
  }
}
</script>

<style scoped>
.shop-icon {
  cursor: pointer;
  left: 2%;
  bottom: 2%;
  position: absolute;
}
</style>
