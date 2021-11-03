<template>
  <v-card class="pb-4">
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="validateAndSubmitForm"
    >
      <v-card-title>
        <v-col>
          <div class="text-h6 font-weight-bold">ورود در مگیستا</div>
          <div class="text-subtitle-2 grey--text text--darken-1 pt-2">شما قبلا در مگیستا ثبت‌نام کرده‌اید. لطفا رمز عبور خود را وارد کنید.</div>
        </v-col>
      </v-card-title>

      <v-col class="py-0 px-8">
        <v-text-field
          v-model="password"
          :prepend-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="passwordRules"
          :type="showPassword ? 'text' : 'password'"
          label="رمز عبور"
          hint="حداقل 8 کاراکتر"
          outlined
          dense
          class="py-2"
          style="direction: ltr"
          @click:prepend="showPassword = !showPassword"
        />
      </v-col>

      <v-card-actions>
        <v-col>
          <v-row class="px-8">
            <v-btn
              block
              rounded
              class="primary font-weight-bold py-5"
              type="submit"
              :loading="isSubmittingPassword"
            >
              ورود
            </v-btn>
          </v-row>
          <v-row justify="center">
            <v-btn
              text
              color="primary"
              class="text-subtitle-2 my-4 px-2"
              @click.prevent="$emit('changePhone')"
            >
              <v-icon left>
                mdi-pencil
              </v-icon>
              تغییر شماره موبایل
            </v-btn>
            <v-spacer />
            <v-btn
              text
              color="primary"
              class="text-subtitle-2 my-4 px-2"
              @click.prevent="$emit('forgetPassword')"
            >
              رمز عبورم را فراموش کرده‌ام
            </v-btn>
          </v-row>
        </v-col>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'LoginPasswordForm',
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
        value => !!value || '.رمز عبور الزامی می‌باشد',
        v => v.length >= 8 || '.رمز عبور باید حداقل 8 کاراکتر باشد'
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
