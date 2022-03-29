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
          v-model="shopData.email"
          label="ایمیل(اختیاری)"
          :rules="emailRules"
          outlined
          dense
          style="direction: ltr"
        />
        <v-row no-gutters>
          <v-col cols="12" md="6" class="my-0 py-0">
            <v-autocomplete
              v-model="shopData.province"
              label="استان"
              :items="getAllProvinces"
              :rules="provinceRules"
              outlined
              dense
            >
              <template #no-data>
                <v-list-item>
                  <v-list-item-title>
                    هیچ استانی با این مشخصات پیدا نشد.
                  </v-list-item-title>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="12" md="6" class="my-0 py-0">
            <v-autocomplete
              v-model="shopData.city"
              label="شهر"
              :items="getProvinceCities"
              :rules="cityRules"
              outlined
              dense
            >
              <template #no-data>
                <v-list-item>
                  <v-list-item-title>
                    هیچ شهری با این مشخصات پیدا نشد.
                  </v-list-item-title>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
        <v-textarea
          v-model="shopData.address"
          label="آدرس"
          :rules="addressRules"
          outlined
          dense
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
import provincesAndCities from '@/assets/json/iran_cities.json'

export default {
  name: 'ShopDataForm',
  props: {
    isSubmittingForm: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      shopData: {
        email: '',
        province: '',
        city: '',
        address: ''
      },
      emailRules: [
        value => (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || value === '') || '.ایمیل نامعتبر است'
      ],
      provinceRules: [
        value => !!value || 'استان الزامی است.',
        value => this.getAllProvinces.includes(value) || 'استان نامعتبر است.'
      ],
      cityRules: [
        value => !!value || 'شهر الزامی است.',
        value => this.getProvinceCities.includes(value) || 'شهر نامعتبر است.'
      ],
      addressRules: [
        value => !!value || 'آدرس الزامی می‌باشد.',
        value => !/^\s+$/.test(value) || 'آدرس نامعتبر است.'
      ]
    }
  },
  computed: {
    getAllProvinces () {
      return Array.from(provincesAndCities, item => item.name)
    },
    getProvinceCities () {
      if (this.getAllProvinces.includes(this.shopData.province)) {
        const province = provincesAndCities.find(province => province.name === this.shopData.province)
        return Array.from(province.cities, item => item.name)
      }
      return []
    }
  },
  methods: {
    validateAndSubmitForm () {
      if (this.$refs.form.validate()) {
        this.$emit('submit', this.shopData)
      }
    }
  }
}
</script>
