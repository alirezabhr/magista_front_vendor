<template>
  <v-card class="pb-4">
    <v-card-title>
      <v-col>
        <div class="text-h6 font-weight-bold">ثبت‌نام / ورود</div>
        <div class="text-subtitle-2 font-weight-light pt-2">شماره موبایل خود را وارد کنید.</div>
      </v-col>
    </v-card-title>

    <v-col class="py-0 px-8">
      <div class="text-subtitle-2 grey--text">
        مثال:
        <span class="ltr">0912 ××× ×× ××</span>
      </div>
      <v-text-field
        v-model="phoneNo"
        label="شماره موبایل"
        outlined
        dense
        class="py-2"
        type="number"
      />
    </v-col>

    <v-card-actions class="px-8">
      <v-btn
        block
        rounded
        class="primary font-weight-bold py-5"
        :loading="isSubmittingPhone"
        @click.prevent="$emit('submitForm', phoneNo)"
      >
        تایید
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'PhoneForm',
  props: {
    isSubmittingPhone: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      phoneNo: ''
    }
  }
}
</script>

<style scoped>
.ltr {
    direction: ltr;
    text-align: left;
    display: inline-block;
}
</style>
