<template>
  <div>
    <v-dialog
      v-model="showDialog"
      max-width="600px"
    >
      <ProductPriceForm
        v-if="productForm === 'price'"
        :is-submitting-form="isSubmittingForm"
        :product-price="product.originalPrice"
        @submit="submitProductPriceForm"
        @close="showDialog = false"
      />
      <ProductDiscountForm
        v-else-if="productForm === 'discount'"
        :is-submitting-form="isSubmittingForm"
        :product-price="product.originalPrice"
        @submit="submitProductDiscountForm"
        @close="showDialog = false"
      />
      <ProductEditForm
        v-else-if="productForm === 'edit'"
        :is-submitting-form="isSubmittingForm"
        :product-title="product.title"
        :product-description="product.description"
        @submit="submitProductEditForm"
        @close="showDialog = false"
      />
      <ProductAttributesForm
        v-else-if="productForm === 'attributes'"
        :product="product"
        @close="showDialog = false"
      />
    </v-dialog>
    <v-menu offset-y>
      <template #activator="{ on, attrs }">
        <!-- TAG COMPONENT -->
        <div
          class="tag"
          :style="`left: ${tag.x}%; bottom: ${tag.y}%;`"
          style="transform: translate(-50%, 100%); max-width: 130px;"
          v-bind="attrs"
          v-on="on"
          @touchstart="touchStart($event)"
          @touchmove.prevent="touchMove($event)"
          @touchend.prevent="touchEnd()"
        >
          <div class="arrow-up" style="opacity: 85%;" />
          <v-card
            rounded="md"
            color="black"
            max-width="130"
            style="opacity: 85%;"
            class="px-3 py-1"
            flat
          >
            <div class="white--text font-weight-bold text-caption text-truncate pb-1">{{ product.title }}</div>
            <v-row v-if="product.discountPercent" class="px-1 white--text font-weight-light text-decoration-line-through" style="font-size: .600rem;" no-gutters>
              {{ product.originalPrice }}
            </v-row>
            <v-row class="white--text font-weight-medium text-caption px-1" no-gutters>
              {{ product.finalPrice }}
              <v-spacer />
              <span class="currency">تومان</span>
            </v-row>
          </v-card>
        </div>
      </template>
      <v-list>
        <v-list-item
          v-for="(option, index) in productOptions"
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
  </div>
</template>

<script lang="ts">
import { mapActions, mapMutations } from 'vuex'
import { PropType } from 'vue'

import Product from '@/models/product'
import ProductPriceForm from '@/components/product/ProductPriceForm.vue'
import ProductEditForm from '@/components/product/ProductEditForm.vue'
import ProductDiscountForm from '@/components/product/ProductDiscountForm.vue'
import ProductAttributesForm from '@/components/product/ProductAttributesForm.vue'

