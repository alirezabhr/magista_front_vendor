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
          محصولات شما در کدام دسته قرار می‌گیرد؟
        </div>
        <v-select
          v-model="categoryName"
          :items="categoriesName"
          :rules="categoryRules"
          label="دسته‌بندی"
          outlined
          dense
        />

        <div class="pt-2 pb-4 text-body-2">
          زمان آماده‌سازی محصول شما چقدر است؟
        </div>
        <v-select
          v-model="shopData.preparation"
          :items="preparationTimeItems"
          :rules="preparationRules"
          label="زمان آماده‌سازی"
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
            :disabled="isSubmittingForm"
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
import { mapGetters, mapActions } from 'vuex'

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
      isLoadingCategories: false,
      categoryName: '',
      shopData: {
        bio: '',
        category: 0,
        preparation: ''
      },
      bioRules: [
        value => value.length < 350 || 'بیو طولانی است.'
      ],
      categoryRules: [
        value => !!value || 'دسته‌بندی انتخاب نشده است'
      ],
      preparationRules: [
        value => !!value || 'زمان آماده‌سازی مشخص نشده است'
      ],
      preparationTimeItems: ['تا 2 ساعت', 'تا 12 ساعت', 'تا 1 روز', 'تا 3 روز', 'تا یک هفته']
    }
  },
  computed: {
    ...mapGetters('shop', ['getAllCategories']),

    categoriesName () {
      return this.getAllCategories.map((e) => e.name)
    }
  },
  watch: {
    categoryName (newCategoryName) {
      const cat = this.getAllCategories.find((e) => e.name === newCategoryName)
      this.shopData.category = cat.id
    }
  },
  mounted (){ 
    this.isLoadingCategories = true
    this.allCategories().then(() => {
      this.isLoadingCategories = false
    }).catch(() => {
      this.isLoadingCategories = false
    })
  },
  methods: {
    ...mapActions('shop', ['allCategories']),

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
