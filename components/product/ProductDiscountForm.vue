<template>
    <v-card>
        <v-form
            ref="form"
            lazy-validation
            @submit.prevent="validateAndSubmitForm"
        >
        <v-card-title>
            <div class="text-h6 font-weight-bold">اعمال تخفیف</div>
            <v-spacer />
            <v-btn icon @click.prevent="$emit('close')">
              <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-card-title>

        <v-col class="py-0 px-8">
            <v-text-field
                v-model="discount"
                label="درصد تخفیف"
                :rules="discountRules"
                type="number"
                prefix="%"
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
                        ثبت تخفیف
                    </v-btn>
                </v-row>
            </v-col>
        </v-card-actions>
        </v-form>
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
    productDiscount: {
      type: Number,
      required: false
    }
  },
  mounted() {
    if (this.productDiscount) {
      this.discount = this.productDiscount
    }
  },
  data () {
    return {
      discount: '',
      discountRules: [
        value => !!value || 'درصد تخفیف را وارد کنید.',
        value => value >= 0 || 'تخفیف نامعتبر است.',
        value => value <= 99 || 'تخفیف نامعتبر است.',
        value => !value.includes('.') || 'تخفیف نامعتبر است.'
      ],
    }
  },
  methods: {
    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        this.$emit('submit', Number.parseInt(this.discount))
      }
    }
  }
}
</script>
