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
      <v-dialog
        v-model="showDialog"
        max-width="600px"
      >
        <ProductPriceForm
          v-if="productForm === 'price'"
          :is-submitting-form="isSubmittingForm"
          :product-price="getProduct.originalPrice"
          @submit="submitProductPriceForm"
          @close="showDialog = false"
        />
        <ProductDiscountForm
          v-else-if="productForm === 'discount'"
          :is-submitting-form="isSubmittingForm"
          :product-price="getProduct.originalPrice"
          @submit="submitProductDiscountForm"
          @close="showDialog = false"
        />
        <ProductEditForm
          v-else-if="productForm === 'edit'"
          :is-submitting-form="isSubmittingForm"
          :product-title="getProduct.title"
          :product-description="getProduct.description"
          @submit="submitProductEditForm"
          @close="showDialog = false"
        />
        <ProductAttributesForm
          v-else-if="productForm === 'attributes'"
          @close="showDialog = false"
        />
      </v-dialog>
      <v-row dir="ltr" no-gutters class="px-2 py-1 white" align="center">
        <v-avatar color="primary" style="border-style: solid;">
          <img
            :src="getProfilePhotoUrl"
            alt="profile"
          >
        </v-avatar>
        <div class="pl-3">{{ getCurrentShop.instagramUsername }}</div>
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
              @click.prevent="optionsOnClick(option.form)"
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
      <div
        v-for="(productImage, i) in getPost.productImages"
        :key="i"
      >
        <v-carousel
          v-model="carouselIndex"
          :show-arrows="getPost.productImages.length > 1"
          :hide-delimiters="getPost.productImages.length <= 1"
          hide-delimiter-background
          class="pa-0 ma-0"
          height="100%"
        >
          <v-carousel-item>
            <v-img :src="productImageUrl(productImage)" :aspect-ratio="1" @click.prevent="showProductTags = !showProductTags">
              <div v-for="prod in productImage.products" v-show="showProductTags" :key="prod.id" @click="t()">
                <ProductTag :product="prod" />
              </div>
            </v-img>
          </v-carousel-item>
        </v-carousel>
        <v-col class="pa-3" no-gutters>
          <div v-for="product in productImage.products" :key="product.id" @click="t()">
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
                <div v-if="product.rate">
                  ({{ product.rate }})
                </div>
                <div v-else>
                  بدون نظر
                </div>
              </div>
            </v-row>
            <v-row no-gutters class="px-1">
              قیمت:
              <v-row v-if="product.originalPrice" no-gutters class="pr-2">
                <div v-show="product.discountPercent" class="pr-2 text-decoration-line-through">
                  {{ product.originalPrice }}
                </div>
                <v-icon v-show="product.discountPercent" class="pr-1">mdi-chevron-triple-left</v-icon>
                <div>
                  {{ product.finalPrice }}
                </div>
                تومان
              </v-row>
              <div v-else>
                ندارد
              </div>
            </v-row>
            <v-row no-gutters class="px-1 pb-3">
              تخفیف:
              <div v-if="product.discountPercent" class="px-2 font-weight-bold">
                <v-icon color="grey darken-2">mdi-percent mdi-18px</v-icon>
                {{ product.discountPercent }}
              </div>
              <div v-else>
                ندارد
              </div>
            </v-row>
            <v-col v-if="product.attributes.length > 0" class="px-0 py-3">
              <div class="font-weight-bold text-body-2" no-gutters>مشخصات محصول</div>
              <v-row v-for="(attr, index) in product.attributes" :key="index" no-gutters>
                {{ attr.name }}:  {{ attr.value }}
              </v-row>
            </v-col>
            <v-divider />
          </div>
        </v-col>
      </div>
      <v-col class="pa-3" no-gutters>
        <v-row v-if="getPost.description" class="font-weight-light" no-gutters>
          <div class="font-weight-bold text-body-2" no-gutters>توضیح پُست</div>
          {{ getPost.description }}
        </v-row>
      </v-col>
    </v-card>
  </v-col>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ProductTag from '@/components/product/ProductTag'
