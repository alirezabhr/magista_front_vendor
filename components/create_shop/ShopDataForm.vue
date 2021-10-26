<template>
  <v-card class="pb-4 ma-6">
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="validateAndSubmitForm"
    >
      <v-card-title>
        <v-col>
          <div class="text-h6 font-weight-bold">ثبت اطلاعات فروشگاه</div>
        </v-col>
      </v-card-title>

      <v-col class="py-0 px-8">
        <v-text-field
          v-model="email"
          label="ایمیل"
          :rules="emailRules"
          outlined
          dense
          class="py-2"
          style="direction: ltr"
        />
        <v-text-field
          v-model="instagramId"
          label="آیدی اینستاگرام"
          :rules="igIdRules"
          outlined
          dense
          class="py-2"
          style="direction: ltr"
        />
        <v-text-field
          v-model="instagramId"
          label="آیدی اینستاگرام"
          :rules="igIdRules"
          outlined
          dense
          class="py-2"
          style="direction: ltr"
        />
        <v-text-field
          v-model="instagramId"
          label="آیدی اینستاگرام"
          :rules="igIdRules"
          outlined
          dense
          class="py-2"
          style="direction: ltr"
        />
      </v-col>

      <v-card-actions class="px-8">
        <v-col>
          <v-btn
            block
            class="primary font-weight-bold py-5"
            :loading="isSubmittingIgId"
            type="submit"
          >
            ثبت و ادامه
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: 'ShopDataForm',
  props: {
    isSubmittingForm: {
      type: Boolean,
      required: true
    }
  }
}
</script>
