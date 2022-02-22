<template>
  <v-card v-if="productPrice !== null">
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="validateAndSubmitForm"
    >
      <v-card-title>
        <div class="text-h6 font-weight-bold">اعمال تخفیف جدید</div>
        <v-spacer />
        <v-btn icon @click.prevent="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-col class="py-0 px-8">
        <v-row v-show="finalPrice" class="pb-2 text-body1" align="center" no-gutters>
          <div class="text-decoration-line-through font-weight-medium">{{ productPrice }}</div>
          <v-icon class="px-2">mdi-chevron-triple-left</v-icon>
          <div class="font-weight-bold primary--text">{{ finalPrice }}</div>
        </v-row>
        <v-text-field
          v-model="discountPercent"
          label="درصد تخفیف"
          :rules="discountPercentRules"
          type="number"
          prefix="%"
          outlined
          dense
        />
        <v-textarea
          v-model="discountDescription"
          label="توضیح (اختیاری)"
          :rules="discountDescriptionRules"
          outlined
          dense
        />
      </v-col>
      <v-card-actions class="px-8 pb-5 pt-4">
        <v-col cols="12">
          <v-row justify="center" no-gutters>
            <v-btn
              block
              class="primary font-weight-bold py-5"
              :loading="isSubmittingForm"
              :disabled="isSubmittingForm"
              type="submit"
            >
              ثبت تخفیف
            </v-btn>
          </v-row>
        </v-col>
      </v-card-actions>
    </v-form>
  </v-card>
  <v-card v-else class="py-2">
    <v-card-title>
      <v-row no-gutters>
        <v-icon color="red">mdi-alert-decagram-outline</v-icon>
        <div class="text-body2 pr-2 py-2">ابتدا قیمت محصول را وارد نمایید.</div>
      </v-row>
    </v-card-title>
    <v-card-text class="text-subtitle1 py-3">
      <div class="px-5">برای وارد کردن قیمت میتوانید از گزینه تغییر قیمت اقدام کنید.</div>
    </v-card-text>
    <v-card-actions>
      <v-btn text class="font-weight-light blue--text mx-auto" @click.prevent="$emit('close')">بستن</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'ProductDiscountForm',
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
      discountPercent: '',
      discountDescription: '',
      discountPercentRules: [
        value => !!value || 'درصد تخفیف را وارد کنید.',
        value => value > 0 || 'تخفیف نامعتبر است.',
        value => value <= 99 || 'تخفیف نامعتبر است.',
        value => !value.includes('.') || 'تخفیف نامعتبر است.'
      ],
      discountDescriptionRules: [
        value => value.length <= 300 || 'توضیحات بسیار طولانی است.'
      ]
    }
  },
  computed: {
    finalPrice () {
      let final = 0
      if (this.discountPercent >= 100 || this.discountPercent <= 0) {
        final = 0
      } else {
        const dAmount = this.productPrice * Number.parseInt(this.discountPercent) / 100
        final = this.productPrice - dAmount
        final = Number.parseInt(final)
      }
      return final
    }
  },
  methods: {
    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        this.$emit('submit', Number.parseInt(this.discountPercent), this.discountDescription)
      }
    }
  }
}
</script>
