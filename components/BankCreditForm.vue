<template>
  <v-card>
    <v-form
      ref="form"
      lazy-validation
      @submit.prevent="validateAndSubmitForm"
    >
      <v-card-title>
        <div class="text-h6 font-weight-bold">افزودن حساب جدید</div>
        <v-spacer />
        <v-btn icon @click.prevent="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-col class="py-0 px-8">
        <v-row v-show="finalPrice" no-gutters class="pb-2 text-body1" align="center">
          <div class="text-decoration-line-through font-weight-medium">{{ productPrice }}</div>
          <v-icon class="px-2">mdi-chevron-triple-left</v-icon>
          <div class="font-weight-bold primary--text">{{ finalPrice }}</div>
        </v-row>
        <v-text-field
          v-model="discountPercent"
          label="درصد تخفیف"
          :rules="discountPercentRules"
          type="number"
          prefix="%"
          outlined
          dense
        />
        <v-textarea
          v-model="discountDescription"
          label="توضیح (اختیاری)"
          :rules="discountDescriptionRules"
          outlined
          dense
        />
      </v-col>
      <v-card-actions class="px-8 pb-5 pt-4">
        <v-col cols="12">
          <v-row justify="center">
            <v-btn
              block
              class="primary font-weight-bold py-5"
              :loading="isSubmittingForm"
              type="submit"
            >
              ثبت
            </v-btn>
          </v-row>
        </v-col>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {

}
</script>
