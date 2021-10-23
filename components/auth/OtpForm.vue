<template>
  <v-card class="pb-4">
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="validateAndSubmitForm"
    >
      <v-card-title>
        <v-col>
          <div class="text-h6 font-weight-bold">احراز هویت</div>
          <div class="text-subtitle-2 font-weight-light pt-2">کد فعالسازی ارسال شده به {{ phoneNumber }} را وارد نمایید.</div>
        </v-col>
      </v-card-title>

      <v-col class="py-0 px-8">
        <v-text-field
          v-model="otpCode"
          label="کد فعالسازی"
          :rules="otpRules"
          outlined
          dense
          class="py-2"
          type="number"
          style="direction: ltr"
        />
      </v-col>

      <v-card-actions class="px-8">
        <v-col>
          <v-btn
            block
            rounded
            class="primary font-weight-bold py-5"
            :loading="isSubmittingOtp"
            type="submit"
          >
            تایید
          </v-btn>
          <!-- <v-row justify="center">
          <v-btn text color="primary" class="text-subtitle-2 my-4 px-2">
            دریافت مجدد
          </v-btn>
        </v-row> -->
          <v-row justify="center">
            <v-btn
              text
              color="primary"
              class="text-subtitle-2 my-4 px-2"
              @click.prevent="$emit('changePhone')"
            >
              تغییر شماره موبایل
            </v-btn>
          </v-row>
        </v-col>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'OtpForm',
  props: {
    isSubmittingOtp: {
      type: Boolean,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      otpCode: '',
      otpRules: [
        value => !!value || '.کد فعالسازی را وارد کنید',
        value => !Number.isInteger(value) || '.کد نامعتبر است',
        value => !value.includes('.') || '.کد نامعتبر است'
      ]
    }
  },
  methods: {
    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        this.$emit('submitForm', this.otpCode)
      }
    }
  }
}
</script>
