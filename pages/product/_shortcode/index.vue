<template>
  <v-progress-circular indeterminate size="64" v-if="!getProduct" />
  <v-col v-else class="pa-0 mx-auto" cols="12" sm="8" md="7" lg="6">
    <v-card min-height="670">
        <v-dialog
          v-model="showDialog"
          max-width="600px"
        >
          <ProductPriceForm
            v-if="form === 'price'"
            :is-submitting-form="isSubmittingForm"
            :product-price="getProduct.finalPrice"
            @submit="submitProductPriceForm"
            @close="showDialog = false"
          />
          <ProductDiscountForm
            v-else-if="form === 'discount'"
            :is-submitting-form="isSubmittingForm"
            :product-price="getProduct.finalPrice"
            @submit="submitProductDiscountForm"
            @close="showDialog = false"
          />
          <ProductEditForm
            v-else-if="form === 'edit'"
            :is-submitting-form="isSubmittingForm"
            :product-title="getProduct.title"
            :product-description="getProduct.description"
            @submit="submitProductEditForm"
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
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon @click.prevent="" v-bind="attrs" v-on="on">
                        <v-icon color="grey darken-2">mdi-menu</v-icon>            
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                        v-for="(option, index) in options"
                        :key="index"
                        link
                        @click.prevent="optionsOnClick(option.form)"
                    >
                        <v-icon class="pl-2" :color="option.icon.color">
                            {{ option.icon.title }}
                        </v-icon>
                        <v-list-item-title :class="`${option.color}--text`">
                            {{ option.title }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-row>
        <v-img :src="productImageUrl" :aspect-ratio="1"/>
        <v-col class="pa-3" no-gutters>
            <v-row no-gutters align="center">
                <v-rating
                    v-model="getProduct.rate"
                    background-color="yellow accent-4"
                    color="yellow accent-4"
                    readonly
                    half-increments
                    dense
                    size="24"
                ></v-rating>
                <div class="grey-text text-darken-1 font-weight-light px-2">
                    <div v-if="getProduct.rate">
                        ({{ getProduct.rate }})
                    </div>
                    <div v-else>
                        بدون نظر
                    </div>
                </div>
            </v-row>
            <v-row no-gutters class="pb-2">
                <div v-if="getProduct.finalPrice">
                    قیمت: {{ getProduct.finalPrice }}تومان
                </div>
                <div v-else>
                    بدون قیمت
                </div>
            </v-row>
            <v-divider class="pa-1" />
            <v-row class="font-weight-bold" no-gutters>
                {{ getProduct.title }}
            </v-row>
            <v-row class="font-weight-light" no-gutters>
                {{ getProduct.description }}
            </v-row>
        </v-col>
    </v-card>
  </v-col>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import ProductPriceForm from '@/components/product/ProductPriceForm'
import ProductEditForm from '@/components/product/ProductEditForm'
import ProductDiscountForm from '@/components/product/ProductDiscountForm'

export default {
  name: 'ProductShortcodePage',
  components: {
    ProductPriceForm,
    ProductEditForm,
    ProductDiscountForm
  },
  async asyncData ({ params, store, error }) {
    await store.dispatch('product/productDetail', params.shortcode)
      .catch((response) => {
        if (response.status === 404) {
          error({ statusCode: 404, message: 'product not found' })
        } else {
          error({ statusCode: 500, message: 'Oops! An error occured.' })
        }
      })
  },
  data () {
    return {
        options: [
            {title: 'تغییر قیمت', color: 'black', icon: {title: 'mdi-trending-up mdi-18px', color: 'grey darken-2'}, form: 'price'},
            {title: 'اعمال تخفیف', color: 'black', icon: {title: 'mdi-percent mdi-18px', color: 'grey darken-2'}, form: 'discount'},
            {title: 'تغییر توضیحات', color: 'black', icon: {title: 'mdi-pencil mdi-18px', color: 'grey darken-2'}, form: 'edit'},
            {title: 'حذف محصول', color: 'red', icon: {title: 'mdi-delete-outline mdi-18px', color: 'red'}, form: 'delete'},
        ],
        form: '',
        showDialog: false,
        isSubmittingForm: false
    }
  },
  methods: {
    ...mapActions('product', ['editProduct', 'createProductDiscount']),

    optionsOnClick(formName) {
        this.showDialog = true
        this.form = formName
    },
    async submitProductEditForm(newTitle, newDescription) {
        let prod = {...this.getProduct}
        prod.title = newTitle
        prod.description = newDescription

        if (!this.isSubmittingForm) {
            this.isSubmittingForm = true
            await this.editProduct(prod).catch((response) => {
                console.log(response.error)
            })
            this.isSubmittingForm = false
        }
    },
    async submitProductPriceForm(newPrice) {
        let prod = {...this.getProduct}
        prod.finalPrice = newPrice

        if (!this.isSubmittingForm) {
            this.isSubmittingForm = true
            await this.editProduct(prod).catch((response) => {
                console.log(response.error)
            })
            this.isSubmittingForm = false
        }
    },
    async submitProductDiscountForm(discountPercent, discountAmount, discountDescription) {
        const discountItem ={
            percent: discountPercent,
            amount: discountAmount,
            description: discountDescription
        }
        
        if (!this.isSubmittingForm) {
            this.isSubmittingForm = true
            await this.createProductDiscount(discountItem).catch((response) => {
                console.log(response.data)
            })
            this.isSubmittingForm = false
        }
    }
  },
  computed: {
    ...mapGetters('shop', ['getCurrentShop']),
    ...mapGetters('product', ['getProduct']),

    getProfilePhotoUrl() {
      return process.env.baseURL + this.getCurrentShop.profileImageUrl
    },
    productImageUrl () {
      return process.env.baseURL + this.getProduct.displayImage
    }
  }
}
</script>
