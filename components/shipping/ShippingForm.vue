<template>
  <div>
    <v-dialog
      v-model="showDialog"
      max-width="600px"
    >
      <DeliveryCostsDialog v-if="dialog === 'delivery costs'" />
      <DeliveryMethodsDialog v-else-if="dialog === 'delivery methods'" />
    </v-dialog>
    <v-snackbar
      v-model="showSnackbar"
      elevation="24"
    >
      {{ snackbarMessage }}
    </v-snackbar>

    <v-card color="lighten-3 my-3">
      <v-col class="px-8 pt-8">
        <div class="font-weight-bold text-body-1">محدوده ارسال</div>
        <v-radio-group v-model="shippingData.sendEverywhere" class="my-2">
          <v-radio
            label="همه ایران"
            :value="true"
          />
          <v-radio
            :label="`فقط به ${shopCity}`"
            :value="false"
          />
        </v-radio-group>
      </v-col>
      <v-col class="px-8 py-0">
        <div class="font-weight-bold text-body-1">
          هزینه ارسال
          <!-- <v-btn icon @click.prevent="showDeliveryCostsHelp"><v-icon color="red">mdi-help-circle-outline</v-icon></v-btn> -->
        </div>
        <v-row align="center" no-gutters>
          <v-col>
            <span v-show="cityCostWarning" class="font-wight-bold text-h6 red--text text--darken-1">!</span>
            <span>ارسال به {{ shopCity }}</span>
          </v-col>
          <v-col>
            <v-select
              v-model="shippingData.cityCost"
              :items="costOptions"
              outlined
              hide-details
              dense
            />
          </v-col>
        </v-row>
        <v-col v-if="shippingData.cityCost === costOptions[1]">
          <div class="grey--text text--darken-2 text-subtitle-2">ارسال رایگان به <strong>{{ shopCity }}</strong> برای خریدهای بالاتر از: </div>
          <v-row align="center" no-gutters>
            <v-col cols="4">
              <v-select
                v-model="shippingData.cityFreeCostFrom"
                :items="freeCostFromOptions"
                outlined
                hide-details
                dense
              />
            </v-col>
            <v-col cols="8" class="px-3">
              <div class="text-subtitle-2 font-weight-bold">{{ cityFreeCostFromText }} هزار تومان</div>
            </v-col>
          </v-row>
        </v-col>
        <div v-if="shippingData.sendEverywhere">
          <v-row class="pt-2" align="center" no-gutters>
            <v-col>
              <span v-show="countryCostWarning" class="font-wight-bold text-h6 red--text text--darken-1">!</span>
              <span>ارسال سراسر ایران</span>
            </v-col>
            <v-col>
              <v-select
                v-model="shippingData.countryCost"
                :items="costOptions"
                outlined
                hide-details
                dense
              />
            </v-col>
          </v-row>
          <v-col v-if="shippingData.countryCost === costOptions[1]">
            <div class="grey--text text--darken-2 text-subtitle-2">ارسال رایگان به <strong>سراسر ایران</strong> برای خریدهای بالاتر از: </div>
            <v-row align="center" no-gutters>
              <v-col cols="4">
                <v-select
                  v-model="shippingData.countryFreeCostFrom"
                  :items="freeCostFromOptions"
                  outlined
                  hide-details
                  dense
                />
              </v-col>
              <v-col cols="8" class="px-3">
                <div class="text-subtitle-2 font-weight-bold">{{ countryFreeCostFromText }} هزار تومان</div>
              </v-col>
            </v-row>
          </v-col>
        </div>
      </v-col>
      <v-col class="px-8 pt-8">
        <div class="font-weight-bold text-body-1">
          روش‌ ارسال
          <!-- <v-btn icon @click.prevent="showDeliveryMethodsHelp"><v-icon color="red">mdi-help-circle-outline</v-icon></v-btn> -->
        </div>
        <div class="grey--text text--darken-2 text-subtitle-2 pb-3">با چه روش‌هایی ارسال می‌کنید؟</div>
        <div class="py-2">
          <v-col cols="6" sm="5" md="4" lg="3" class="py-0">
            <v-checkbox
              v-model="shippingData.hasNationalPost"
              label="پست پیشتاز"
              class="my-0"
              hide-details
            />
          </v-col>
          <v-row v-if="shippingData.hasNationalPost" class="py-2" align="center" no-gutters>
            <v-col cols="7">
              <div class="text-caption">هزینه پایه</div>
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="shippingData.nationalPost.base"
                type="number"
                label="هزینه پایه"
                suffix="تومان"
                hide-details
                outlined
                dense
              />
            </v-col>
          </v-row>
          <v-row v-if="shippingData.hasNationalPost" class="py-2" align="center" no-gutters>
            <v-col cols="7">
              <div class="text-caption">هزینه هر کیلوگرم وزن بیشتر</div>
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="shippingData.nationalPost.perKilo"
                type="number"
                label="هزینه هر کیلوگرم"
                suffix="تومان"
                hide-details
                outlined
                dense
              />
            </v-col>
          </v-row>
        </div>
        <div class="py-3">
          <v-col cols="6" sm="5" md="4" lg="3" class="py-0">
            <v-checkbox
              v-model="shippingData.hasOnlineDelivery"
              label="پیک آنلاین"
              class="my-0"
              hide-details
            />
          </v-col>
          <v-row v-if="shippingData.hasOnlineDelivery" class="py-2" align="center" no-gutters>
            <v-col cols="7">
              <div class="text-caption">هزینه پایه</div>
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="shippingData.onlineDelivery.base"
                type="number"
                label="هزینه پایه"
                suffix="تومان"
                hide-details
                outlined
                dense
              />
            </v-col>
          </v-row>
          <v-row v-if="shippingData.hasOnlineDelivery" class="py-2" align="center" no-gutters>
            <v-col cols="7">
              <div class="text-caption">هزینه هر کیلوگرم وزن بیشتر</div>
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="shippingData.onlineDelivery.perKilo"
                type="number"
                label="هزینه هر کیلوگرم"
                suffix="تومان"
                hide-details
                outlined
                dense
              />
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-card-actions class="justify-center">
        <v-btn
          color="primary"
          class="my-3"
          rounded
          width="80%"
          :loading="isSubmitting"
          :disabled="isSubmitting"
          @click.prevent="submit"
        >
          ثبت
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import Num2persian from 'num2persian'
import DeliveryType from '@/models/shipping/delivery_type'
import AreaType from '@/models/shipping/area_type'
import DeliveryCostsDialog from '@/components/shipping/DeliveryCostsDialog.vue'
import DeliveryMethodsDialog from '@/components/shipping/DeliveryMethodsDialog.vue'