export default {
  name: 'ProductTag',
  components: {
    ProductPriceForm,
    ProductEditForm,
    ProductDiscountForm,
    ProductAttributesForm
  },
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  data () {
    return {
      touchFirstX: 0,
      touchFirstY: 0,
      tagFirstX: 0,
      tagFirstY: 0,
      productOptions: [
        { title: 'تغییر قیمت', color: 'black', icon: { name: 'mdi-trending-up mdi-18px', color: 'grey darken-2' }, form: 'price' },
        { title: 'تغییر توضیحات', color: 'black', icon: { name: 'mdi-pencil mdi-18px', color: 'grey darken-2' }, form: 'edit' },
        { title: 'اعمال تخفیف', color: 'black', icon: { name: 'mdi-label-percent-outline mdi-flip-h mdi-18px', color: 'grey darken-2' }, form: 'discount' },
        { title: 'مشخصات کالا', color: 'black', icon: { name: 'mdi-tag-outline mdi-18px', color: 'grey darken-2' }, form: 'attributes' },
        { title: 'حذف تخفیف', color: 'black', icon: { name: 'mdi-cash-remove mdi-18px', color: 'grey darken-2' }, form: 'removeDiscount' },
        { title: 'حذف محصول', color: 'red', icon: { name: 'mdi-delete-outline mdi-18px', color: 'red' }, form: 'delete' }
      ],
      showDialog: false,
      productForm: '',
      isSubmittingForm: false
    }
  },
  computed: {
    tag: {
      // getter
      get () {
        return this.product.tag
      },
      // setter
      set (newValue) {
        newValue.product = this.product.id
        this.changedTagLocation(newValue)
      }
    }
  },
  methods: {
    ...mapActions('product', ['editProduct', 'createProductDiscount', 'changeTagLocation']),
    ...mapMutations('product', ['changedTagLocation']),

    touchStart (e: any) {
      this.touchFirstX = e.touches[0].clientX
      this.touchFirstY = e.touches[0].clientY
      this.tagFirstX = this.tag.x
      this.tagFirstY = this.tag.y
    },
    touchMove (e: any) {
      const imageObj = document.getElementById('imageFrame')
      if (imageObj) {
        const imageWidth = imageObj.offsetWidth

        const deltaX = (e.touches[0].clientX - this.touchFirstX) * 100 / imageWidth
        const deltaY = (this.touchFirstY - e.touches[0].clientY) * 100 / imageWidth
        const tagLastX = this.tagFirstX
        const tagLastY = this.tagFirstY

        this.tag = { x: tagLastX + deltaX, y: tagLastY + deltaY }
      }
    },
    touchEnd () {
      console.log('end')
      const payload = {
        x: Number.parseInt(this.tag.x),
        y: Number.parseInt(this.tag.y),
        product: this.product.id
      }
      if (payload.x <= 0 || payload.x >= 100 || payload.y <= 0 || payload.y >= 100) {
        this.tag = { x: this.tagFirstX, y: this.tagFirstY }
      } else {
        this.changeTagLocation(payload)
      }
    },

    optionsOnClick (formName: string) {
      this.showDialog = true
      this.productForm = formName
    },
    async submitProductEditForm (newTitle: string, newDescription: string) {
      const prod = { ...this.product }
      prod.title = newTitle
      prod.description = newDescription

      if (!this.isSubmittingForm) {
        this.isSubmittingForm = true
        await this.editProduct(prod).then(() => {
          this.showDialog = false
          this.productForm = ''
        })
        this.isSubmittingForm = false
      }
    },
    async submitProductPriceForm (newPrice: number) {
      const prod = { ...this.product }
      prod.originalPrice = newPrice

      if (!this.isSubmittingForm) {
        this.isSubmittingForm = true
        await this.editProduct(prod).then(() => {
          this.showDialog = false
          this.productForm = ''
        })
        this.isSubmittingForm = false
      }
    },
    async submitProductDiscountForm (discountPercent: number, discountAmount: number, discountDescription: string) {
      const discountItem = {
        percent: discountPercent,
        amount: discountAmount,
        description: discountDescription,
        product: this.product.id
      }

      if (!this.isSubmittingForm) {
        this.isSubmittingForm = true
        await this.createProductDiscount(discountItem).then(() => {
          this.showDialog = false
          this.productForm = ''
        })
        this.isSubmittingForm = false
      }
    }
  }
}
</script>

<style scoped>
.tag {
  position: absolute;
  -webkit-transform: scale(0);
  transform: scale(0);
  -webkit-transform-origin: center top;
  transform-origin: center top;
  -webkit-transition-duration: .2s;
  transition-duration: .2s;
  -webkit-transition-property: opacity,-webkit-transform;
  transition-property: transform,opacity;
  transition-property: transform,opacity,-webkit-transform;
  -webkit-transition-timing-function: cubic-bezier(.16,1.275,.725,1.255);
  transition-timing-function: cubic-bezier(.16,1.275,.725,1.255);
}
.arrow-up {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid black;
  margin-right: 40%;
}
.currency {
  -webkit-text-size-adjust: 100%;
    direction: rtl;
    list-style: none;
    text-align: center;
    -webkit-box-direction: normal;
    box-sizing: inherit;
    outline: none!important;
    font-size: .540rem;
    line-height: 21px;
}
</style>
