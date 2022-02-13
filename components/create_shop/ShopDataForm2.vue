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
        <v-textarea
          v-model="shopData.bio"
          label="بیو (اختیاری)"
          :rules="bioRules"
          placeholder="درباره فروشگاه خود توضیح بدهید."
          height="80px"
          outlined
          dense
        />
        <div class="pt-2 pb-4 text-body-2">
          زمان آماده‌سازی محصول شما چقدر است؟
        </div>
        <v-select
          v-model="shopData.preparation"
          :items="preparationTimeItems"
          label="زمان آماده‌سازی‏‌"
          dense
          outlined
        />
      </v-col>

      <v-card-actions class="px-8">
        <v-col>
          <v-btn
            block
            class="primary font-weight-bold py-5"
            :loading="isSubmittingForm"
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
  name: 'ShopDataForm2',
  props: {
    isSubmittingForm: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      shopData: {
        bio: '',
        preparation: ''
      },
      bioRules: [
        value => value.length < 350 || 'بیو طولانی است.'
      ],
      preparationTimeItems: ['تا 2 ساعت', 'تا 12 ساعت', 'تا 1 روز', 'تا 3 روز', 'تا یک هفته']
    }
  },
  methods: {
    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        const payload = { ...this.shopData }
        payload.preparation = this.preparationTimeItems.indexOf(this.shopData.preparation)
        this.$emit('submit', payload)
      }
    }
  }
}
</script>
