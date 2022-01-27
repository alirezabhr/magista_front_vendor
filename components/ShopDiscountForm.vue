<template>
  <v-card>
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="validateAndSubmitForm"
    >
      <v-card-title>
        <div class="text-h6 font-weight-bold">ساخت بُن تخفیف</div>
        <v-spacer />
        <v-btn icon @click.prevent="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        برای فروشگاهتان بُن تخفیف صادر کنید و به دوستان و مشتریان خود بدهید
      </v-card-text>

      <v-col class="py-0 px-8">
        <v-text-field
          v-model="shopDiscountData.percent"
          label="درصد تخفیف"
          :rules="discountPercentRules"
          type="number"
          prefix="%"
          outlined
          dense
        />
        <v-text-field
          v-model="shopDiscountData.description"
          label="توضیح تخفیف"
          :rules="discountDescriptionRules"
          outlined
          dense
        />
        <v-switch
          v-model="countLimit"
          color="orange"
          :label="countLimit ? 'با محدودیت تعداد' : 'بدون محدودیت تعداد'"
        />
        <v-text-field
          v-if="countLimit"
          v-model="shopDiscountData.count"
          label="تعداد بن"
          :rules="discountCountRules"
          type="number"
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
              type="submit"
            >
              صدور بُن
            </v-btn>
          </v-row>
        </v-col>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ShopDiscountForm',
  data () {
    return {
      countLimit: false,
      shopDiscountData: {
        percent: '',
        description: '',
        count: null
      },
      discountPercentRules: [
        value => !!value || 'درصد تخفیف را وارد کنید.',
        value => value > 0 || 'تخفیف نامعتبر است.',
        value => value <= 99 || 'تخفیف نامعتبر است.',
        value => !value.includes('.') || 'تخفیف نامعتبر است.'
      ],
      discountDescriptionRules: [
        value => value.length <= 200 || 'توضیحات بسیار طولانی است.'
      ],
      discountCountRules: [
        value => value > 0 || 'تعداد بن نامعتبر است.',
        value => value <= 999 || 'تعداد بن نامعتبر است.'
      ],
      isSubmittingForm: false
    }
  },
  methods: {
    ...mapActions('shop/discount', ['createDiscounts']),

    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        const payload = { ...this.shopDiscountData }
        if (this.shopDiscountData.count && this.countLimit) {
          payload.count = Number.parseInt(this.shopDiscountData.count)
        } else {
          payload.count = null
        }
        payload.percent = Number.parseInt(this.shopDiscountData.percent)

        this.isSubmittingForm = true
        this.createDiscounts(payload).then(() => {
          this.isSubmittingForm = false
          this.$emit('close')
        })
      }
    }
  }
}
</script>
