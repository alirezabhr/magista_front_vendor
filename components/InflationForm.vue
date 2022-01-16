<template>
  <v-card>
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="validateAndSubmitForm"
    >
      <v-card-title>
        <div class="text-h6 font-weight-bold">افزایش قیمت سراسری</div>
        <v-spacer />
        <v-btn icon @click.prevent="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        بعد از ثبت درصد و انتخاب گزینه افزایش، قیمت تمامی محصولات فروشگاه شما به اندازه درصد وارد شده به صورت حدودی افزایش می‌کند.
      </v-card-text>

      <v-card-text class="pt-1">
        مثال: قیمت محصولی 148500تومان است. بعد از 13 درصد افزایش، قیمت 167800 تومان می‌شود
      </v-card-text>

      <v-col class="py-0 px-8">
        <v-text-field
          v-model="inflationPercent"
          label="درصد افزایش"
          :rules="inflationPercentRules"
          type="number"
          prefix="%"
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
              افزایش
            </v-btn>
          </v-row>
        </v-col>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'InflationForm',
  props: {
    isSubmittingForm: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      inflationPercent: '',
      inflationPercentRules: [
        value => !!value || 'درصد افزایش را وارد کنید.',
        value => value > 0 || 'درصد نامعتبر است.',
        value => value <= 99 || 'درصد نامعتبر است.',
        value => !value.includes('.') || 'درصد نامعتبر است.'
      ]
    }
  },
  methods: {
    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        this.$emit('submit', Number.parseInt(this.inflationPercent))
      }
    }
  }
}
</script>
