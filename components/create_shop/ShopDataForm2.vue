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
          تا کجا هزینه ارسال را می‌پردازید؟
        </div>
        <v-select
          v-model="shopData.delivery"
          :items="freeDeliveryItems"
          label="محدوده ارسال رایگان"
          dense
          outlined
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
        preparation: '',
        delivery: ''
      },
      bioRules: [
        value => value.length < 350 || 'بیو طولانی است.'
      ],
      freeDeliveryItems: ['ارسال رایگان ندارم', 'ارسال درون‌شهری رایگان', 'ارسال به کل کشور رایگان'],
      preparationTimeItems: ['تا 2 ساعت', 'تا 12 ساعت', 'تا 1 روز', 'تا 3 روز', 'تا یک هفته']
    }
  },
  computed: {
  },
  methods: {
    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        const payload = { ...this.shopData }
        payload.delivery = this.freeDeliveryItems.indexOf(this.shopData.delivery)
        payload.preparation = this.preparationTimeItems.indexOf(this.shopData.preparation)
        this.$emit('submit', payload)
      }
    }
  }
}
</script>