import ProductPriceForm from '@/components/product/ProductPriceForm'
import ProductEditForm from '@/components/product/ProductEditForm'
import ProductDiscountForm from '@/components/product/ProductDiscountForm'
import ProductAttributesForm from '@/components/product/ProductAttributesForm'

export default {
  name: 'ProductShortcodePage',
  components: {
    ProductTag,
    ProductPriceForm,
    ProductEditForm,
    ProductDiscountForm,
    ProductAttributesForm
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
        { title: 'افزودن محصول', color: 'black', icon: { name: 'mdi-plus mdi-18px', color: 'green darken-1' } },
        { title: 'توضیح پُست', color: 'black', icon: { name: 'mdi-pencil mdi-18px', color: 'grey darken-2' }, form: 'edit' }
      ],
      carouselIndex: 0,
      productOptions: [
        { title: 'تغییر قیمت', color: 'black', icon: { name: 'mdi-trending-up mdi-18px', color: 'grey darken-2' }, form: 'price' },
        { title: 'تغییر توضیحات', color: 'black', icon: { name: 'mdi-pencil mdi-18px', color: 'grey darken-2' }, form: 'edit' },
        { title: 'اعمال تخفیف', color: 'black', icon: { name: 'mdi-label-percent-outline mdi-flip-h mdi-18px', color: 'grey darken-2' }, form: 'discount' },
        { title: 'مشخصات کالا', color: 'black', icon: { name: 'mdi-tag-outline mdi-18px', color: 'grey darken-2' }, form: 'attributes' },
        { title: 'حذف تخفیف', color: 'black', icon: { name: 'mdi-cash-remove mdi-18px', color: 'grey darken-2' }, form: 'removeDiscount' },
        { title: 'حذف محصول', color: 'red', icon: { name: 'mdi-delete-outline mdi-18px', color: 'red' }, form: 'delete' }
      ],
      productForm: '',
      showDialog: false,
      isSubmittingForm: false
    }
  },
  computed: {
    ...mapGetters('shop', ['getCurrentShop']),
    ...mapGetters('product', ['getPost', 'getProduct']),

    getProfilePhotoUrl () {
      return process.env.baseURL + this.getCurrentShop.profileImageUrl
    }
  },
  methods: {
    ...mapActions('product', ['editProduct', 'createProductDiscount']),

    productImageUrl (productImage) {
      return process.env.baseURL + productImage.displayImage
    },
    t () {
      console.log('hello')
    },
    optionsOnClick (formName) {
      this.showDialog = true
      this.form = formName
    },
    async submitProductEditForm (newTitle, newDescription) {
      const prod = { ...this.getProduct }
      prod.title = newTitle
      prod.description = newDescription

      if (!this.isSubmittingForm) {
        this.isSubmittingForm = true
        await this.editProduct(prod).then(() => {
          this.showDialog = false
          this.form = ''
        })
        this.isSubmittingForm = false
      }
    },
    async submitProductPriceForm (newPrice) {
      const prod = { ...this.getProduct }
      prod.originalPrice = newPrice

      if (!this.isSubmittingForm) {
        this.isSubmittingForm = true
        await this.editProduct(prod).then(() => {
          this.showDialog = false
          this.form = ''
        })
        this.isSubmittingForm = false
      }
    },
    async submitProductDiscountForm (discountPercent, discountAmount, discountDescription) {
      const discountItem = {
        percent: discountPercent,
        amount: discountAmount,
        description: discountDescription
      }

      if (!this.isSubmittingForm) {
        this.isSubmittingForm = true
        await this.createProductDiscount(discountItem).then(() => {
          this.showDialog = false
          this.form = ''
        })
        this.isSubmittingForm = false
      }
    }
  }
}
</script>