const fcfList = [80, 90, 100, 120, 150, 180, 200, 250, 300, 350, 400]
const costOptionsList = ['هزینه دارد', 'رایگان نسبی', 'کاملا رایگان']
// Change costOptionsList very carefully.

export default {
  name: 'ShippingForm',
  components: {
    DeliveryCostsDialog,
    DeliveryMethodsDialog
  },
  props: {
    shopDeliveryData: {
      type: Object,
      required: false,
      default: null
    },
    isSubmitting: {
      type: Boolean,
      required: true
    },
    shopCity: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      freeCostFromOptions: fcfList, // constant
      costOptions: costOptionsList, // constant
      shippingData: {
        sendEverywhere: true,
        hasNationalPost: false,
        hasOnlineDelivery: false,
        cityCost: null,
        countryCost: null,
        cityFreeCostFrom: fcfList[0],
        countryFreeCostFrom: fcfList[0],
        nationalPost: {
          type: DeliveryType.NATIONAL_POST,
          base: 13000,
          perKilo: 2700
        },
        onlineDelivery: {
          type: DeliveryType.ONLINE_DELIVERY,
          base: 15000,
          perKilo: 2000
        }
      },
      cityCostWarning: false,
      countryCostWarning: false,
      showDialog: false,
      dialog: '',
      showSnackbar: false,
      snackbarMessage: ''
    }
  },
  computed: {
    cityFreeCostFromText () {
      return Num2persian(this.shippingData.cityFreeCostFrom)
    },
    countryFreeCostFromText () {
      return Num2persian(this.shippingData.countryFreeCostFrom)
    }
  },
  watch: {
    'shippingData.cityCost' () {
      this.cityCostWarning = false
    },
    'shippingData.countryCost' () {
      this.countryCostWarning = false
    }
  },
  mounted () {
    if (this.shopDeliveryData) {
      this.setShopDeliveryPropData()
    }
  },
  methods: {
    setShopDeliveryPropData () {
      this.shippingData.sendEverywhere = this.shopDeliveryData.sendEverywhere

      this.shippingData.cityCost = costOptionsList[this.shopDeliveryData.cityCost]
      this.shippingData.countryCost = costOptionsList[this.shopDeliveryData.countryCost]
      if (this.shopDeliveryData.cityFreeCostFrom) {
        const freeFrom = this.shopDeliveryData.cityFreeCostFrom.freeFrom / 1000
        this.shippingData.cityFreeCostFrom = freeFrom
      }
      if (this.shopDeliveryData.countryFreeCostFrom) {
        const freeFrom = this.shopDeliveryData.countryFreeCostFrom.freeFrom / 1000
        this.shippingData.countryFreeCostFrom = freeFrom
      }
      this.shippingData.hasNationalPost = this.shopDeliveryData.hasNationalPost
      this.shippingData.hasOnlineDelivery = this.shopDeliveryData.hasOnlineDelivery

      if (this.shopDeliveryData.nationalPost !== null) {
        this.shippingData.nationalPost.base = this.shopDeliveryData.nationalPost.base
        this.shippingData.nationalPost.perKilo = this.shopDeliveryData.nationalPost.perKilo
      }
      if (this.shopDeliveryData.onlineDelivery !== null) {
        this.shippingData.onlineDelivery.base = this.shopDeliveryData.onlineDelivery.base
        this.shippingData.onlineDelivery.perKilo = this.shopDeliveryData.onlineDelivery.perKilo
      }
    },
    showDeliveryCostsHelp () {
      this.dialog = 'delivery costs'
      this.showDialog = true
    },
    showDeliveryMethodsHelp () {
      this.dialog = 'delivery methods'
      this.showDialog = true
    },
    checkFormValidation () {
      if (this.shippingData.cityCost === null) {
        this.cityCostWarning = true
        throw new Error(`هزینه ارسال به ${this.shopCity} را وارد کنید.`)
      }
      if (this.shippingData.sendEverywhere === true) {
        if (this.shippingData.countryCost === null) {
          this.countryCostWarning = true
          throw new Error('هزینه ارسال به سراسر ایران را وارد کنید.')
        }
        if (!this.shippingData.hasNationalPost) {
          throw new Error('برای ارسال به سراسر ایران باید پست پیشتاز را فعال کنید.')
        }
      }
      if (!this.shippingData.hasNationalPost && !this.shippingData.hasOnlineDelivery) {
        throw new Error('حداقل یک روش ارسال را انتخاب کنید.')
      }
      if (this.shippingData.nationalPost) {
        if (this.shippingData.nationalPost.base < 5000) {
          throw new Error('هزینه پایه پست پیشتاز باید حداقل پنج هزار تومان باشد.')
        }
        // if (!Number.isInteger(this.shippingData.nationalPost.base)) {
        //   throw new TypeError('هزینه پایه پست پیشتاز نامعتبر است.')
        // }
      }
      if (this.shippingData.nationalPost) {
        if (this.shippingData.nationalPost.perKilo < 0) {
          throw new Error('هزینه اضافی پست پیشتاز نامعتبر است.')
        }
        // copy of previous
        // if (this.shippingData.nationalPost.perKilo < 0 || !Number.isInteger(this.shippingData.nationalPost.perKilo)) {
        //   throw new Error('هزینه اضافی پست پیشتاز نامعتبر است.')
        // }
      }
      if (this.shippingData.onlineDelivery) {
        if (this.shippingData.onlineDelivery.base < 5000) {
          throw new Error('هزینه پایه پیک آنلاین باید حداقل پنج هزار تومان باشد.')
        }
        // if (!Number.isInteger(this.shippingData.onlineDelivery.base)) {
        //   throw new TypeError('هزینه پایه پیک آنلاین نامعتبر است.')
        // }
      }
      if (this.shippingData.onlineDelivery) {
        if (this.shippingData.onlineDelivery.perKilo < 0) {
          throw new Error('هزینه اضافی پیک آنلاین نامعتبر است.')
        }
        // copy of previous
        // if (this.shippingData.onlineDelivery.perKilo < 0 || !Number.isInteger(this.shippingData.onlineDelivery.perKilo)) {
        //   throw new Error('هزینه اضافی پیک آنلاین نامعتبر است.')
        // }
      }
    },
    makePayloadCorrect () {
      const payload = { ...this.shippingData }

      if (!payload.sendEverywhere) {
        payload.countryCost = null
        payload.countryFreeCostFrom = null
      }

      // country cost and free cost from
      if (payload.countryCost === costOptionsList[1]) {
        payload.countryFreeCostFrom = {
          type: AreaType.country,
          freeFrom: payload.countryFreeCostFrom * 1000
        }
      } else {
        payload.countryFreeCostFrom = null
      }
      if (payload.sendEverywhere) {
        payload.countryCost = costOptionsList.indexOf(payload.countryCost)
      }

      // city cost and free cost from
      if (payload.cityCost === costOptionsList[1]) {
        payload.cityFreeCostFrom = {
          type: AreaType.city,
          freeFrom: payload.cityFreeCostFrom * 1000
        }
      } else {
        payload.cityFreeCostFrom = null
      }
      payload.cityCost = costOptionsList.indexOf(payload.cityCost)

      if (!payload.hasNationalPost) {
        payload.nationalPost = null
      }
      if (!payload.hasOnlineDelivery) {
        payload.onlineDelivery = null
      }

      return payload
    },
    submit () {
      try {
        const payload = this.makePayloadCorrect()
        this.checkFormValidation()
        this.$emit('submit', payload)
      } catch (errorData) {
        this.snackbarMessage = errorData.message
        this.showSnackbar = true
      }
    }
  }
}
</script>
