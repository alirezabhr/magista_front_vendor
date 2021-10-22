<template>
  <v-card class="pb-4">
    <v-card-title>
      <v-col>
        <div class="text-h6 font-weight-bold">ثبت نام در مگیستا</div>
        <div class="text-subtitle-2 font-weight-light pt-2">رمز عبور خود را انتخاب کنید.</div>
      </v-col>
    </v-card-title>

    <v-col class="py-0 px-8">
      <div class="text-subtitle-2 grey--text">
        حداقل 8 کاراکتر
      </div>
      <v-text-field
        v-model="password"
        label="رمز عبور جدید"
        outlined
        dense
        class="py-2"
      />
    </v-col>

    <v-card-actions class="px-8">
      <v-btn
        block
        rounded
        class="primary font-weight-bold py-5"
        @click.prevent="$emit('submitForm', password)"
      >
        ثبت رمز عبور و ورود
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'SignupPasswordForm',
  data () {
    return {
      password: ''
    }
  }
}
</script>
