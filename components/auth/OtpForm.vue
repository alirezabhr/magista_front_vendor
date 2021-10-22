<template>
  <v-card class="pb-4">
    <v-card-title>
      <v-col>
        <div class="text-h6 font-weight-bold">ثبت‌نام در مگیستا</div>
        <div class="text-subtitle-2 font-weight-light pt-2">کد فعالسازی ارسال شده را وارد نمایید.</div>
      </v-col>
    </v-card-title>

    <v-col class="py-0 px-8">
      <v-text-field
        v-model="otpCode"
        label="کد فعالسازی"
        outlined
        dense
        class="py-2"
        type="number"
      />
    </v-col>

    <v-card-actions class="px-8">
      <v-col>
        <v-btn
          block
          rounded
          class="primary font-weight-bold py-5"
          :loading="isSubmittingOtp"
          @click.prevent="$emit('submitForm', otpCode)"
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
  </v-card>
</template>

<script>
export default {
  name: 'OtpForm',
  props: {
    isSubmittingOtp: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      otpCode: ''
    }
  }
}
</script>
