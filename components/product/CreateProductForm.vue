<template>
  <v-card>
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="validateAndSubmitForm"
    >
      <v-card-title>
        <div class="text-h6 font-weight-bold">افزودن محصول</div>
        <v-spacer />
        <v-btn icon @click.prevent="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-col class="py-0 px-8">
        <v-text-field
          v-model="product.title"
          label="نام کالا"
          :rules="titleRules"
          outlined
          dense
        />
        <v-text-field
          v-model="product.description"
          label="توضیح"
          :rules="descriptionRules"
          outlined
          dense
        />
        <v-text-field
          v-model="product.originalPrice"
          label="قیمت"
          :rules="priceRules"
          type="number"
          suffix="تومان"
          :prefix="product.originalPrice ? '000' : ''"
          outlined
          dense
        />
      </v-col>
      <div v-show="priceText" class="px-8 pb-2 text-caption">{{ priceText }} تومان</div>

      <v-card-actions class="px-8 pb-5">
        <v-col cols="12">
          <v-row justify="center">
            <v-btn
              block
              class="primary font-weight-bold py-5"
              :loading="isSubmittingForm"
              type="submit"
            >
              ثبت
            </v-btn>
          </v-row>
        </v-col>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import Num2persian from 'num2persian'

export default {
  name: 'CreateProductForm',
  props: {
    imageId: {
      type: Number,
      required: true
    },
    isSubmittingForm: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      product: {
        image: this.imageId,
        title: '',
        description: '',
        originalPrice: ''
      },
      priceText: '',
      titleRules: [
        value => !!value || 'عنوان خالی است.',
        value => value.length <= 30 || 'عنوان طولانی است.'
      ],
      descriptionRules: [
        value => value.length <= 50 || 'توضیحات بسیار طولانی است.'
      ],
      priceRules: [
        value => !!value || 'قیمت را وارد کنید.',
        value => value >= 5 || 'قیمت بسیار پایین است.',
        value => !value.includes('.') || 'قیمت نامعتبر است'
      ]
    }
  },
  computed: {
    price () {
      // need for watch (because can not watch a property of object (product.originalPrice))
      return this.product.originalPrice * 1000
    }
  },
  watch: {
    price (newValue) {
      this.priceText = Num2persian(newValue)
    }
  },
  methods: {
    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        const prod = { ...this.product }
        prod.originalPrice = this.product.originalPrice * 1000
        this.$emit('submit', prod)
      }
    }
  }
}
</script>
