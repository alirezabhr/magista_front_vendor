<template>
  <v-card class="pb-4">
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="validateAndSubmitForm"
    >
      <v-card-title>
        <v-col>
          <div class="text-h6 font-weight-bold">ثبت نام در مگیستا</div>
          <div class="text-subtitle-2 font-weight-light pt-2">رمز عبور خود را انتخاب کنید.</div>
        </v-col>
      </v-card-title>

      <v-col class="py-0 px-8">
        <v-text-field
          v-model="password"
          :prepend-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="passwordRules"
          :type="showPassword ? 'text' : 'password'"
          label="رمز عبور جدید"
          hint="حداقل 8 کاراکتر"
          outlined
          dense
          class="py-2"
          style="direction: ltr"
          @click:prepend="showPassword = !showPassword"
        />
      </v-col>

      <v-card-actions class="px-8">
        <v-btn
          block
          rounded
          class="primary font-weight-bold py-5"
          type="submit"
          :loading="isSubmittingPassword"
          :disabled="isSubmittingPassword"
        >
          ثبت رمز عبور و ورود
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'SignupPasswordForm',
  props: {
    isSubmittingPassword: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      password: '',
      showPassword: false,
      passwordRules: [
        value => !!value || 'رمز عبور الزامی می‌باشد.',
        v => v.length >= 8 || 'رمز عبور باید حداقل 8 کاراکتر باشد.'
      ]
    }
  },
  methods: {
    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        this.$emit('submitForm', this.password)
      }
    }
  }
}
</script>
