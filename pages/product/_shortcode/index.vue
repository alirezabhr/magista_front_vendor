<template>
  <v-progress-circular v-if="!getPost" indeterminate size="64" />
  <v-col
    v-else
    class="pa-0 mx-auto"
    cols="12"
    sm="8"
    md="7"
    lg="6"
  >
    <v-card min-height="670">
      <v-row dir="ltr" no-gutters class="px-2 py-1 white" align="center">
        <NuxtLink to="/dashboard">
          <v-avatar color="primary" style="border: solid;">
            <v-img :src="getProfilePhotoUrl" alt="profile" />
          </v-avatar>
        </NuxtLink>
        <NuxtLink to="/dashboard" class="text-decoration-none" active-class="text-decoration-none">
          <div class="pl-3 font-weight-bold grey--text text--darken-4">{{ getCurrentShop.instagramUsername }}</div>
        </NuxtLink>
        <v-spacer />
        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" @click.prevent="" v-on="on">
              <v-icon color="grey darken-2">mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(option, index) in postOptions"
              :key="index"
              link
              @click.prevent="postOptionsOnClick(option.form)"
            >
              <v-icon class="pl-2" :color="option.icon.color">
                {{ option.icon.name }}
              </v-icon>
              <v-list-item-title :class="`${option.color}--text`">
                {{ option.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
      <div v-for="productImage in getPost.productImages" :key="productImage.id">
        <v-dialog
          v-model="showDialog"
          max-width="600px"
        >
          <CreateProductForm
            v-if="postForm === 'addProduct'"
            :is-submitting-form="isSubmittingForm"
            :image-id="productImage.id"
            @submit="submitCreateProductForm"
            @close="showDialog = false"
          />
        </v-dialog>
        <v-carousel
          v-model="carouselIndex"
          :show-arrows="getPost.productImages.length > 1"
          :hide-delimiters="getPost.productImages.length <= 1"
          hide-delimiter-background
          class="pa-0 ma-0"
          height="100%"
        >
          <v-carousel-item>
            <v-img
              id="imageFrame"
              :src="productImageUrl(productImage)"
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
                  <ProductTag :product="prod" :image-clicked="imageClickTrigger" />
                </div>
              </div>
              <v-row v-show="!showProductTags && productImage.products.length > 0" class="shop-icon grey darken-4 rounded-circle pa-1" justify="center" align="center" no-gutters>
                <v-icon color="white">mdi-shopping-outline mdi-18px</v-icon>
              </v-row>
            </v-img>
          </v-carousel-item>
        </v-carousel>
        <v-col class="pa-3" no-gutters>
          <div v-for="product in productImage.products" :key="product.id">
            <v-row class="font-weight-bold" no-gutters>
              {{ product.title }}
            </v-row>
            <v-row no-gutters align="center">
              <v-rating
                v-model="product.rate"
                background-color="yellow accent-4"
                color="yellow accent-4"
                readonly
                half-increments
                dense
                size="24"
              />
              <div class="grey-text text-darken-1 font-weight-light px-2">
                <div v-if="product.rate">({{ product.rate }})</div>
                <div v-else>بدون نظر</div>
              </div>
            </v-row>
            <v-row no-gutters class="px-1">
              قیمت:
              <v-row v-if="product.originalPrice" no-gutters class="pr-2">
                <div
                  v-show="product.discountPercent"
                  class="pr-2 text-decoration-line-through"
                >
                  {{ product.originalPrice }}
                </div>
                <v-icon v-show="product.discountPercent" class="pr-1">mdi-chevron-triple-left</v-icon>
                <div>
                  {{ product.finalPrice }}
                </div>
                تومان
              </v-row>
              <div v-else>ندارد</div>
            </v-row>
            <v-row no-gutters class="px-1">
              تخفیف:
              <div v-if="product.discountPercent" class="px-2 font-weight-bold">
                <v-icon color="grey darken-2">mdi-percent mdi-18px</v-icon>
                {{ product.discountPercent }}
              </div>
              <div v-else>ندارد</div>
            </v-row>
            <v-col v-if="product.attributes.length > 0" class="px-0 py-3">
              <div class="font-weight-bold text-body-2" no-gutters>
                مشخصات محصول
              </div>
              <v-row
                v-for="attr in product.attributes"
                :key="attr.id"
                no-gutters
              >
                {{ attr.name }}: {{ attr.value }}
              </v-row>
            </v-col>
            <div v-if="product.description" class="font-weight-bold text-body-2 pt-1">توضیحات</div>
            <v-row v-if="product.description" class="font-weight-light" no-gutters>
              {{ product.description }}
            </v-row>
            <div class="py-3">
              <v-divider />
            </div>
          </div>
        </v-col>
      </div>
      <v-col class="px-3 py-0" no-gutters>
        <v-row v-if="getPost.description" class="font-weight-light" no-gutters>
          <div class="font-weight-bold text-body-2" no-gutters>توضیح پُست</div>
          {{ getPost.description }}
        </v-row>
      </v-col>
    </v-card>
  </v-col>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import CreateProductForm from '@/components/product/CreateProductForm'
import ProductTag from '@/components/product/ProductTag'

export default {
  name: 'ProductShortcodePage',
  components: {
    CreateProductForm,
    ProductTag
  },
  async asyncData ({ params, store, error }) {
    await store.dispatch('product/postDetail', params.shortcode)
      .catch((response) => {
        if (response.status === 404) {
          error({ statusCode: 404, message: 'محصول یافت نشد.' })
        } else {
          error({ statusCode: 500, message: 'خطایی رخ داده است!' })
        }
      })
  },
  data () {
    return {
      showProductTags: true,
      postOptions: [
        {
          title: 'افزودن محصول',
          color: 'black',
          icon: { name: 'mdi-plus mdi-18px', color: 'green darken-1' },
          form: 'addProduct'
        },
        {
          title: 'توضیح پُست',
          color: 'black',
          icon: { name: 'mdi-pencil mdi-18px', color: 'grey darken-2' },
          form: 'editPost'
        }
      ],
      carouselIndex: 0,
      postForm: '',
      isSubmittingForm: false,
      showDialog: false,
      imageClickTrigger: false
    }
  },
  computed: {
    ...mapGetters('shop', ['getCurrentShop']),
    ...mapGetters('product', ['getPost']),

    getProfilePhotoUrl () {
      return process.env.baseURL + this.getCurrentShop.profileImageUrl
    }
  },
  methods: {
    ...mapActions('product', ['changeTagLocation', 'createNewProduct']),

    productImageUrl (productImage) {
      return process.env.baseURL + productImage.displayImage
    },
    postOptionsOnClick (form) {
      this.postForm = form
      this.showDialog = true
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
    },
    submitCreateProductForm (payload) {
      this.createNewProduct(payload).then(() => {
        this.isSubmittingForm = false
        this.postForm = ''
      })
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
