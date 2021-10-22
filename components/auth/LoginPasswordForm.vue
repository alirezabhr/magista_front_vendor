<template>
  <v-card class="pb-4">
    <v-card-title>
      <v-col>
        <div class="text-h6 font-weight-bold">ورود در مگیستا</div>
        <div class="text-subtitle-2 grey--text text--darken-1 pt-2">شما قبلا در مگیستا ثبت‌نام کرده‌اید. لطفا رمز عبور خود را وارد کنید.</div>
      </v-col>
    </v-card-title>

    <v-col class="py-0 px-8">
      <div class="text-subtitle-2 grey--text">
        حداقل 8 کاراکتر
      </div>
      <v-text-field
        v-model="password"
        label="رمز عبور"
        outlined
        dense
        class="py-2"
      />
    </v-col>

    <v-card-actions>
      <v-col>
        <v-row class="px-8">
          <v-btn
            block
            rounded
            class="primary font-weight-bold py-5"
            @click.prevent="$emit('submitForm', password)"
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
  </v-card>
</template>

<script>
export default {
  name: 'LoginPasswordForm',
  data () {
    return {
      password: ''
    }
  }
}
</script>
