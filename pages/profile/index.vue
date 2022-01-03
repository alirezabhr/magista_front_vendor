<template>
  <v-container class="indigo lighten-5" style="height: 100%">
    <v-dialog
      v-model="showDialog"
      max-width="600px"
    >
      <v-card color="grey lighten-3">
        <v-card-title class="text-h6 font-weight-bold">
          انتخاب حساب
        </v-card-title>

        <v-card-actions class="px-8 pb-5">
          <v-col cols="12" class="pa-0">
            <div v-if="getCurrentShopBankCredits.length > 0">
              <v-card
                v-for="credit in getCurrentShopBankCredits"
                :key="credit.sheba"
                class="my-3"
                @click.prevent="selectBankCredit(credit)"
              >
                <v-card-subtitle class="text-h6 mt-3">
                  <v-row justify="center" no-gutters>{{ credit.sheba }}</v-row>
                </v-card-subtitle>
                <v-card-text>
                  {{ credit.fullName }}
                </v-card-text>
              </v-card>
            </div>
            <v-row justify="center" no-gutters>
              <v-btn outlined color="white" class="primary--text" @click.prevent="">
                افزودن حساب جدید
              </v-btn>
            </v-row>
          </v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card class="pb-2 my-2 mx-4">
      <v-card-title class="font-weight-bold text-h5 primary--text pb-3">
        <v-row justify="center" no-gutters>
          اطلاعات فروشگاه
        </v-row>
      </v-card-title>
      <v-card-text class="py-1">
        نام فروشگاه: <span v-if="getCurrentShop">{{ getCurrentShop.instagramUsername }}</span>
      </v-card-text>
      <v-card-text class="py-1">
        آدرس: <span v-if="getCurrentShop">{{ getCurrentShop.province }}-{{ getCurrentShop.city }}،{{ getCurrentShop.address }}</span>
      </v-card-text>
      <v-card-text class="py-1">
        ایمیل: <span v-if="getCurrentShop">{{ getCurrentShop.email }}</span>
      </v-card-text>
    </v-card>
    <v-card class="pb-2 my-4 mx-4">
      <v-card-title class="font-weight-bold text-h5 primary--text pb-3">
        <v-row justify="center" no-gutters>
          کیف پول
        </v-row>
      </v-card-title>
      <v-card-text class="py-1">
        موجودی قابل برداشت: <span v-if="getCurrentShop">{{ getCurrentShop.remainingAmount }}</span>
      </v-card-text>
      <v-card-actions>
        <v-col cols="6" class="pa-0 mx-auto">
          <v-btn width="100%" class="yellow darken-1 white--text font-weight-bold" @click.prevent="showDialog = true">
            تسویه
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
    <v-row no-gutters>
      <v-btn class="mx-auto font-weight-bold text-body-1" outlined color="red" text @click.prevent="userLogout">خروج</v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProfilePage',
  layout: 'panel',
  data () {
    return {
      showDialog: false
    }
  },
  computed: {
    ...mapGetters('shop', ['getCurrentShop', 'getCurrentShopBankCredits'])
  },
  mounted () {
    this.currentShopBankCredits()
  },
  methods: {
    ...mapActions('shop', ['currentShopBankCredits']),
    ...mapActions('auth', ['userLogout']),

    selectBankCredit (credit) {
      this.showDialog = false
    }
  }
}
</script>
