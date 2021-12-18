<template>
  <v-card>
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="validateAndSubmitForm"
    >
      <v-card-title>
        <div class="text-h6 font-weight-bold">تغییر قیمت محصول</div>
        <v-spacer />
        <v-btn icon @click.prevent="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-col class="py-0 px-8">
        <v-text-field
          v-model="price"
          label="قیمت"
          :rules="priceRules"
          type="number"
          suffix="تومان"
          prefix="000"
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
              ثبت قیمت
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
  name: 'ProductPriceForm',
  props: {
    isSubmittingForm: {
      type: Boolean,
      required: true
    },
    productPrice: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data () {
    return {
      price: '',
      priceText: '',
      priceRules: [
        value => !!value || 'قیمت را وارد کنید.',
        value => value >= 5 || 'قیمت نامعتبر است.',
        value => !value.includes('.') || 'قیمت نامعتبر است'
      ]
    }
  },
  watch: {
    price (newValue) {
      this.priceText = Num2persian(newValue + '000')
    }
  },
  mounted () {
    if (this.productPrice) {
      this.price = this.productPrice.toString()
      if (this.price) {
        this.price = (this.price / 1000).toString()
      }
    }
  },
  methods: {
    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        this.$emit('submit', Number.parseInt(this.price) * 1000)
      }
    }
  }
}
</script>
