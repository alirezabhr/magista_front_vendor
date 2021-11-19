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
                outlined
                dense
            />
        </v-col>

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
export default {
  name: 'ProductPriceForm',
  props: {
    isSubmittingForm: {
      type: Boolean,
      required: true
    },
    productPrice: {
      type: Number,
      required: false
    }
  },
  mounted() {
    if (this.productPrice) {
      this.price = this.productPrice
    }
  },
  data () {
    return {
      price: '',
      priceRules: [
        value => !!value || 'قیمت را وارد کنید.',
        value => value >= 0 || '.قیمت نامعتبر است',
        value => !value.includes('.') || 'قیمت نامعتبر است'
      ],
    }
  },
  methods: {
    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        this.$emit('submit', Number.parseInt(this.price))
      }
    }
  }
}
</script>
